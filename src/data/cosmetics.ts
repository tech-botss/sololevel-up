import { Cosmetic } from '@/types/game';

export const cosmetics: Cosmetic[] = [
  // ==================== AVATARS - MALE ====================
  // Free avatars
  {
    id: 'avatar-male-warrior-basic',
    name: 'Warrior Trainee',
    description: 'Basic male warrior avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'male',
    unlockType: 'free',
  },
  {
    id: 'avatar-male-mage-basic',
    name: 'Mage Apprentice',
    description: 'Basic male mage avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'male',
    unlockType: 'free',
  },
  {
    id: 'avatar-male-rogue-basic',
    name: 'Street Scout',
    description: 'Basic male rogue avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'male',
    unlockType: 'free',
  },
  // Shop avatars
  {
    id: 'avatar-male-knight',
    name: 'Knight Commander',
    description: 'Armored male knight avatar',
    category: 'avatars',
    price: 1500,
    rarity: 'uncommon',
    gender: 'male',
    unlockType: 'shop',
  },
  {
    id: 'avatar-male-samurai',
    name: 'Shadow Samurai',
    description: 'Japanese warrior avatar',
    category: 'avatars',
    price: 3000,
    rarity: 'rare',
    gender: 'male',
    unlockType: 'shop',
  },
  {
    id: 'avatar-male-ninja',
    name: 'Silent Blade',
    description: 'Stealthy ninja avatar',
    category: 'avatars',
    price: 2500,
    rarity: 'rare',
    gender: 'male',
    unlockType: 'shop',
  },
  {
    id: 'avatar-male-cyber',
    name: 'Cyber Soldier',
    description: 'Futuristic cyber warrior',
    category: 'avatars',
    price: 4000,
    rarity: 'rare',
    gender: 'male',
    unlockType: 'shop',
  },
  {
    id: 'avatar-male-demon',
    name: 'Demon Lord',
    description: 'Dark demonic avatar',
    category: 'avatars',
    price: 8000,
    rarity: 'legendary',
    gender: 'male',
    unlockType: 'shop',
  },
  // Level unlock avatars
  {
    id: 'avatar-male-hunter-elite',
    name: 'Elite Hunter',
    description: 'Unlocked at Level 10',
    category: 'avatars',
    price: 0,
    rarity: 'uncommon',
    gender: 'male',
    unlockType: 'level',
    unlockLevel: 10,
  },
  {
    id: 'avatar-male-shadow-knight',
    name: 'Shadow Knight',
    description: 'Unlocked at Level 25',
    category: 'avatars',
    price: 0,
    rarity: 'rare',
    gender: 'male',
    unlockType: 'level',
    unlockLevel: 25,
  },
  {
    id: 'avatar-male-dragon-slayer',
    name: 'Dragon Slayer',
    description: 'Unlocked at Level 50',
    category: 'avatars',
    price: 0,
    rarity: 'legendary',
    gender: 'male',
    unlockType: 'level',
    unlockLevel: 50,
  },
  {
    id: 'avatar-male-monarch',
    name: 'Shadow Monarch',
    description: 'Unlocked at Level 75',
    category: 'avatars',
    price: 0,
    rarity: 'legendary',
    gender: 'male',
    unlockType: 'level',
    unlockLevel: 75,
  },

  // ==================== AVATARS - FEMALE ====================
  // Free avatars
  {
    id: 'avatar-female-warrior-basic',
    name: 'Warrior Maiden',
    description: 'Basic female warrior avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'female',
    unlockType: 'free',
  },
  {
    id: 'avatar-female-mage-basic',
    name: 'Mage Initiate',
    description: 'Basic female mage avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'female',
    unlockType: 'free',
  },
  {
    id: 'avatar-female-rogue-basic',
    name: 'Shadow Dancer',
    description: 'Basic female rogue avatar',
    category: 'avatars',
    price: 0,
    rarity: 'common',
    gender: 'female',
    unlockType: 'free',
  },
  // Shop avatars
  {
    id: 'avatar-female-valkyrie',
    name: 'Valkyrie',
    description: 'Noble winged warrior',
    category: 'avatars',
    price: 1500,
    rarity: 'uncommon',
    gender: 'female',
    unlockType: 'shop',
  },
  {
    id: 'avatar-female-kunoichi',
    name: 'Kunoichi',
    description: 'Female ninja assassin',
    category: 'avatars',
    price: 2500,
    rarity: 'rare',
    gender: 'female',
    unlockType: 'shop',
  },
  {
    id: 'avatar-female-sorceress',
    name: 'Dark Sorceress',
    description: 'Powerful magic wielder',
    category: 'avatars',
    price: 3000,
    rarity: 'rare',
    gender: 'female',
    unlockType: 'shop',
  },
  {
    id: 'avatar-female-cyber',
    name: 'Cyber Huntress',
    description: 'Futuristic tech warrior',
    category: 'avatars',
    price: 4000,
    rarity: 'rare',
    gender: 'female',
    unlockType: 'shop',
  },
  {
    id: 'avatar-female-phoenix',
    name: 'Phoenix Queen',
    description: 'Radiant fire avatar',
    category: 'avatars',
    price: 8000,
    rarity: 'legendary',
    gender: 'female',
    unlockType: 'shop',
  },
  // Level unlock avatars
  {
    id: 'avatar-female-hunter-elite',
    name: 'Elite Huntress',
    description: 'Unlocked at Level 10',
    category: 'avatars',
    price: 0,
    rarity: 'uncommon',
    gender: 'female',
    unlockType: 'level',
    unlockLevel: 10,
  },
  {
    id: 'avatar-female-shadow-priestess',
    name: 'Shadow Priestess',
    description: 'Unlocked at Level 25',
    category: 'avatars',
    price: 0,
    rarity: 'rare',
    gender: 'female',
    unlockType: 'level',
    unlockLevel: 25,
  },
  {
    id: 'avatar-female-dragon-tamer',
    name: 'Dragon Tamer',
    description: 'Unlocked at Level 50',
    category: 'avatars',
    price: 0,
    rarity: 'legendary',
    gender: 'female',
    unlockType: 'level',
    unlockLevel: 50,
  },
  {
    id: 'avatar-female-empress',
    name: 'Shadow Empress',
    description: 'Unlocked at Level 75',
    category: 'avatars',
    price: 0,
    rarity: 'legendary',
    gender: 'female',
    unlockType: 'level',
    unlockLevel: 75,
  },

  // ==================== AVATARS - NEUTRAL ====================
  {
    id: 'avatar-neutral-ghost',
    name: 'Phantom Spirit',
    description: 'Ethereal ghost avatar',
    category: 'avatars',
    price: 2000,
    rarity: 'rare',
    gender: 'neutral',
    unlockType: 'shop',
  },
  {
    id: 'avatar-neutral-robot',
    name: 'Combat Droid',
    description: 'Mechanical warrior',
    category: 'avatars',
    price: 3500,
    rarity: 'rare',
    gender: 'neutral',
    unlockType: 'shop',
  },
  {
    id: 'avatar-neutral-beast',
    name: 'Shadow Beast',
    description: 'Mysterious creature',
    category: 'avatars',
    price: 5000,
    rarity: 'legendary',
    gender: 'neutral',
    unlockType: 'shop',
  },
  {
    id: 'avatar-neutral-ancient',
    name: 'Ancient Guardian',
    description: 'Unlocked at Level 100',
    category: 'avatars',
    price: 0,
    rarity: 'legendary',
    gender: 'neutral',
    unlockType: 'level',
    unlockLevel: 100,
  },

  // ==================== OUTFITS ====================
  {
    id: 'outfit-hunter-basic',
    name: 'Hunter Trainee',
    description: 'Basic hunter uniform for beginners',
    category: 'outfits',
    price: 500,
    rarity: 'common',
  },
  {
    id: 'outfit-hunter-advanced',
    name: 'Elite Hunter Gear',
    description: 'Advanced combat suit for experienced hunters',
    category: 'outfits',
    price: 2500,
    rarity: 'uncommon',
  },
  {
    id: 'outfit-shadow',
    name: 'Shadow Armor',
    description: 'Dark armor infused with shadow essence',
    category: 'outfits',
    price: 8000,
    rarity: 'rare',
  },
  {
    id: 'outfit-monarch',
    name: 'Monarch Regalia',
    description: 'The legendary outfit worn by the Shadow Monarch',
    category: 'outfits',
    price: 25000,
    rarity: 'legendary',
  },
  {
    id: 'outfit-cyber',
    name: 'Cyber Hunter',
    description: 'Futuristic tech-enhanced combat suit',
    category: 'outfits',
    price: 6000,
    rarity: 'rare',
  },
  {
    id: 'outfit-flame',
    name: 'Flame Knight',
    description: 'Armor blessed by fire spirits',
    category: 'outfits',
    price: 7500,
    rarity: 'rare',
  },

  // ==================== WEAPONS ====================
  {
    id: 'weapon-basic-sword',
    name: 'Training Blade',
    description: 'A basic sword for practice',
    category: 'weapons',
    price: 300,
    rarity: 'common',
  },
  {
    id: 'weapon-katana',
    name: 'Shadow Katana',
    description: 'Swift blade that cuts through darkness',
    category: 'weapons',
    price: 4000,
    rarity: 'uncommon',
  },
  {
    id: 'weapon-daggers',
    name: 'Assassin Daggers',
    description: 'Twin daggers for swift eliminations',
    category: 'weapons',
    price: 5500,
    rarity: 'rare',
  },
  {
    id: 'weapon-monarch-blade',
    name: "Monarch's Blade",
    description: 'The legendary weapon of absolute power',
    category: 'weapons',
    price: 30000,
    rarity: 'legendary',
  },
  {
    id: 'weapon-staff',
    name: 'Mage Staff',
    description: 'Channeling device for mana abilities',
    category: 'weapons',
    price: 3500,
    rarity: 'uncommon',
  },
  {
    id: 'weapon-scythe',
    name: 'Death Scythe',
    description: 'Harvester of souls',
    category: 'weapons',
    price: 12000,
    rarity: 'rare',
  },

  // ==================== AURAS ====================
  {
    id: 'aura-basic',
    name: 'Faint Glow',
    description: 'A subtle energy aura',
    category: 'auras',
    price: 800,
    rarity: 'common',
  },
  {
    id: 'aura-blue',
    name: 'Azure Flame',
    description: 'Blue flames dance around you',
    category: 'auras',
    price: 3000,
    rarity: 'uncommon',
  },
  {
    id: 'aura-shadow',
    name: 'Shadow Mist',
    description: 'Dark tendrils of shadow energy',
    category: 'auras',
    price: 6500,
    rarity: 'rare',
  },
  {
    id: 'aura-monarch',
    name: "Monarch's Domain",
    description: 'The overwhelming presence of a ruler',
    category: 'auras',
    price: 20000,
    rarity: 'legendary',
  },
  {
    id: 'aura-electric',
    name: 'Lightning Storm',
    description: 'Crackling electricity surrounds you',
    category: 'auras',
    price: 5000,
    rarity: 'rare',
  },
  {
    id: 'aura-golden',
    name: 'Golden Light',
    description: 'Radiant divine energy',
    category: 'auras',
    price: 15000,
    rarity: 'legendary',
  },

  // ==================== NAME COLORS ====================
  {
    id: 'color-cyan',
    name: 'Hunter Cyan',
    description: 'Classic hunter blue color',
    category: 'name_colors',
    price: 500,
    rarity: 'common',
  },
  {
    id: 'color-green',
    name: 'Forest Green',
    description: 'Natural green color',
    category: 'name_colors',
    price: 500,
    rarity: 'common',
  },
  {
    id: 'color-purple',
    name: 'Royal Purple',
    description: 'Elegant purple shade',
    category: 'name_colors',
    price: 1500,
    rarity: 'uncommon',
  },
  {
    id: 'color-gold',
    name: 'Golden',
    description: 'Prestigious gold color',
    category: 'name_colors',
    price: 5000,
    rarity: 'rare',
  },
  {
    id: 'color-rainbow',
    name: 'Rainbow Shift',
    description: 'Cycling rainbow colors',
    category: 'name_colors',
    price: 10000,
    rarity: 'legendary',
  },
  {
    id: 'color-shadow',
    name: 'Shadow Black',
    description: 'Deep void black with subtle glow',
    category: 'name_colors',
    price: 8000,
    rarity: 'rare',
  },

  // ==================== FRAMES ====================
  {
    id: 'frame-basic',
    name: 'Simple Border',
    description: 'A clean simple frame',
    category: 'frames',
    price: 400,
    rarity: 'common',
  },
  {
    id: 'frame-hunter',
    name: 'Hunter Badge',
    description: 'Official hunter association frame',
    category: 'frames',
    price: 2000,
    rarity: 'uncommon',
  },
  {
    id: 'frame-elite',
    name: 'Elite Frame',
    description: 'Frame for elite hunters',
    category: 'frames',
    price: 4500,
    rarity: 'rare',
  },
  {
    id: 'frame-monarch',
    name: 'Monarch Frame',
    description: 'The frame of absolute authority',
    category: 'frames',
    price: 18000,
    rarity: 'legendary',
  },
  {
    id: 'frame-fire',
    name: 'Flame Frame',
    description: 'Burning edges of fire',
    category: 'frames',
    price: 3500,
    rarity: 'uncommon',
  },
  {
    id: 'frame-ice',
    name: 'Frost Frame',
    description: 'Crystalline ice border',
    category: 'frames',
    price: 3500,
    rarity: 'uncommon',
  },
];

export function getCosmeticById(id: string): Cosmetic | undefined {
  return cosmetics.find(c => c.id === id);
}

export function getCosmeticsByCategory(category: string): Cosmetic[] {
  if (category === 'all') return cosmetics;
  return cosmetics.filter(c => c.category === category);
}

export function getCosmeticsByRarity(rarity: string): Cosmetic[] {
  return cosmetics.filter(c => c.rarity === rarity);
}

export function getAvatarsByGender(gender: 'male' | 'female' | 'neutral'): Cosmetic[] {
  return cosmetics.filter(c => c.category === 'avatars' && c.gender === gender);
}

export function getFreeAvatars(): Cosmetic[] {
  return cosmetics.filter(c => c.category === 'avatars' && c.unlockType === 'free');
}

export function getShopAvatars(): Cosmetic[] {
  return cosmetics.filter(c => c.category === 'avatars' && c.unlockType === 'shop');
}

export function getLevelUnlockAvatars(): Cosmetic[] {
  return cosmetics.filter(c => c.category === 'avatars' && c.unlockType === 'level');
}

export function getAvatarsUnlockedAtLevel(level: number): Cosmetic[] {
  return cosmetics.filter(c => 
    c.category === 'avatars' && 
    c.unlockType === 'level' && 
    c.unlockLevel !== undefined && 
    c.unlockLevel <= level
  );
}
