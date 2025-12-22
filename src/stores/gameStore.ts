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
}

interface GameState {
  profile: UserProfile | null;
  activeQuest: ActiveQuest | null;
  questsCompletedToday: number;
  loading: boolean;
  
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
}

export const useGameStore = create<GameState>()((set, get) => ({
  profile: null,
  activeQuest: null,
  questsCompletedToday: 0,
  loading: false,
  
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
    } catch (error) {
      console.error('Error fetching profile:', error);
      set({ loading: false });
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
    const { profile } = get();
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
      });
      return true;
    } catch (error) {
      console.error('Error purchasing cosmetic:', error);
      return false;
    }
  },
}));
