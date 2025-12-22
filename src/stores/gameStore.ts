import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ActiveQuest, CompletedQuest, Quest, calculateLevelFromXp, calculateGoldReward, calculateLatePenalty } from '@/types/game';
import { currentUser } from '@/data/mockUsers';

interface GameState {
  user: User;
  activeQuest: ActiveQuest | null;
  completedQuests: CompletedQuest[];
  questsCompletedToday: number;
  
  // Actions
  startQuest: (quest: Quest) => void;
  pauseQuest: () => void;
  resumeQuest: () => void;
  completeQuest: () => { xpEarned: number; goldEarned: number; wasLate: boolean; leveledUp: boolean; newLevel?: number };
  abandonQuest: () => void;
  updateQuestTimer: (remainingSeconds: number) => void;
  
  // User actions
  addFriend: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  acceptFriendRequest: (fromUserId: string) => void;
  rejectFriendRequest: (fromUserId: string) => void;
  
  // Cosmetics
  purchaseCosmetic: (cosmeticId: string, price: number) => boolean;
  equipCosmetic: (category: string, cosmeticId: string) => void;
  
  // Location
  updateLocation: (country: string, state: string, city: string) => void;
  
  // Restore
  useRestore: () => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: currentUser,
      activeQuest: null,
      completedQuests: [],
      questsCompletedToday: 2,
      
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
      
      completeQuest: () => {
        const { activeQuest, user, completedQuests, questsCompletedToday } = get();
        if (!activeQuest) return { xpEarned: 0, goldEarned: 0, wasLate: false, leveledUp: false };
        
        const timeTaken = (activeQuest.estimatedMinutes * 60) - activeQuest.remainingSeconds;
        const wasLate = activeQuest.remainingSeconds < 0;
        const minutesLate = wasLate ? Math.abs(activeQuest.remainingSeconds) / 60 : 0;
        const penalty = calculateLatePenalty(minutesLate);
        
        const xpEarned = Math.floor(activeQuest.xpReward * (1 - penalty / 100));
        const goldEarned = activeQuest.goldReward;
        
        const newTotalXp = user.totalXp + xpEarned;
        const { level: newLevel, currentXp, xpToNext } = calculateLevelFromXp(newTotalXp);
        const leveledUp = newLevel > user.level;
        const levelUpGold = leveledUp ? calculateGoldReward(newLevel) : 0;
        
        // Update stats
        const newStats = { ...user.stats };
        Object.entries(activeQuest.statBoosts).forEach(([stat, boost]) => {
          if (boost) {
            newStats[stat as keyof typeof newStats] = Math.min(100, newStats[stat as keyof typeof newStats] + boost);
          }
        });
        
        const completedQuest: CompletedQuest = {
          questId: activeQuest.id,
          questName: activeQuest.name,
          completedAt: new Date(),
          timeTaken,
          xpEarned,
          goldEarned,
          wasLate,
          latePenalty: wasLate ? penalty : undefined,
        };
        
        set({
          activeQuest: null,
          user: {
            ...user,
            level: newLevel,
            currentXp,
            xpToNextLevel: xpToNext,
            totalXp: newTotalXp,
            gold: user.gold + goldEarned + levelUpGold,
            stats: newStats,
            totalQuestsCompleted: user.totalQuestsCompleted + 1,
            totalGoldEarned: user.totalGoldEarned + goldEarned + levelUpGold,
            currentStreak: user.currentStreak, // Would update based on date logic
            lastQuestCompletedDate: new Date(),
          },
          completedQuests: [...completedQuests, completedQuest],
          questsCompletedToday: questsCompletedToday + 1,
        });
        
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
      
      addFriend: (friendId: string) => {
        const { user } = get();
        if (!user.friends.includes(friendId)) {
          set({
            user: {
              ...user,
              friends: [...user.friends, friendId],
            },
          });
        }
      },
      
      removeFriend: (friendId: string) => {
        const { user } = get();
        set({
          user: {
            ...user,
            friends: user.friends.filter(id => id !== friendId),
          },
        });
      },
      
      acceptFriendRequest: (fromUserId: string) => {
        const { user } = get();
        set({
          user: {
            ...user,
            friends: [...user.friends, fromUserId],
            friendRequests: user.friendRequests.filter(r => r.fromUserId !== fromUserId),
          },
        });
      },
      
      rejectFriendRequest: (fromUserId: string) => {
        const { user } = get();
        set({
          user: {
            ...user,
            friendRequests: user.friendRequests.filter(r => r.fromUserId !== fromUserId),
          },
        });
      },
      
      purchaseCosmetic: (cosmeticId: string, price: number) => {
        const { user } = get();
        if (user.gold >= price && !user.ownedCosmetics.includes(cosmeticId)) {
          set({
            user: {
              ...user,
              gold: user.gold - price,
              ownedCosmetics: [...user.ownedCosmetics, cosmeticId],
            },
          });
          return true;
        }
        return false;
      },
      
      equipCosmetic: (category: string, cosmeticId: string) => {
        const { user } = get();
        set({
          user: {
            ...user,
            equippedCosmetics: {
              ...user.equippedCosmetics,
              [category]: cosmeticId,
            },
          },
        });
      },
      
      updateLocation: (country: string, state: string, city: string) => {
        const { user } = get();
        set({
          user: {
            ...user,
            location: { country, state, city },
          },
        });
      },
      
      useRestore: () => {
        const { user } = get();
        if (user.restoresRemaining > 0) {
          set({
            user: {
              ...user,
              restoresRemaining: user.restoresRemaining - 1,
              missedDays: Math.max(0, user.missedDays - 1),
            },
          });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'solorank-storage',
      partialize: (state) => ({
        user: state.user,
        completedQuests: state.completedQuests,
      }),
    }
  )
);
