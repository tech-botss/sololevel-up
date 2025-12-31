// Costume Bundle Data for SoloRank
// 20 Costume Bundles (10 Male, 10 Female) with TOP/BOTTOM/SHOES parts

import { CostumeBundle, CostumePartItem, COSTUME_PRICES } from '@/types/character';

// ==================== MALE COSTUME BUNDLES ====================

export const maleCostumeBundles: CostumeBundle[] = [
  // Bundle 1 - Casual Street (Common - 500)
  {
    id: 'costume-male-casual',
    name: 'Casual Street',
    description: 'Clean casual streetwear for everyday adventuring.',
    gender: 'male',
    rarity: 'common',
    price: COSTUME_PRICES.common,
    parts: {
      top: {
        id: 'costume-male-casual-top',
        name: 'White T-Shirt',
        type: 'top',
        bundleId: 'costume-male-casual',
        gender: 'male',
        description: 'Simple white/gray t-shirt',
      },
      bottom: {
        id: 'costume-male-casual-bottom',
        name: 'Blue Jeans',
        type: 'bottom',
        bundleId: 'costume-male-casual',
        gender: 'male',
        description: 'Classic blue jeans or khaki pants',
      },
      shoes: {
        id: 'costume-male-casual-shoes',
        name: 'White Sneakers',
        type: 'shoes',
        bundleId: 'costume-male-casual',
        gender: 'male',
        description: 'Clean white/gray sneakers',
      },
    },
  },
  // Bundle 2 - Dark Casual (Common - 500)
  {
    id: 'costume-male-dark-casual',
    name: 'Dark Casual',
    description: 'Sleek dark casual wear for the modern warrior.',
    gender: 'male',
    rarity: 'common',
    price: COSTUME_PRICES.common,
    parts: {
      top: {
        id: 'costume-male-dark-top',
        name: 'Black Hoodie',
        type: 'top',
        bundleId: 'costume-male-dark-casual',
        gender: 'male',
        description: 'Premium black hoodie',
      },
      bottom: {
        id: 'costume-male-dark-bottom',
        name: 'Dark Joggers',
        type: 'bottom',
        bundleId: 'costume-male-dark-casual',
        gender: 'male',
        description: 'Black/dark gray jogger pants',
      },
      shoes: {
        id: 'costume-male-dark-shoes',
        name: 'Black Premium Sneakers',
        type: 'shoes',
        bundleId: 'costume-male-dark-casual',
        gender: 'male',
        description: 'Sleek black premium sneakers',
      },
    },
  },
  // Bundle 3 - Athletic Performance (Rare - 1500)
  {
    id: 'costume-male-athletic',
    name: 'Athletic Performance',
    description: 'High-performance athletic gear for peak training.',
    gender: 'male',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-male-athletic-top',
        name: 'Dark Sports Shirt',
        type: 'top',
        bundleId: 'costume-male-athletic',
        gender: 'male',
        description: 'Performance dark sports shirt',
      },
      bottom: {
        id: 'costume-male-athletic-bottom',
        name: 'Black Athletic Pants',
        type: 'bottom',
        bundleId: 'costume-male-athletic',
        gender: 'male',
        description: 'Technical black athletic pants',
      },
      shoes: {
        id: 'costume-male-athletic-shoes',
        name: 'Performance Sneakers',
        type: 'shoes',
        bundleId: 'costume-male-athletic',
        gender: 'male',
        description: 'High-performance training sneakers',
      },
    },
  },
  // Bundle 4 - Tech Urban (Rare - 1500)
  {
    id: 'costume-male-tech',
    name: 'Tech Urban',
    description: 'Futuristic urban tech wear with functional design.',
    gender: 'male',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-male-tech-top',
        name: 'Dark Tech Jacket',
        type: 'top',
        bundleId: 'costume-male-tech',
        gender: 'male',
        description: 'Technical dark jacket with modern details',
      },
      bottom: {
        id: 'costume-male-tech-bottom',
        name: 'Cargo Detail Pants',
        type: 'bottom',
        bundleId: 'costume-male-tech',
        gender: 'male',
        description: 'Technical cargo pants with utility pockets',
      },
      shoes: {
        id: 'costume-male-tech-shoes',
        name: 'Futuristic Sneakers',
        type: 'shoes',
        bundleId: 'costume-male-tech',
        gender: 'male',
        description: 'Sleek futuristic sneakers',
      },
    },
  },
  // Bundle 5 - Formal/Smart (Rare - 1500)
  {
    id: 'costume-male-formal',
    name: 'Formal Smart',
    description: 'Sharp formal wear for sophisticated occasions.',
    gender: 'male',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-male-formal-top',
        name: 'Dark Button-Up',
        type: 'top',
        bundleId: 'costume-male-formal',
        gender: 'male',
        description: 'Elegant dark button-up shirt',
      },
      bottom: {
        id: 'costume-male-formal-bottom',
        name: 'Dark Dress Pants',
        type: 'bottom',
        bundleId: 'costume-male-formal',
        gender: 'male',
        description: 'Tailored dark dress pants',
      },
      shoes: {
        id: 'costume-male-formal-shoes',
        name: 'Formal Dark Shoes',
        type: 'shoes',
        bundleId: 'costume-male-formal',
        gender: 'male',
        description: 'Polished formal dark shoes',
      },
    },
  },
  // Bundle 6 - Tactical/Military (Epic - 3000)
  {
    id: 'costume-male-tactical',
    name: 'Tactical Military',
    description: 'Combat-ready tactical gear for serious missions.',
    gender: 'male',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-male-tactical-top',
        name: 'Dark Tactical Jacket',
        type: 'top',
        bundleId: 'costume-male-tactical',
        gender: 'male',
        description: 'Reinforced dark tactical jacket',
      },
      bottom: {
        id: 'costume-male-tactical-bottom',
        name: 'Cargo Combat Pants',
        type: 'bottom',
        bundleId: 'costume-male-tactical',
        gender: 'male',
        description: 'Heavy-duty cargo pants with straps',
      },
      shoes: {
        id: 'costume-male-tactical-shoes',
        name: 'Combat Boots',
        type: 'shoes',
        bundleId: 'costume-male-tactical',
        gender: 'male',
        description: 'Durable military combat boots',
      },
    },
  },
  // Bundle 7 - Streetwear (Epic - 3000)
  {
    id: 'costume-male-streetwear',
    name: 'Designer Streetwear',
    description: 'Premium branded streetwear for style statements.',
    gender: 'male',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-male-streetwear-top',
        name: 'Dark Branded Jacket',
        type: 'top',
        bundleId: 'costume-male-streetwear',
        gender: 'male',
        description: 'Premium dark branded jacket',
      },
      bottom: {
        id: 'costume-male-streetwear-bottom',
        name: 'Designer Dark Pants',
        type: 'bottom',
        bundleId: 'costume-male-streetwear',
        gender: 'male',
        description: 'High-end designer dark pants',
      },
      shoes: {
        id: 'costume-male-streetwear-shoes',
        name: 'Premium Sneakers',
        type: 'shoes',
        bundleId: 'costume-male-streetwear',
        gender: 'male',
        description: 'Limited edition premium sneakers',
      },
    },
  },
  // Bundle 8 - Winter/Adventure (Epic - 3000)
  {
    id: 'costume-male-winter',
    name: 'Winter Adventure',
    description: 'Cold-weather gear for extreme adventures.',
    gender: 'male',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-male-winter-top',
        name: 'Dark Winter Parka',
        type: 'top',
        bundleId: 'costume-male-winter',
        gender: 'male',
        description: 'Insulated dark winter parka',
      },
      bottom: {
        id: 'costume-male-winter-bottom',
        name: 'Insulated Pants',
        type: 'bottom',
        bundleId: 'costume-male-winter',
        gender: 'male',
        description: 'Weather-resistant insulated pants',
      },
      shoes: {
        id: 'costume-male-winter-shoes',
        name: 'Hiking Boots',
        type: 'shoes',
        bundleId: 'costume-male-winter',
        gender: 'male',
        description: 'Rugged all-terrain hiking boots',
      },
    },
  },
  // Bundle 9 - Martial Arts (Epic - 3000)
  {
    id: 'costume-male-martial',
    name: 'Martial Arts',
    description: 'Traditional martial arts inspired training gear.',
    gender: 'male',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-male-martial-top',
        name: 'Dark Gi Jacket',
        type: 'top',
        bundleId: 'costume-male-martial',
        gender: 'male',
        description: 'Modern dark gi-inspired jacket',
      },
      bottom: {
        id: 'costume-male-martial-bottom',
        name: 'Martial Arts Pants',
        type: 'bottom',
        bundleId: 'costume-male-martial',
        gender: 'male',
        description: 'Traditional martial arts pants',
      },
      shoes: {
        id: 'costume-male-martial-shoes',
        name: 'Martial Arts Shoes',
        type: 'shoes',
        bundleId: 'costume-male-martial',
        gender: 'male',
        description: 'Lightweight martial arts training shoes',
      },
    },
  },
  // Bundle 10 - Premium/Legendary (Legendary - 5000)
  {
    id: 'costume-male-legendary',
    name: 'Legendary Elite',
    description: 'The ultimate premium outfit with cyan glow effects.',
    gender: 'male',
    rarity: 'legendary',
    price: COSTUME_PRICES.legendary,
    parts: {
      top: {
        id: 'costume-male-legendary-top',
        name: 'Glowing Dark Top',
        type: 'top',
        bundleId: 'costume-male-legendary',
        gender: 'male',
        description: 'Premium dark top with cyan energy glow',
      },
      bottom: {
        id: 'costume-male-legendary-bottom',
        name: 'Cyan Accent Pants',
        type: 'bottom',
        bundleId: 'costume-male-legendary',
        gender: 'male',
        description: 'Premium pants with cyan energy lines',
      },
      shoes: {
        id: 'costume-male-legendary-shoes',
        name: 'Glowing Boots',
        type: 'shoes',
        bundleId: 'costume-male-legendary',
        gender: 'male',
        description: 'Legendary boots radiating cyan power',
      },
    },
  },
];

// ==================== FEMALE COSTUME BUNDLES ====================

export const femaleCostumeBundles: CostumeBundle[] = [
  // Bundle 1 - Casual Comfort (Common - 500)
  {
    id: 'costume-female-casual',
    name: 'Casual Comfort',
    description: 'Comfortable casual wear for everyday activities.',
    gender: 'female',
    rarity: 'common',
    price: COSTUME_PRICES.common,
    parts: {
      top: {
        id: 'costume-female-casual-top',
        name: 'Dark T-Shirt',
        type: 'top',
        bundleId: 'costume-female-casual',
        gender: 'female',
        description: 'Comfortable dark t-shirt or tank',
      },
      bottom: {
        id: 'costume-female-casual-bottom',
        name: 'Dark Jeans',
        type: 'bottom',
        bundleId: 'costume-female-casual',
        gender: 'female',
        description: 'Classic dark jeans or pants',
      },
      shoes: {
        id: 'costume-female-casual-shoes',
        name: 'Casual Sneakers',
        type: 'shoes',
        bundleId: 'costume-female-casual',
        gender: 'female',
        description: 'Comfortable casual sneakers',
      },
    },
  },
  // Bundle 2 - Athleisure (Common - 500)
  {
    id: 'costume-female-athleisure',
    name: 'Athleisure',
    description: 'Stylish athletic-inspired everyday wear.',
    gender: 'female',
    rarity: 'common',
    price: COSTUME_PRICES.common,
    parts: {
      top: {
        id: 'costume-female-athleisure-top',
        name: 'Dark Sports Tank',
        type: 'top',
        bundleId: 'costume-female-athleisure',
        gender: 'female',
        description: 'Dark sports bra or tank top',
      },
      bottom: {
        id: 'costume-female-athleisure-bottom',
        name: 'Black Leggings',
        type: 'bottom',
        bundleId: 'costume-female-athleisure',
        gender: 'female',
        description: 'Sleek black leggings',
      },
      shoes: {
        id: 'costume-female-athleisure-shoes',
        name: 'Athleisure Sneakers',
        type: 'shoes',
        bundleId: 'costume-female-athleisure',
        gender: 'female',
        description: 'Stylish athleisure sneakers',
      },
    },
  },
  // Bundle 3 - Active/Sport (Rare - 1500)
  {
    id: 'costume-female-active',
    name: 'Active Sport',
    description: 'High-performance activewear for intense training.',
    gender: 'female',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-female-active-top',
        name: 'Dark Sports Top',
        type: 'top',
        bundleId: 'costume-female-active',
        gender: 'female',
        description: 'Technical dark sports top',
      },
      bottom: {
        id: 'costume-female-active-bottom',
        name: 'Athletic Leggings',
        type: 'bottom',
        bundleId: 'costume-female-active',
        gender: 'female',
        description: 'Performance black athletic leggings',
      },
      shoes: {
        id: 'costume-female-active-shoes',
        name: 'Performance Sneakers',
        type: 'shoes',
        bundleId: 'costume-female-active',
        gender: 'female',
        description: 'High-performance training sneakers',
      },
    },
  },
  // Bundle 4 - Urban Chic (Rare - 1500)
  {
    id: 'costume-female-urban',
    name: 'Urban Chic',
    description: 'Trendy urban fashion with stylish details.',
    gender: 'female',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-female-urban-top',
        name: 'Dark Stylish Crop Top',
        type: 'top',
        bundleId: 'costume-female-urban',
        gender: 'female',
        description: 'Fashionable dark crop top',
      },
      bottom: {
        id: 'costume-female-urban-bottom',
        name: 'Fashionable Dark Pants',
        type: 'bottom',
        bundleId: 'costume-female-urban',
        gender: 'female',
        description: 'Trendy dark fashionable pants',
      },
      shoes: {
        id: 'costume-female-urban-shoes',
        name: 'Trendy Sneakers',
        type: 'shoes',
        bundleId: 'costume-female-urban',
        gender: 'female',
        description: 'Fashion-forward trendy sneakers',
      },
    },
  },
  // Bundle 5 - Elegant/Business (Rare - 1500)
  {
    id: 'costume-female-elegant',
    name: 'Elegant Business',
    description: 'Sophisticated elegant wear for formal occasions.',
    gender: 'female',
    rarity: 'rare',
    price: COSTUME_PRICES.rare,
    parts: {
      top: {
        id: 'costume-female-elegant-top',
        name: 'Dark Elegant Blouse',
        type: 'top',
        bundleId: 'costume-female-elegant',
        gender: 'female',
        description: 'Refined dark elegant blouse',
      },
      bottom: {
        id: 'costume-female-elegant-bottom',
        name: 'Dark Dress Pants',
        type: 'bottom',
        bundleId: 'costume-female-elegant',
        gender: 'female',
        description: 'Tailored dark dress pants or skirt',
      },
      shoes: {
        id: 'costume-female-elegant-shoes',
        name: 'Elegant Boots',
        type: 'shoes',
        bundleId: 'costume-female-elegant',
        gender: 'female',
        description: 'Stylish elegant boots',
      },
    },
  },
  // Bundle 6 - Tactical/Adventure (Epic - 3000)
  {
    id: 'costume-female-tactical',
    name: 'Tactical Adventure',
    description: 'Rugged tactical gear for outdoor missions.',
    gender: 'female',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-female-tactical-top',
        name: 'Dark Tactical Jacket',
        type: 'top',
        bundleId: 'costume-female-tactical',
        gender: 'female',
        description: 'Functional dark tactical jacket',
      },
      bottom: {
        id: 'costume-female-tactical-bottom',
        name: 'Dark Cargo Pants',
        type: 'bottom',
        bundleId: 'costume-female-tactical',
        gender: 'female',
        description: 'Practical dark cargo pants',
      },
      shoes: {
        id: 'costume-female-tactical-shoes',
        name: 'Adventure Boots',
        type: 'shoes',
        bundleId: 'costume-female-tactical',
        gender: 'female',
        description: 'Durable adventure boots',
      },
    },
  },
  // Bundle 7 - Streetwear/Style (Epic - 3000)
  {
    id: 'costume-female-streetwear',
    name: 'Designer Streetwear',
    description: 'Premium designer streetwear collection.',
    gender: 'female',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-female-streetwear-top',
        name: 'Dark Branded Top',
        type: 'top',
        bundleId: 'costume-female-streetwear',
        gender: 'female',
        description: 'Premium dark branded top',
      },
      bottom: {
        id: 'costume-female-streetwear-bottom',
        name: 'Designer Dark Pants',
        type: 'bottom',
        bundleId: 'costume-female-streetwear',
        gender: 'female',
        description: 'High-end designer dark pants',
      },
      shoes: {
        id: 'costume-female-streetwear-shoes',
        name: 'Premium Sneakers',
        type: 'shoes',
        bundleId: 'costume-female-streetwear',
        gender: 'female',
        description: 'Exclusive premium sneakers',
      },
    },
  },
  // Bundle 8 - Winter/Cozy (Epic - 3000)
  {
    id: 'costume-female-winter',
    name: 'Winter Cozy',
    description: 'Warm and stylish winter wear.',
    gender: 'female',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-female-winter-top',
        name: 'Dark Winter Jacket',
        type: 'top',
        bundleId: 'costume-female-winter',
        gender: 'female',
        description: 'Cozy dark winter jacket',
      },
      bottom: {
        id: 'costume-female-winter-bottom',
        name: 'Insulated Pants',
        type: 'bottom',
        bundleId: 'costume-female-winter',
        gender: 'female',
        description: 'Warm insulated pants',
      },
      shoes: {
        id: 'costume-female-winter-shoes',
        name: 'Winter Boots',
        type: 'shoes',
        bundleId: 'costume-female-winter',
        gender: 'female',
        description: 'Stylish winter boots',
      },
    },
  },
  // Bundle 9 - Dancer/Elegant (Epic - 3000)
  {
    id: 'costume-female-dancer',
    name: 'Elegant Dancer',
    description: 'Graceful dancewear for fluid movement.',
    gender: 'female',
    rarity: 'epic',
    price: COSTUME_PRICES.epic,
    parts: {
      top: {
        id: 'costume-female-dancer-top',
        name: 'Dark Dance Top',
        type: 'top',
        bundleId: 'costume-female-dancer',
        gender: 'female',
        description: 'Elegant dark dance top',
      },
      bottom: {
        id: 'costume-female-dancer-bottom',
        name: 'Dark Dance Pants',
        type: 'bottom',
        bundleId: 'costume-female-dancer',
        gender: 'female',
        description: 'Flowing dark dance pants',
      },
      shoes: {
        id: 'costume-female-dancer-shoes',
        name: 'Dance Shoes',
        type: 'shoes',
        bundleId: 'costume-female-dancer',
        gender: 'female',
        description: 'Professional dance shoes',
      },
    },
  },
  // Bundle 10 - Premium/Legendary (Legendary - 5000)
  {
    id: 'costume-female-legendary',
    name: 'Legendary Elite',
    description: 'The ultimate premium outfit with cyan glow effects.',
    gender: 'female',
    rarity: 'legendary',
    price: COSTUME_PRICES.legendary,
    parts: {
      top: {
        id: 'costume-female-legendary-top',
        name: 'Glowing Dark Top',
        type: 'top',
        bundleId: 'costume-female-legendary',
        gender: 'female',
        description: 'Premium dark top with cyan energy glow',
      },
      bottom: {
        id: 'costume-female-legendary-bottom',
        name: 'Cyan Accent Pants',
        type: 'bottom',
        bundleId: 'costume-female-legendary',
        gender: 'female',
        description: 'Premium pants with cyan energy lines',
      },
      shoes: {
        id: 'costume-female-legendary-shoes',
        name: 'Glowing Boots',
        type: 'shoes',
        bundleId: 'costume-female-legendary',
        gender: 'female',
        description: 'Legendary boots radiating cyan power',
      },
    },
  },
];

// Combined costume bundles
export const allCostumeBundles: CostumeBundle[] = [...maleCostumeBundles, ...femaleCostumeBundles];

// Helper to get all costume parts as flat array
export function getAllCostumeParts(): CostumePartItem[] {
  const parts: CostumePartItem[] = [];
  allCostumeBundles.forEach(bundle => {
    parts.push(bundle.parts.top, bundle.parts.bottom, bundle.parts.shoes);
  });
  return parts;
}

// Helper functions
export function getCostumeBundleById(id: string): CostumeBundle | undefined {
  return allCostumeBundles.find(bundle => bundle.id === id);
}

export function getCostumePartById(id: string): CostumePartItem | undefined {
  return getAllCostumeParts().find(part => part.id === id);
}

export function getCostumeBundlesByGender(gender: 'male' | 'female'): CostumeBundle[] {
  return allCostumeBundles.filter(bundle => bundle.gender === gender || bundle.gender === 'unisex');
}

export function getCostumeBundlesByRarity(rarity: 'common' | 'rare' | 'epic' | 'legendary'): CostumeBundle[] {
  return allCostumeBundles.filter(bundle => bundle.rarity === rarity);
}
