// Character Data for SoloRank
// 20 Base Characters (10 Male, 10 Female) with 3 Tier Progression Each

import { Character, CharacterArchetype } from '@/types/character';

// ==================== MALE CHARACTERS ====================

export const maleCharacters: Character[] = [
  // Male 1 - Balanced Build (Starter)
  {
    id: 'char-male-balanced',
    name: 'Kazuki',
    gender: 'male',
    archetype: 'balanced',
    description: 'A balanced fighter with natural talent and determination.',
    baseOutfit: 'Black hoodie + blue jeans + black sneakers',
    hairStyle: 'Spiky',
    hairColor: 'Black',
    build: 'Balanced/Athletic',
    tiers: [0, 5, 9],
    images: {
      tier0: undefined,
      tier5: undefined,
      tier9: undefined,
    },
    unlockType: 'free',
  },
  // Male 2 - Lean Athletic
  {
    id: 'char-male-athletic',
    name: 'Ryu',
    gender: 'male',
    archetype: 'athletic',
    description: 'A swift and agile warrior focused on speed and precision.',
    baseOutfit: 'Dark gray t-shirt + black cargo pants + dark sneakers',
    hairStyle: 'Wavy medium length',
    hairColor: 'Brown',
    build: 'Lean Athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'free',
  },
  // Male 3 - Intellectual Type
  {
    id: 'char-male-intellectual',
    name: 'Shin',
    gender: 'male',
    archetype: 'intellectual',
    description: 'A calm and analytical mind with hidden depths of power.',
    baseOutfit: 'White button-up shirt + dark blue jeans + black boots',
    hairStyle: 'Long straight',
    hairColor: 'White/Silver',
    build: 'Slim',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 1500,
  },
  // Male 4 - Adventurer
  {
    id: 'char-male-adventurer',
    name: 'Kael',
    gender: 'male',
    archetype: 'adventurer',
    description: 'A seasoned explorer always ready for the next challenge.',
    baseOutfit: 'Dark green jacket + brown cargo pants + hiking boots',
    hairStyle: 'Short with highlights',
    hairColor: 'Brown with highlights',
    build: 'Athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 1500,
  },
  // Male 5 - Monk/Spiritual
  {
    id: 'char-male-monk',
    name: 'Zen',
    gender: 'male',
    archetype: 'monk',
    description: 'A peaceful warrior who has mastered inner strength.',
    baseOutfit: 'Dark gray gi-inspired jacket + black pants + simple shoes',
    hairStyle: 'Shaved/Very short',
    hairColor: 'Dark',
    build: 'Lean muscular',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 15,
  },
  // Male 6 - Paladin/Holy
  {
    id: 'char-male-paladin',
    name: 'Lux',
    gender: 'male',
    archetype: 'paladin',
    description: 'A righteous protector with unwavering conviction.',
    baseOutfit: 'White long-sleeve shirt + light gray pants + white boots',
    hairStyle: 'Short neat',
    hairColor: 'Blonde',
    build: 'Muscular',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 3000,
  },
  // Male 7 - Berserker/Wild
  {
    id: 'char-male-berserker',
    name: 'Rave',
    gender: 'male',
    archetype: 'berserker',
    description: 'A fierce warrior who channels primal fury in battle.',
    baseOutfit: 'Black sleeveless tank + dark red/maroon pants + combat boots',
    hairStyle: 'Spiky wild',
    hairColor: 'Red',
    build: 'Muscular',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 3000,
  },
  // Male 8 - Shadow/Dark
  {
    id: 'char-male-shadow',
    name: 'Noir',
    gender: 'male',
    archetype: 'shadow',
    description: 'A mysterious figure who commands the darkness itself.',
    baseOutfit: 'Dark purple long coat + black pants + black boots',
    hairStyle: 'Long flowing',
    hairColor: 'Black',
    build: 'Slim athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 30,
  },
  // Male 9 - Tech/Modern
  {
    id: 'char-male-tech',
    name: 'Neo',
    gender: 'male',
    archetype: 'tech',
    description: 'A tech-savvy warrior enhanced by cutting-edge equipment.',
    baseOutfit: 'Black tech jacket + dark blue high-tech pants + futuristic sneakers',
    hairStyle: 'Tech-styled undercut',
    hairColor: 'Dark with cyan tips',
    build: 'Athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 4000,
  },
  // Male 10 - Dragon/Legend
  {
    id: 'char-male-dragon',
    name: 'Draco',
    gender: 'male',
    archetype: 'dragon',
    description: 'A legendary warrior with the spirit of an ancient dragon.',
    baseOutfit: 'Dark navy coat + black pants + premium boots',
    hairStyle: 'Long regal',
    hairColor: 'Dark with subtle highlights',
    build: 'Tall muscular',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 50,
  },
];

// ==================== FEMALE CHARACTERS ====================

export const femaleCharacters: Character[] = [
  // Female 1 - Balanced Athletic (Starter)
  {
    id: 'char-female-balanced',
    name: 'Akira',
    gender: 'female',
    archetype: 'balanced',
    description: 'A determined athlete with natural grace and power.',
    baseOutfit: 'Dark sports tank + black athletic pants + athletic sneakers',
    hairStyle: 'Long straight',
    hairColor: 'Black',
    build: 'Athletic',
    tiers: [0, 5, 9],
    images: {
      tier0: undefined,
      tier5: undefined,
      tier9: undefined,
    },
    unlockType: 'free',
  },
  // Female 2 - Lean Dancer
  {
    id: 'char-female-dancer',
    name: 'Mika',
    gender: 'female',
    archetype: 'athletic',
    description: 'A graceful warrior whose movements flow like a dance.',
    baseOutfit: 'Dark gray crop top + black leggings + dance sneakers',
    hairStyle: 'Short with undercut',
    hairColor: 'Brown',
    build: 'Lean dancer',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'free',
  },
  // Female 3 - Intellectual/Mage
  {
    id: 'char-female-intellectual',
    name: 'Luna',
    gender: 'female',
    archetype: 'intellectual',
    description: 'A brilliant scholar with mastery over arcane knowledge.',
    baseOutfit: 'Dark purple long-sleeve dress/tunic + black tights + black boots',
    hairStyle: 'Long mystical waves',
    hairColor: 'Purple',
    build: 'Slim elegant',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 1500,
  },
  // Female 4 - Ranger/Scout
  {
    id: 'char-female-ranger',
    name: 'Ivy',
    gender: 'female',
    archetype: 'adventurer',
    description: 'A sharp-eyed scout who never misses her mark.',
    baseOutfit: 'Dark green tactical jacket + dark brown cargo pants + hiking boots',
    hairStyle: 'Long practical braid',
    hairColor: 'Red',
    build: 'Athletic lean',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 1500,
  },
  // Female 5 - Healer/Support
  {
    id: 'char-female-healer',
    name: 'Sera',
    gender: 'female',
    archetype: 'paladin',
    description: 'A compassionate healer with divine protective powers.',
    baseOutfit: 'White long tunic + light gray pants + white boots',
    hairStyle: 'Long flowing',
    hairColor: 'Golden blonde',
    build: 'Graceful',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 15,
  },
  // Female 6 - Warrior/Strong
  {
    id: 'char-female-warrior',
    name: 'Valka',
    gender: 'female',
    archetype: 'berserker',
    description: 'A powerful warrior who dominates the battlefield.',
    baseOutfit: 'Black sleeveless top + dark gray tactical pants + combat boots',
    hairStyle: 'Short neat',
    hairColor: 'Blonde',
    build: 'Athletic muscular',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 3000,
  },
  // Female 7 - Wild/Fierce
  {
    id: 'char-female-fierce',
    name: 'Ember',
    gender: 'female',
    archetype: 'berserker',
    description: 'A fierce spirit with untamed power and passion.',
    baseOutfit: 'Dark red crop top + black leather pants + combat boots',
    hairStyle: 'Long wild wavy',
    hairColor: 'Red',
    build: 'Athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 3000,
  },
  // Female 8 - Shadow/Assassin
  {
    id: 'char-female-shadow',
    name: 'Shade',
    gender: 'female',
    archetype: 'shadow',
    description: 'A silent phantom who strikes from the darkness.',
    baseOutfit: 'Dark purple catsuit/bodysuit + black boots',
    hairStyle: 'Long mysterious',
    hairColor: 'Black',
    build: 'Slim athletic',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 30,
  },
  // Female 9 - Monk/Spiritual
  {
    id: 'char-female-monk',
    name: 'Yuki',
    gender: 'female',
    archetype: 'monk',
    description: 'A serene master of inner peace and spiritual power.',
    baseOutfit: 'Dark gray simple gi dress + black pants + minimal shoes',
    hairStyle: 'Long in elegant bun',
    hairColor: 'Black',
    build: 'Lean graceful',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'shop',
    price: 4000,
  },
  // Female 10 - Noble/Dragon
  {
    id: 'char-female-dragon',
    name: 'Ryoko',
    gender: 'female',
    archetype: 'dragon',
    description: 'A noble warrior with the majesty of an ancient dragon.',
    baseOutfit: 'Dark navy elegant dress/coat + black pants + premium boots',
    hairStyle: 'Long elegant',
    hairColor: 'Dark with highlights',
    build: 'Tall elegant',
    tiers: [0, 5, 9],
    images: {},
    unlockType: 'level',
    unlockLevel: 50,
  },
];

// Combined character list
export const allCharacters: Character[] = [...maleCharacters, ...femaleCharacters];

// Helper functions
export function getCharacterById(id: string): Character | undefined {
  return allCharacters.find(char => char.id === id);
}

export function getCharactersByGender(gender: 'male' | 'female'): Character[] {
  return gender === 'male' ? maleCharacters : femaleCharacters;
}

export function getCharactersByArchetype(archetype: CharacterArchetype): Character[] {
  return allCharacters.filter(char => char.archetype === archetype);
}

export function getFreeCharacters(): Character[] {
  return allCharacters.filter(char => char.unlockType === 'free');
}

export function getShopCharacters(): Character[] {
  return allCharacters.filter(char => char.unlockType === 'shop');
}

export function getLevelUnlockCharacters(): Character[] {
  return allCharacters.filter(char => char.unlockType === 'level');
}

export function getCharactersUnlockedAtLevel(level: number): Character[] {
  return allCharacters.filter(char => {
    if (char.unlockType === 'free') return true;
    if (char.unlockType === 'level' && char.unlockLevel) {
      return char.unlockLevel <= level;
    }
    return false;
  });
}
