import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Quest, ActiveQuest, calculateLevelFromXp, calculateGoldReward, calculateLatePenalty } from '@/types/game';
import { achievements } from '@/data/achievements';
import { toast } from 'sonner';

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

// Achievement checking helper function
async function checkAchievements(
  userId: string,
  profileData: {
    level: number;
    total_quests_completed: number;
    current_streak: number;
    longest_streak: number;
    total_gold_earned: number;
    stat_str: number;
    stat_int: number;
    stat_end: number;
    stat_wil: number;
    stat_soc: number;
    rank_country: number;
    rank_state: number;
    rank_global: number;
  }
): Promise<string[]> {
  try {
    const { data: unlockedData } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    
    const unlockedIds = new Set(unlockedData?.map(a => a.achievement_id) || []);
    
    const { count: friendsCount } = await supabase
      .from('friends')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    const { count: cosmeticsCount } = await supabase
      .from('user_cosmetics')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    const { data: completedQuests } = await supabase
      .from('completed_quests')
      .select('quest_name')
      .eq('user_id', userId);
    
    const categoryCounts = { study: 0, fitness: 0, coding: 0, money: 0, social: 0 };
    
    completedQuests?.forEach(q => {
      const name = q.quest_name.toLowerCase();
      if (name.includes('study') || name.includes('read') || name.includes('learn')) categoryCounts.study++;
      else if (name.includes('workout') || name.includes('run') || name.includes('exercise') || name.includes('fitness')) categoryCounts.fitness++;
      else if (name.includes('code') || name.includes('program') || name.includes('develop')) categoryCounts.coding++;
      else if (name.includes('money') || name.includes('work') || name.includes('earn') || name.includes('invest')) categoryCounts.money++;
      else if (name.includes('social') || name.includes('friend') || name.includes('meet') || name.includes('call')) categoryCounts.social++;
    });
    
    const newlyUnlocked: string[] = [];
    
    for (const ach of achievements) {
      if (unlockedIds.has(ach.id)) continue;
      
      let shouldUnlock = false;
      
      switch (ach.id) {
        case 'ach-first-steps': shouldUnlock = profileData.total_quests_completed >= 1; break;
        case 'ach-getting-started': shouldUnlock = profileData.total_quests_completed >= 5; break;
        case 'ach-early-bird': shouldUnlock = profileData.current_streak >= 5 || profileData.longest_streak >= 5; break;
        case 'ach-level-5': shouldUnlock = profileData.level >= 5; break;
        case 'ach-level-10': shouldUnlock = profileData.level >= 10; break;
        case 'ach-consistency': shouldUnlock = profileData.current_streak >= 7 || profileData.longest_streak >= 7; break;
        case 'ach-gold-saver': shouldUnlock = profileData.total_gold_earned >= 5000; break;
        case 'ach-first-friend': shouldUnlock = (friendsCount || 0) >= 1; break;
        case 'ach-study-champion': shouldUnlock = categoryCounts.study >= 30; break;
        case 'ach-fitness-warrior': shouldUnlock = categoryCounts.fitness >= 30; break;
        case 'ach-code-master': shouldUnlock = categoryCounts.coding >= 30; break;
        case 'ach-money-maker': shouldUnlock = categoryCounts.money >= 30; break;
        case 'ach-social-butterfly': shouldUnlock = categoryCounts.social >= 30; break;
        case 'ach-rising-star': shouldUnlock = profileData.level >= 20; break;
        case 'ach-unbreakable': shouldUnlock = profileData.current_streak >= 30 || profileData.longest_streak >= 30; break;
        case 'ach-stat-milestone': 
          shouldUnlock = profileData.stat_str >= 50 && profileData.stat_int >= 50 && profileData.stat_end >= 50 && profileData.stat_wil >= 50 && profileData.stat_soc >= 50;
          break;
        case 'ach-gold-maker': shouldUnlock = profileData.total_gold_earned >= 50000; break;
        case 'ach-quest-50': shouldUnlock = profileData.total_quests_completed >= 50; break;
        case 'ach-top-country': shouldUnlock = profileData.rank_country > 0 && profileData.rank_country <= 100; break;
        case 'ach-friend-circle': shouldUnlock = (friendsCount || 0) >= 10; break;
        case 'ach-b-rank': shouldUnlock = profileData.level >= 30; break;
        case 'ach-a-rank': shouldUnlock = profileData.level >= 40; break;
        case 'ach-quest-master': shouldUnlock = profileData.total_quests_completed >= 100; break;
        case 'ach-stat-expert':
          shouldUnlock = profileData.stat_str >= 80 && profileData.stat_int >= 80 && profileData.stat_end >= 80 && profileData.stat_wil >= 80 && profileData.stat_soc >= 80;
          break;
        case 'ach-eternal-flame': shouldUnlock = profileData.current_streak >= 60 || profileData.longest_streak >= 60; break;
        case 'ach-gold-mountain': shouldUnlock = profileData.total_gold_earned >= 200000; break;
        case 'ach-top-state': shouldUnlock = profileData.rank_state === 1; break;
        case 'ach-cosmetic-collector': shouldUnlock = (cosmeticsCount || 0) >= 20; break;
        case 'ach-shadow-monarch': shouldUnlock = profileData.level >= 50; break;
        case 'ach-s-rank': shouldUnlock = profileData.level >= 75; break;
        case 'ach-ascendant': shouldUnlock = profileData.level >= 100; break;
        case 'ach-immortal-flame': shouldUnlock = profileData.current_streak >= 365 || profileData.longest_streak >= 365; break;
        case 'ach-world-ranker': shouldUnlock = profileData.rank_global > 0 && profileData.rank_global <= 10; break;
      }
      
      if (shouldUnlock) {
        await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: ach.id,
        });
        
        newlyUnlocked.push(ach.id);
        
        toast.success(`🏆 Achievement Unlocked: ${ach.name}`, {
          description: ach.description,
          duration: 5000,
        });
      }
    }
    
    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

interface GameState {
  profile: UserProfile | null;
  activeQuest: ActiveQuest | null;
  questsCompletedToday: number;
  loading: boolean;
  ownedCosmetics: string[];
  equippedCosmetics: EquippedCosmetics;
  
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  startQuest: (quest: Quest) => void;
  pauseQuest: () => void;
  resumeQuest: () => void;
  completeQuest: () => Promise<{ xpEarned: number; goldEarned: number; wasLate: boolean; leveledUp: boolean; newLevel?: number; achievementsUnlocked?: string[] }>;
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
      
      data?.forEach(c => {
        if (c.equipped) {
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
    
    const statUpdates: Partial<UserProfile> = {};
    if (activeQuest.statBoosts.str) statUpdates.stat_str = Math.min(100, profile.stat_str + activeQuest.statBoosts.str);
    if (activeQuest.statBoosts.int) statUpdates.stat_int = Math.min(100, profile.stat_int + activeQuest.statBoosts.int);
    if (activeQuest.statBoosts.end) statUpdates.stat_end = Math.min(100, profile.stat_end + activeQuest.statBoosts.end);
    if (activeQuest.statBoosts.wil) statUpdates.stat_wil = Math.min(100, profile.stat_wil + activeQuest.statBoosts.wil);
    if (activeQuest.statBoosts.soc) statUpdates.stat_soc = Math.min(100, profile.stat_soc + activeQuest.statBoosts.soc);
    
    const newProfileData = {
      level: newLevel,
      current_xp: currentXp,
      total_xp: newTotalXp,
      gold: profile.gold + goldEarned + levelUpGold,
      total_quests_completed: profile.total_quests_completed + 1,
      total_gold_earned: profile.total_gold_earned + goldEarned + levelUpGold,
      stat_str: statUpdates.stat_str ?? profile.stat_str,
      stat_int: statUpdates.stat_int ?? profile.stat_int,
      stat_end: statUpdates.stat_end ?? profile.stat_end,
      stat_wil: statUpdates.stat_wil ?? profile.stat_wil,
      stat_soc: statUpdates.stat_soc ?? profile.stat_soc,
    };
    
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
      
      await supabase.from('profiles').update({
        ...newProfileData,
      }).eq('id', profile.id);
      
      set({
        activeQuest: null,
        profile: { ...profile, ...newProfileData },
        questsCompletedToday: questsCompletedToday + 1,
      });
      
      // Check achievements after quest completion
      const achievementsUnlocked = await checkAchievements(profile.id, {
        level: newProfileData.level,
        total_quests_completed: newProfileData.total_quests_completed,
        current_streak: profile.current_streak,
        longest_streak: profile.longest_streak,
        total_gold_earned: newProfileData.total_gold_earned,
        stat_str: newProfileData.stat_str,
        stat_int: newProfileData.stat_int,
        stat_end: newProfileData.stat_end,
        stat_wil: newProfileData.stat_wil,
        stat_soc: newProfileData.stat_soc,
        rank_country: profile.rank_country,
        rank_state: profile.rank_state,
        rank_global: profile.rank_global,
      });
      
      return { 
        xpEarned, 
        goldEarned: goldEarned + levelUpGold, 
        wasLate, 
        leveledUp, 
        newLevel: leveledUp ? newLevel : undefined,
        achievementsUnlocked 
      };
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
      set({ activeQuest: { ...activeQuest, remainingSeconds } });
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
        profile: { ...profile, gold: profile.gold - price },
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
      
      await supabase.from('user_cosmetics')
        .update({ equipped: true })
        .eq('user_id', profile.id)
        .eq('cosmetic_id', cosmeticId);
      
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
