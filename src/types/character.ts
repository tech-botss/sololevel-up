// Character and Costume Types for SoloRank

export type CharacterGender = 'male' | 'female';
export type CharacterTier = 0 | 5 | 9; // Beginner, Intermediate, Elite
export type CostumeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CostumePartType = 'top' | 'bottom' | 'shoes';

// Base character archetype
export type CharacterArchetype = 
  | 'balanced'
  | 'athletic'
  | 'intellectual'
  | 'adventurer'
  | 'monk'
  | 'paladin'
  | 'berserker'
  | 'shadow'
  | 'tech'
  | 'dragon';

// Character definition
export interface Character {
  id: string;
  name: string;
  gender: CharacterGender;
  archetype: CharacterArchetype;
  description: string;
  baseOutfit: string; // Description of the base outfit
  hairStyle: string;
  hairColor: string;
  build: string; // Body type
  tiers: CharacterTier[];
  // Image URLs for each tier
  images: {
    tier0?: string; // Beginner
    tier5?: string; // Intermediate
    tier9?: string; // Elite
  };
  // Unlock requirements
  unlockType: 'free' | 'shop' | 'level' | 'achievement';
  unlockLevel?: number;
  price?: number;
}

// Costume part definition
export interface CostumePartItem {
  id: string;
  name: string;
  type: CostumePartType;
  bundleId: string;
  gender: CharacterGender | 'unisex';
  description: string;
  imageUrl?: string;
}

// Costume bundle (set of 3 parts)
export interface CostumeBundle {
  id: string;
  name: string;
  description: string;
  gender: CharacterGender | 'unisex';
  rarity: CostumeRarity;
  price: number;
  parts: {
    top: CostumePartItem;
    bottom: CostumePartItem;
    shoes: CostumePartItem;
  };
  imageUrl?: string; // Preview image of full bundle
}

// Player's equipped costume configuration
export interface EquippedCostume {
  topId?: string;
  bottomId?: string;
  shoesId?: string;
}

// Player's character selection
export interface PlayerCharacter {
  characterId: string;
  currentTier: CharacterTier;
  equippedCostume: EquippedCostume;
  ownedCostumeParts: string[]; // IDs of owned costume parts
}

// Tier progression requirements (level thresholds)
export const TIER_REQUIREMENTS: Record<CharacterTier, number> = {
  0: 1,   // Available from start
  5: 25,  // Unlock at level 25
  9: 50,  // Unlock at level 50
};

// Tier display names
export const TIER_NAMES: Record<CharacterTier, string> = {
  0: 'Beginner',
  5: 'Intermediate',
  9: 'Elite',
};

// Tier glow intensity for visuals
export const TIER_GLOW: Record<CharacterTier, string> = {
  0: 'none',
  5: 'subtle',
  9: 'intense',
};

// Price tiers for costumes
export const COSTUME_PRICES: Record<CostumeRarity, number> = {
  common: 500,
  rare: 1500,
  epic: 3000,
  legendary: 5000,
};

// Helper function to get character tier based on player level
export function getAvailableTier(playerLevel: number): CharacterTier {
  if (playerLevel >= TIER_REQUIREMENTS[9]) return 9;
  if (playerLevel >= TIER_REQUIREMENTS[5]) return 5;
  return 0;
}

// Helper to check if a specific tier is unlocked
export function isTierUnlocked(playerLevel: number, tier: CharacterTier): boolean {
  return playerLevel >= TIER_REQUIREMENTS[tier];
}
