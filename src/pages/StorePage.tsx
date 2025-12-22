import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { cosmetics, getCosmeticsByCategory } from '@/data/cosmetics';
import { Coins, Check, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AvatarPreview, CosmeticPreview } from '@/components/AvatarPreview';
import { Cosmetic } from '@/types/game';

const categories = ['avatars', 'outfits', 'weapons', 'auras', 'name_colors', 'frames'];

const categoryLabels: Record<string, string> = {
  avatars: '🧑 Avatars',
  outfits: '👕 Outfits',
  weapons: '⚔️ Weapons',
  auras: '✨ Auras',
  name_colors: '🎨 Colors',
  frames: '🖼️ Frames',
};

export default function StorePage() {
  const { user } = useAuth();
  const { 
    profile, 
    fetchProfile, 
    purchaseCosmetic, 
    ownedCosmetics, 
    equippedCosmetics,
    equipCosmetic 
  } = useGameStore();
  const [activeCategory, setActiveCategory] = useState('avatars');
  const [selectedItem, setSelectedItem] = useState<Cosmetic | null>(null);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile(user.id);
    }
  }, [user, profile, fetchProfile]);

  const filtered = getCosmeticsByCategory(activeCategory);

  // Filter avatars by user gender preference
  const displayItems = activeCategory === 'avatars' 
    ? filtered.filter(item => {
        // Show all if no gender preference, otherwise filter
        if (!profile?.gender) return true;
        return item.gender === profile.gender || item.gender === 'neutral';
      })
    : filtered;

  const handlePurchase = async (item: Cosmetic) => {
    if (ownedCosmetics.includes(item.id)) {
      // Already owned, equip it
      const success = await equipCosmetic(item.id, item.category);
      if (success) {
        toast({ title: 'Equipped!', description: `${item.name} is now equipped` });
      }
      return;
    }

    // Check if level locked
    if (item.unlockType === 'level' && item.unlockLevel && profile && profile.level < item.unlockLevel) {
      toast({ 
        title: 'Level Required', 
        description: `Reach level ${item.unlockLevel} to unlock this item`,
        variant: 'destructive' 
      });
      return;
    }

    // Check if free
    if (item.price === 0 || item.unlockType === 'free') {
      const success = await purchaseCosmetic(item.id, 0);
      if (success) {
        toast({ title: 'Unlocked!', description: `You now own ${item.name}` });
      }
      return;
    }

    // Purchase
    const success = await purchaseCosmetic(item.id, item.price);
    if (success) {
      toast({ title: 'Purchased!', description: `You now own ${item.name}` });
    } else {
      toast({ title: 'Not enough gold', variant: 'destructive' });
    }
  };

  const isLocked = (item: Cosmetic) => {
    if (ownedCosmetics.includes(item.id)) return false;
    if (item.unlockType === 'level' && item.unlockLevel && profile) {
      return profile.level < item.unlockLevel;
    }
    return false;
  };

  const isEquipped = (item: Cosmetic) => {
    const categoryKey = item.category === 'avatars' ? 'avatar' : 
                       item.category === 'outfits' ? 'outfit' :
                       item.category === 'weapons' ? 'weapon' :
                       item.category === 'auras' ? 'aura' :
                       item.category === 'name_colors' ? 'name_color' : 'frame';
    return equippedCosmetics[categoryKey as keyof typeof equippedCosmetics] === item.id;
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Store</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50">
          <Coins className="w-4 h-4 text-accent" />
          <span className="font-display text-sm font-bold text-accent">{profile.gold.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-glow-primary' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => {
            const owned = ownedCosmetics.includes(item.id);
            const locked = isLocked(item);
            const equipped = isEquipped(item);
            
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'card-game p-3 relative overflow-hidden transition-all duration-300',
                  equipped && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                  locked && 'opacity-60'
                )}
                onClick={() => setSelectedItem(item)}
              >
                {/* Item Preview */}
                <div className="flex justify-center mb-3">
                  {item.category === 'avatars' ? (
                    <AvatarPreview
                      avatarId={item.id}
                      name={item.name}
                      rarity={item.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                      gender={item.gender}
                      size="lg"
                      isLocked={locked}
                      isEquipped={equipped}
                      showGlow={!locked}
                    />
                  ) : (
                    <CosmeticPreview
                      category={item.category}
                      name={item.name}
                      rarity={item.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                      size="lg"
                    />
                  )}
                </div>
                
                {/* Item Info */}
                <h3 className="font-semibold text-sm text-foreground truncate text-center">
                  {item.name}
                </h3>
                
                {/* Rarity Badge */}
                <div className="flex justify-center mt-1">
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full capitalize',
                    `badge-rarity-${item.rarity}`
                  )}>
                    {item.rarity}
                  </span>
                </div>
                
                {/* Price / Status */}
                <div className="flex items-center justify-between mt-3">
                  {locked ? (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Lv.{item.unlockLevel}
                    </span>
                  ) : owned ? (
                    <span className="text-xs text-stat-end font-semibold">Owned</span>
                  ) : item.price === 0 ? (
                    <span className="text-xs text-stat-end font-semibold">Free</span>
                  ) : (
                    <span className="text-xs text-accent font-semibold flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      {item.price.toLocaleString()}
                    </span>
                  )}
                  
                  <Button
                    size="sm"
                    variant={equipped ? 'secondary' : owned ? 'outline' : 'default'}
                    disabled={locked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(item);
                    }}
                    className="h-7 text-xs px-3"
                  >
                    {equipped ? (
                      <Check className="w-3 h-3" />
                    ) : owned ? (
                      'Equip'
                    ) : locked ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      'Get'
                    )}
                  </Button>
                </div>

                {/* Equipped indicator */}
                {equipped && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {displayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items in this category</p>
        </div>
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              
              <div className="flex flex-col items-center">
                {/* Large Preview */}
                {selectedItem.category === 'avatars' ? (
                  <AvatarPreview
                    avatarId={selectedItem.id}
                    name={selectedItem.name}
                    rarity={selectedItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                    gender={selectedItem.gender}
                    size="xl"
                    isLocked={isLocked(selectedItem)}
                    isEquipped={isEquipped(selectedItem)}
                    showGlow
                  />
                ) : (
                  <CosmeticPreview
                    category={selectedItem.category}
                    name={selectedItem.name}
                    rarity={selectedItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                    size="lg"
                  />
                )}
                
                <h2 className="font-display text-xl font-bold text-foreground mt-4">
                  {selectedItem.name}
                </h2>
                
                <span className={cn(
                  'text-xs px-3 py-1 rounded-full capitalize mt-2',
                  `badge-rarity-${selectedItem.rarity}`
                )}>
                  {selectedItem.rarity}
                </span>
                
                <p className="text-sm text-muted-foreground text-center mt-3 px-4">
                  {selectedItem.description}
                </p>
                
                {/* Action Button */}
                <div className="w-full mt-6">
                  {isLocked(selectedItem) ? (
                    <Button disabled className="w-full" size="lg">
                      <Lock className="w-4 h-4 mr-2" />
                      Reach Level {selectedItem.unlockLevel}
                    </Button>
                  ) : ownedCosmetics.includes(selectedItem.id) ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      variant={isEquipped(selectedItem) ? 'secondary' : 'default'}
                      onClick={() => {
                        handlePurchase(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      {isEquipped(selectedItem) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Currently Equipped
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Equip Now
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => {
                        handlePurchase(selectedItem);
                        setSelectedItem(null);
                      }}
                    >
                      {selectedItem.price === 0 ? (
                        'Claim for Free'
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Purchase for {selectedItem.price.toLocaleString()} Gold
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
