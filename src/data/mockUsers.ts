import { User, LeaderboardEntry } from '@/types/game';

// Mock current user (the logged-in player)
export const currentUser: User = {
  id: 'user-1',
  username: 'ShadowHunter',
  email: 'hunter@example.com',
  phone: '+1234567890',
  avatar: undefined,
  level: 12,
  currentXp: 625,
  xpToNextLevel: 2500,
  totalXp: 15625,
  gold: 15420,
  stats: {
    str: 24,
    int: 38,
    end: 31,
    wil: 42,
    soc: 18,
  },
  currentStreak: 5,
  longestStreak: 14,
  totalQuestsCompleted: 47,
  totalGoldEarned: 28500,
  restoresRemaining: 3,
  restoresResetDate: new Date('2025-01-01'),
  location: {
    country: 'US',
    state: 'CA',
    city: 'Los Angeles',
  },
  ranks: {
    global: 152,
    country: 45,
    state: 12,
    city: 3,
  },
  friends: ['user-2', 'user-3', 'user-5'],
  friendRequests: [
    { fromUserId: 'user-8', fromUsername: 'NightBlade', sentAt: new Date() },
  ],
  ownedCosmetics: ['outfit-hunter-basic', 'weapon-basic-sword', 'color-cyan'],
  equippedCosmetics: {
    outfit: 'outfit-hunter-basic',
    weapon: 'weapon-basic-sword',
    nameColor: 'color-cyan',
  },
  unlockedAchievements: [
    'ach-first-steps',
    'ach-getting-started',
    'ach-early-bird',
    'ach-level-5',
    'ach-level-10',
    'ach-consistency',
  ],
  activeTitle: 'Rising Hunter',
  lastActive: new Date(),
  isOnline: true,
  createdAt: new Date('2024-09-15'),
  missedDays: 0,
  lastQuestCompletedDate: new Date(),
};

// Mock other users for leaderboards and friends
export const mockUsers: User[] = [
  {
    id: 'user-2',
    username: 'DragonSlayer',
    level: 45,
    currentXp: 12000,
    xpToNextLevel: 18000,
    totalXp: 285000,
    gold: 125000,
    stats: { str: 85, int: 62, end: 78, wil: 70, soc: 55 },
    currentStreak: 89,
    longestStreak: 89,
    totalQuestsCompleted: 342,
    totalGoldEarned: 450000,
    restoresRemaining: 5,
    restoresResetDate: new Date('2025-01-01'),
    location: { country: 'US', state: 'CA', city: 'San Francisco' },
    ranks: { global: 8, country: 3, state: 1, city: 1 },
    friends: ['user-1'],
    friendRequests: [],
    ownedCosmetics: [],
    equippedCosmetics: {},
    unlockedAchievements: [],
    activeTitle: 'Shadow Monarch',
    lastActive: new Date(),
    isOnline: true,
    createdAt: new Date('2024-01-01'),
    missedDays: 0,
  },
  {
    id: 'user-3',
    username: 'IronWill',
    level: 28,
    currentXp: 3200,
    xpToNextLevel: 7000,
    totalXp: 78500,
    gold: 45000,
    stats: { str: 55, int: 48, end: 65, wil: 72, soc: 35 },
    currentStreak: 21,
    longestStreak: 45,
    totalQuestsCompleted: 156,
    totalGoldEarned: 120000,
    restoresRemaining: 4,
    restoresResetDate: new Date('2025-01-01'),
    location: { country: 'US', state: 'CA', city: 'Los Angeles' },
    ranks: { global: 89, country: 28, state: 8, city: 2 },
    friends: ['user-1'],
    friendRequests: [],
    ownedCosmetics: [],
    equippedCosmetics: {},
    unlockedAchievements: [],
    activeTitle: 'B-Rank Elite',
    lastActive: new Date(Date.now() - 3600000),
    isOnline: false,
    createdAt: new Date('2024-03-15'),
    missedDays: 0,
  },
  {
    id: 'user-4',
    username: 'MindMaster',
    level: 52,
    currentXp: 8500,
    xpToNextLevel: 20000,
    totalXp: 420000,
    gold: 200000,
    stats: { str: 45, int: 98, end: 60, wil: 85, soc: 42 },
    currentStreak: 156,
    longestStreak: 156,
    totalQuestsCompleted: 512,
    totalGoldEarned: 680000,
    restoresRemaining: 5,
    restoresResetDate: new Date('2025-01-01'),
    location: { country: 'JP', state: 'TK', city: 'Shibuya' },
    ranks: { global: 3, country: 1, state: 1, city: 1 },
    friends: [],
    friendRequests: [],
    ownedCosmetics: [],
    equippedCosmetics: {},
    unlockedAchievements: [],
    activeTitle: 'S-Rank Hunter',
    lastActive: new Date(),
    isOnline: true,
    createdAt: new Date('2023-06-01'),
    missedDays: 0,
  },
  {
    id: 'user-5',
    username: 'StarGazer',
    level: 19,
    currentXp: 1800,
    xpToNextLevel: 4500,
    totalXp: 32000,
    gold: 18000,
    stats: { str: 28, int: 52, end: 35, wil: 48, soc: 62 },
    currentStreak: 8,
    longestStreak: 22,
    totalQuestsCompleted: 78,
    totalGoldEarned: 45000,
    restoresRemaining: 3,
    restoresResetDate: new Date('2025-01-01'),
    location: { country: 'US', state: 'NY', city: 'New York City' },
    ranks: { global: 456, country: 125, state: 45, city: 18 },
    friends: ['user-1'],
    friendRequests: [],
    ownedCosmetics: [],
    equippedCosmetics: {},
    unlockedAchievements: [],
    activeTitle: 'Rising Star',
    lastActive: new Date(Date.now() - 7200000),
    isOnline: false,
    createdAt: new Date('2024-08-01'),
    missedDays: 0,
  },
];

// Generate more mock users for leaderboards
function generateMockLeaderboardUsers(count: number): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = [];
  const names = [
    'BladeRunner', 'NightHawk', 'ThunderStrike', 'FrostBite', 'SilverWolf',
    'DarkPhoenix', 'IronFist', 'ShadowStep', 'LightBringer', 'StormRider',
    'VoidWalker', 'FlameHeart', 'IceQueen', 'SteelNerve', 'WindChaser',
    'EarthShaker', 'WaterBender', 'FireLord', 'AirNomad', 'SpiritGuide',
    'BoneCrusher', 'SkullKnight', 'DeathBringer', 'LifeGiver', 'SoulReaper',
    'MindBreaker', 'HeartSeeker', 'BloodHunter', 'NightCrawler', 'DayWalker',
  ];
  
  for (let i = 0; i < count; i++) {
    const level = Math.max(1, 100 - Math.floor(i * 0.8) - Math.floor(Math.random() * 5));
    entries.push({
      rank: i + 1,
      userId: `gen-user-${i}`,
      username: names[i % names.length] + (i >= names.length ? Math.floor(i / names.length) : ''),
      level,
      totalXp: level * 5000 + Math.floor(Math.random() * 10000),
      activeTitle: level >= 50 ? 'Shadow Monarch' : level >= 30 ? 'B-Rank Elite' : level >= 20 ? 'Rising Star' : undefined,
      isOnline: Math.random() > 0.7,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
    });
  }
  
  return entries;
}

export const globalLeaderboard = generateMockLeaderboardUsers(100);

// Insert real users into leaderboard
globalLeaderboard[2] = {
  rank: 3,
  userId: 'user-4',
  username: 'MindMaster',
  level: 52,
  totalXp: 420000,
  activeTitle: 'S-Rank Hunter',
  isOnline: true,
  lastActive: new Date(),
};

globalLeaderboard[7] = {
  rank: 8,
  userId: 'user-2',
  username: 'DragonSlayer',
  level: 45,
  totalXp: 285000,
  activeTitle: 'Shadow Monarch',
  isOnline: true,
  lastActive: new Date(),
};

export function getUserById(id: string): User | undefined {
  if (id === 'user-1') return currentUser;
  return mockUsers.find(u => u.id === id);
}

export function getLeaderboardByType(type: 'global' | 'country' | 'state' | 'city', userLocation: { country: string; state: string; city: string }): LeaderboardEntry[] {
  // For prototype, just return global with modified ranks
  return globalLeaderboard.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}
