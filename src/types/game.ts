// Core Game Types for SoloRank

export type QuestCategory = 'study' | 'fitness' | 'coding' | 'money' | 'social';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type StatType = 'str' | 'int' | 'end' | 'wil' | 'soc';
export type CosmeticCategory = 'outfits' | 'weapons' | 'auras' | 'name_colors' | 'frames' | 'avatars';
export type AvatarGender = 'male' | 'female' | 'neutral';
export type UnlockType = 'free' | 'shop' | 'level' | 'achievement';

export interface UserStats {
  str: number; // Strength
  int: number; // Intelligence
  end: number; // Endurance
  wil: number; // Willpower
  soc: number; // Social
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  goldReward: number;
  statBoosts: Partial<UserStats>;
  isPackage?: boolean;
  packageQuests?: string[]; // IDs of sub-quests
}

export interface QuestPackage {
  id: string;
  name: string;
  description: string;
  category: QuestCategory;
  quests: Quest[];
  totalXp: number;
  totalGold: number;
}

export interface ActiveQuest extends Quest {
  startedAt: Date;
  remainingSeconds: number;
  isPaused: boolean;
  pausedAt?: Date;
  totalPausedTime: number;
}

export interface CompletedQuest {
  questId: string;
  questName: string;
  completedAt: Date;
  timeTaken: number; // seconds
  xpEarned: number;
  goldEarned: number;
  wasLate: boolean;
  latePenalty?: number; // percentage
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  rarity: Rarity;
  icon: string;
  category: 'easy' | 'medium' | 'hard' | 'very_hard';
  progress?: {
    current: number;
    required: number;
  };
  unlockedAt?: Date;
}

export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  price: number;
  rarity: Rarity;
  imageUrl?: string;
  // Avatar specific
  gender?: AvatarGender;
  unlockType?: UnlockType;
  unlockLevel?: number;
  unlockAchievement?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXp: number;
  gold: number;
  stats: UserStats;
  currentStreak: number;
  longestStreak: number;
  totalQuestsCompleted: number;
  totalGoldEarned: number;
  restoresRemaining: number;
  restoresResetDate: Date;
  location: UserLocation;
  ranks: UserRanks;
  friends: string[]; // User IDs
  friendRequests: FriendRequest[];
  ownedCosmetics: string[]; // Cosmetic IDs
  equippedCosmetics: EquippedCosmetics;
  unlockedAchievements: string[]; // Achievement IDs
  activeTitle?: string;
  lastActive: Date;
  isOnline: boolean;
  createdAt: Date;
  missedDays: number;
  lastQuestCompletedDate?: Date;
  pendingPenalty?: number;
}

export interface UserLocation {
  country: string;
  state: string;
  city: string;
}

export interface UserRanks {
  global: number;
  country: number;
  state: number;
  city: number;
}

export interface FriendRequest {
  fromUserId: string;
  fromUsername: string;
  sentAt: Date;
}

export interface EquippedCosmetics {
  outfit?: string;
  weapon?: string;
  aura?: string;
  nameColor?: string;
  frame?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  level: number;
  totalXp: number;
  activeTitle?: string;
  isOnline: boolean;
  lastActive: Date;
  avatar?: string;
}

// XP and Level Calculations
export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= 10) return 200 + (level - 2) * 150;
  if (level <= 25) return 1500 + (level - 10) * 250;
  if (level <= 50) return 5000 + (level - 25) * 400;
  if (level <= 75) return 15000 + (level - 50) * 600;
  return 30000 + (level - 75) * 800;
}

export function calculateLevelFromXp(totalXp: number): { level: number; currentXp: number; xpToNext: number } {
  let level = 1;
  let xpRemaining = totalXp;
  
  while (true) {
    const xpNeeded = calculateXpForLevel(level + 1);
    if (xpRemaining < xpNeeded) {
      return {
        level,
        currentXp: xpRemaining,
        xpToNext: xpNeeded,
      };
    }
    xpRemaining -= xpNeeded;
    level++;
    if (level >= 100) {
      return { level: 100, currentXp: xpRemaining, xpToNext: 20000 };
    }
  }
}

export function calculateGoldReward(level: number): number {
  return 500 * level;
}

export function calculateQuestXpByTime(minutes: number): number {
  if (minutes <= 15) return 50;
  if (minutes <= 30) return 100;
  if (minutes <= 60) return 200;
  if (minutes <= 90) return 350;
  if (minutes <= 120) return 500;
  return Math.floor(500 + (minutes - 120) * 3);
}

export function calculateLatePenalty(minutesLate: number): number {
  if (minutesLate <= 0) return 0;
  if (minutesLate < 10) return 50;
  return 75;
}

export function calculateMissedDaysPenalty(daysCount: number): number {
  switch (daysCount) {
    case 0: return 0;
    case 1: return 2500;
    case 2: return 12500;
    case 3: return 42500;
    case 4: return 92500;
    default: return 100000 + (daysCount - 5) * 50000;
  }
}
