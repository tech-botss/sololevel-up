import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Quest, ActiveQuest, CompletedQuest, calculateLevelFromXp, calculateGoldReward, calculateLatePenalty } from '@/types/game';

interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  level: number;
  current_xp: number;
  total_xp: number;
  gold: number;
  stat_str: number;
  stat_int: number;
  stat_end: number;
  stat_wil: number;
  stat_soc: number;
  current_streak: number;
  longest_streak: number;
  total_quests_completed: number;
  total_gold_earned: number;
  restores_remaining: number;
  country?: string;
  state?: string;
  city?: string;
  rank_global: number;
  rank_country: number;
  rank_state: number;
  rank_city: number;
  active_title?: string;
  missed_days: number;
  gender?: string;
}

interface EquippedCosmetics {
  avatar?: string;
  outfit?: string;
  weapon?: string;
  aura?: string;
  name_color?: string;
  frame?: string;
}

interface GameState {
  profile: UserProfile | null;
  activeQuest: ActiveQuest | null;
  questsCompletedToday: number;
  loading: boolean;
  ownedCosmetics: string[];
  equippedCosmetics: EquippedCosmetics;
  
  // Actions
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  startQuest: (quest: Quest) => void;
  pauseQuest: () => void;
  resumeQuest: () => void;
  completeQuest: () => Promise<{ xpEarned: number; goldEarned: number; wasLate: boolean; leveledUp: boolean; newLevel?: number }>;
  abandonQuest: () => void;
  updateQuestTimer: (remainingSeconds: number) => void;
  purchaseCosmetic: (cosmeticId: string, price: number) => Promise<boolean>;
  fetchOwnedCosmetics: (userId: string) => Promise<void>;
  equipCosmetic: (cosmeticId: string, category: string) => Promise<boolean>;
  unequipCosmetic: (category: string) => Promise<boolean>;
}

export const useGameStore = create<GameState>()((set, get) => ({
  profile: null,
  activeQuest: null,
  questsCompletedToday: 0,
  loading: false,
  ownedCosmetics: [],
  equippedCosmetics: {},
  
  fetchProfile: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      set({ profile: data as UserProfile, loading: false });
      
      // Also fetch owned cosmetics
      get().fetchOwnedCosmetics(userId);
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false });
    }
  },
  
  fetchOwnedCosmetics: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_cosmetics')
        .select('cosmetic_id, equipped')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      const owned = data?.map(c => c.cosmetic_id) || [];
      const equipped: EquippedCosmetics = {};
      
      // Build equipped cosmetics map
      data?.forEach(c => {
        if (c.equipped) {
          // Determine category from cosmetic_id prefix
          if (c.cosmetic_id.startsWith('avatar-')) equipped.avatar = c.cosmetic_id;
          else if (c.cosmetic_id.startsWith('outfit-')) equipped.outfit = c.cosmetic_id;
          else if (c.cosmetic_id.startsWith('weapon-')) equipped.weapon = c.cosmetic_id;
          else if (c.cosmetic_id.startsWith('aura-')) equipped.aura = c.cosmetic_id;
          else if (c.cosmetic_id.startsWith('color-')) equipped.name_color = c.cosmetic_id;
          else if (c.cosmetic_id.startsWith('frame-')) equipped.frame = c.cosmetic_id;
        }
      });
      
      set({ ownedCosmetics: owned, equippedCosmetics: equipped });
    } catch (error) {
      console.error('Error fetching owned cosmetics:', error);
    }
  },
  
  updateProfile: async (updates: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);
      
      if (error) throw error;
      set({ profile: { ...profile, ...updates } });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },
  
  startQuest: (quest: Quest) => {
    const activeQuest: ActiveQuest = {
      ...quest,
      startedAt: new Date(),
      remainingSeconds: quest.estimatedMinutes * 60,
      isPaused: false,
      totalPausedTime: 0,
    };
    set({ activeQuest });
  },
  
  pauseQuest: () => {
    const { activeQuest } = get();
    if (activeQuest && !activeQuest.isPaused) {
      set({
        activeQuest: {
          ...activeQuest,
          isPaused: true,
          pausedAt: new Date(),
        },
      });
    }
  },
  
  resumeQuest: () => {
    const { activeQuest } = get();
    if (activeQuest && activeQuest.isPaused && activeQuest.pausedAt) {
      const pausedDuration = (Date.now() - activeQuest.pausedAt.getTime()) / 1000;
      set({
        activeQuest: {
          ...activeQuest,
          isPaused: false,
          pausedAt: undefined,
          totalPausedTime: activeQuest.totalPausedTime + pausedDuration,
        },
      });
    }
  },
  
  completeQuest: async () => {
    const { activeQuest, profile, questsCompletedToday } = get();
    if (!activeQuest || !profile) return { xpEarned: 0, goldEarned: 0, wasLate: false, leveledUp: false };
    
    const timeTaken = (activeQuest.estimatedMinutes * 60) - activeQuest.remainingSeconds;
    const wasLate = activeQuest.remainingSeconds < 0;
    const minutesLate = wasLate ? Math.abs(activeQuest.remainingSeconds) / 60 : 0;
    const penalty = calculateLatePenalty(minutesLate);
    
    const xpEarned = Math.floor(activeQuest.xpReward * (1 - penalty / 100));
    const goldEarned = activeQuest.goldReward;
    
    const newTotalXp = profile.total_xp + xpEarned;
    const { level: newLevel, currentXp } = calculateLevelFromXp(newTotalXp);
    const leveledUp = newLevel > profile.level;
    const levelUpGold = leveledUp ? calculateGoldReward(newLevel) : 0;
    
    // Update stats
    const statUpdates: Partial<UserProfile> = {};
    if (activeQuest.statBoosts.str) statUpdates.stat_str = Math.min(100, profile.stat_str + activeQuest.statBoosts.str);
    if (activeQuest.statBoosts.int) statUpdates.stat_int = Math.min(100, profile.stat_int + activeQuest.statBoosts.int);
    if (activeQuest.statBoosts.end) statUpdates.stat_end = Math.min(100, profile.stat_end + activeQuest.statBoosts.end);
    if (activeQuest.statBoosts.wil) statUpdates.stat_wil = Math.min(100, profile.stat_wil + activeQuest.statBoosts.wil);
    if (activeQuest.statBoosts.soc) statUpdates.stat_soc = Math.min(100, profile.stat_soc + activeQuest.statBoosts.soc);
    
    // Save completed quest to database
    try {
      await supabase.from('completed_quests').insert({
        user_id: profile.id,
        quest_id: activeQuest.id,
        quest_name: activeQuest.name,
        xp_earned: xpEarned,
        gold_earned: goldEarned,
        time_taken: Math.abs(timeTaken),
        was_late: wasLate,
      });
      
      // Update profile
      await supabase.from('profiles').update({
        level: newLevel,
        current_xp: currentXp,
        total_xp: newTotalXp,
        gold: profile.gold + goldEarned + levelUpGold,
        total_quests_completed: profile.total_quests_completed + 1,
        total_gold_earned: profile.total_gold_earned + goldEarned + levelUpGold,
        ...statUpdates,
      }).eq('id', profile.id);
      
      set({
        activeQuest: null,
        profile: {
          ...profile,
          level: newLevel,
          current_xp: currentXp,
          total_xp: newTotalXp,
          gold: profile.gold + goldEarned + levelUpGold,
          total_quests_completed: profile.total_quests_completed + 1,
          total_gold_earned: profile.total_gold_earned + goldEarned + levelUpGold,
          ...statUpdates,
        },
        questsCompletedToday: questsCompletedToday + 1,
      });
    } catch (error) {
      console.error('Error completing quest:', error);
    }
    
    return { xpEarned, goldEarned: goldEarned + levelUpGold, wasLate, leveledUp, newLevel: leveledUp ? newLevel : undefined };
  },
  
  abandonQuest: () => {
    set({ activeQuest: null });
  },
  
  updateQuestTimer: (remainingSeconds: number) => {
    const { activeQuest } = get();
    if (activeQuest) {
      set({
        activeQuest: {
          ...activeQuest,
          remainingSeconds,
        },
      });
    }
  },
  
  purchaseCosmetic: async (cosmeticId: string, price: number) => {
    const { profile, ownedCosmetics } = get();
    if (!profile || profile.gold < price) return false;
    
    try {
      await supabase.from('user_cosmetics').insert({
        user_id: profile.id,
        cosmetic_id: cosmeticId,
      });
      
      await supabase.from('profiles').update({
        gold: profile.gold - price,
      }).eq('id', profile.id);
      
      set({
        profile: {
          ...profile,
          gold: profile.gold - price,
        },
        ownedCosmetics: [...ownedCosmetics, cosmeticId],
      });
      return true;
    } catch (error) {
      console.error('Error purchasing cosmetic:', error);
      return false;
    }
  },
  
  equipCosmetic: async (cosmeticId: string, category: string) => {
    const { profile, equippedCosmetics, ownedCosmetics } = get();
    if (!profile || !ownedCosmetics.includes(cosmeticId)) return false;
    
    try {
      // First unequip any currently equipped item of this category
      const categoryKey = category === 'avatars' ? 'avatar' : 
                         category === 'outfits' ? 'outfit' :
                         category === 'weapons' ? 'weapon' :
                         category === 'auras' ? 'aura' :
                         category === 'name_colors' ? 'name_color' : 'frame';
      
      const currentEquipped = equippedCosmetics[categoryKey as keyof EquippedCosmetics];
      
      if (currentEquipped) {
        await supabase.from('user_cosmetics')
          .update({ equipped: false })
          .eq('user_id', profile.id)
          .eq('cosmetic_id', currentEquipped);
      }
      
      // Equip the new item
      await supabase.from('user_cosmetics')
        .update({ equipped: true })
        .eq('user_id', profile.id)
        .eq('cosmetic_id', cosmeticId);
      
      // Update avatar_url in profile if equipping an avatar
      if (category === 'avatars') {
        await supabase.from('profiles')
          .update({ avatar_url: cosmeticId })
          .eq('id', profile.id);
        
        set({
          profile: { ...profile, avatar_url: cosmeticId },
          equippedCosmetics: { ...equippedCosmetics, [categoryKey]: cosmeticId }
        });
      } else {
        set({
          equippedCosmetics: { ...equippedCosmetics, [categoryKey]: cosmeticId }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error equipping cosmetic:', error);
      return false;
    }
  },
  
  unequipCosmetic: async (category: string) => {
    const { profile, equippedCosmetics } = get();
    if (!profile) return false;
    
    const categoryKey = category === 'avatars' ? 'avatar' : 
                       category === 'outfits' ? 'outfit' :
                       category === 'weapons' ? 'weapon' :
                       category === 'auras' ? 'aura' :
                       category === 'name_colors' ? 'name_color' : 'frame';
    
    const currentEquipped = equippedCosmetics[categoryKey as keyof EquippedCosmetics];
    if (!currentEquipped) return true;
    
    try {
      await supabase.from('user_cosmetics')
        .update({ equipped: false })
        .eq('user_id', profile.id)
        .eq('cosmetic_id', currentEquipped);
      
      const newEquipped = { ...equippedCosmetics };
      delete newEquipped[categoryKey as keyof EquippedCosmetics];
      
      set({ equippedCosmetics: newEquipped });
      return true;
    } catch (error) {
      console.error('Error unequipping cosmetic:', error);
      return false;
    }
  },
}));
