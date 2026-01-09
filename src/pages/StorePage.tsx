import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { cosmetics, getCosmeticsByCategory } from '@/data/cosmetics';
import { Coins, Check, Lock, Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { AvatarPreview, CosmeticPreview } from '@/components/AvatarPreview';
import { AuraPreview, AuraEffect, getAuraTypeFromId } from '@/components/AuraEffect';
import { Cosmetic } from '@/types/game';
import { StorePageSkeleton } from '@/components/skeletons';
import { playPurchaseSound, playErrorSound } from '@/lib/sounds';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = ['avatars', 'outfits', 'weapons', 'auras', 'name_colors', 'frames'];

const categoryLabels: Record<string, string> = {
  avatars: '🧑 Avatars',
  outfits: '👕 Outfits',
  weapons: '⚔️ Weapons',
  auras: '✨ Auras',
  name_colors: '🎨 Colors',
  frames: '🖼️ Frames',
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
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
  const [purchaseConfirmItem, setPurchaseConfirmItem] = useState<Cosmetic | null>(null);

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
        playPurchaseSound();
        toast({ title: 'Equipped!', description: `${item.name} is now equipped` });
      }
      return;
    }

    // Check if level locked
    if (item.unlockType === 'level' && item.unlockLevel && profile && profile.level < item.unlockLevel) {
      playErrorSound();
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
        playPurchaseSound();
        toast({ title: 'Unlocked!', description: `You now own ${item.name}` });
      }
      return;
    }

    // Show purchase confirmation dialog
    setPurchaseConfirmItem(item);
  };

  const confirmPurchase = async () => {
    if (!purchaseConfirmItem || !profile) return;
    
    if (profile.gold < purchaseConfirmItem.price) {
      playErrorSound();
      toast({ title: 'Not enough gold', variant: 'destructive' });
      setPurchaseConfirmItem(null);
      return;
    }

    const success = await purchaseCosmetic(purchaseConfirmItem.id, purchaseConfirmItem.price);
    if (success) {
      playPurchaseSound();
      toast({ title: 'Purchased!', description: `You now own ${purchaseConfirmItem.name}` });
    } else {
      playErrorSound();
      toast({ title: 'Purchase failed', variant: 'destructive' });
    }
    setPurchaseConfirmItem(null);
    setSelectedItem(null);
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
    return <StorePageSkeleton />;
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Store</h1>
        <motion.div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ['0 0 10px hsl(var(--accent) / 0.2)', '0 0 20px hsl(var(--accent) / 0.4)', '0 0 10px hsl(var(--accent) / 0.2)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Coins className="w-4 h-4 text-accent" />
          <motion.span 
            key={profile.gold}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="font-display text-sm font-bold text-accent"
          >
            {profile.gold.toLocaleString()}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar scroll-x touch-pan-x"
      >
        {categories.map((cat, index) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
              activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-glow-primary' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {categoryLabels[cat]}
          </motion.button>
        ))}
      </motion.div>

      {/* Items Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        key={activeCategory}
      >
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => {
            const owned = ownedCosmetics.includes(item.id);
            const locked = isLocked(item);
            const equipped = isEquipped(item);
            
            return (
              <motion.div
                key={item.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  y: -4, 
                  boxShadow: equipped 
                    ? '0 10px 40px -10px hsl(var(--primary) / 0.5)' 
                    : '0 10px 30px -10px hsl(var(--primary) / 0.3)',
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  'card-game p-3 relative overflow-hidden cursor-pointer',
                  equipped && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                  locked && 'opacity-60'
                )}
                onClick={() => setSelectedItem(item)}
              >
                {/* Item Preview */}
                <motion.div 
                  className="flex justify-center mb-3"
                  whileHover={{ scale: 1.05 }}
                >
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
                  ) : item.category === 'auras' ? (
                    <AuraPreview auraId={item.id} size="lg" />
                  ) : (
                    <CosmeticPreview
                      category={item.category}
                      name={item.name}
                      rarity={item.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                      size="lg"
                    />
                  )}
                </motion.div>
                
                {/* Item Info */}
                <h3 className="font-semibold text-sm text-foreground truncate text-center">
                  {item.name}
                </h3>
                
                {/* Rarity Badge */}
                <div className="flex justify-center mt-1">
                  <motion.span 
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full capitalize',
                      `badge-rarity-${item.rarity}`
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.rarity}
                  </motion.span>
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
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                  </motion.div>
                </div>

                {/* Equipped indicator */}
                {equipped && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {displayItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          </motion.div>
          <p className="text-muted-foreground">No items in this category</p>
        </motion.div>
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div 
                  className="w-12 h-1 bg-muted rounded-full mx-auto mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                />
                
                <motion.div 
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Large Preview */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
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
                    ) : selectedItem.category === 'auras' ? (
                      <AuraEffect type={getAuraTypeFromId(selectedItem.id)} size="xl">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted to-card flex items-center justify-center">
                          <span className="text-4xl">✨</span>
                        </div>
                      </AuraEffect>
                    ) : (
                      <CosmeticPreview
                        category={selectedItem.category}
                        name={selectedItem.name}
                        rarity={selectedItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                        size="lg"
                      />
                    )}
                  </motion.div>
                  
                  <motion.h2 
                    className="font-display text-xl font-bold text-foreground mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedItem.name}
                  </motion.h2>
                  
                  <motion.span 
                    className={cn(
                      'text-xs px-3 py-1 rounded-full capitalize mt-2',
                      `badge-rarity-${selectedItem.rarity}`
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    {selectedItem.rarity}
                  </motion.span>
                  
                  <motion.p 
                    className="text-sm text-muted-foreground text-center mt-3 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedItem.description}
                  </motion.p>
                  
                  {/* Action Button */}
                  <motion.div 
                    className="w-full mt-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {isLocked(selectedItem) ? (
                      <Button disabled className="w-full" size="lg">
                        <Lock className="w-4 h-4 mr-2" />
                        Reach Level {selectedItem.unlockLevel}
                      </Button>
                    ) : ownedCosmetics.includes(selectedItem.id) ? (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                      </motion.div>
                    ) : (
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          className="w-full relative overflow-hidden group" 
                          size="lg"
                          onClick={() => {
                            handlePurchase(selectedItem);
                            setSelectedItem(null);
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                          />
                          {selectedItem.price === 0 ? (
                            'Claim for Free'
                          ) : (
                            <>
                              <Coins className="w-4 h-4 mr-2" />
                              Purchase for {selectedItem.price.toLocaleString()} Gold
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Purchase Confirmation Dialog */}
      <AlertDialog open={!!purchaseConfirmItem} onOpenChange={(open) => !open && setPurchaseConfirmItem(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display flex items-center gap-2">
              <Coins className="w-5 h-5 text-accent" />
              Confirm Purchase
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {purchaseConfirmItem && (
                  <>
                    <div className="flex items-center justify-center py-4">
                      {purchaseConfirmItem.category === 'avatars' ? (
                        <AvatarPreview
                          avatarId={purchaseConfirmItem.id}
                          name={purchaseConfirmItem.name}
                          rarity={purchaseConfirmItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                          gender={purchaseConfirmItem.gender}
                          size="lg"
                          showGlow
                        />
                      ) : purchaseConfirmItem.category === 'auras' ? (
                        <AuraPreview auraId={purchaseConfirmItem.id} size="lg" />
                      ) : (
                        <CosmeticPreview
                          category={purchaseConfirmItem.category}
                          name={purchaseConfirmItem.name}
                          rarity={purchaseConfirmItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary'}
                          size="lg"
                        />
                      )}
                    </div>
                    <p className="text-center">
                      Purchase <span className="font-semibold text-foreground">{purchaseConfirmItem.name}</span> for{' '}
                      <span className="font-bold text-accent">{purchaseConfirmItem.price.toLocaleString()} Gold</span>?
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <span className="text-muted-foreground">Your balance:</span>
                      <span className={cn(
                        "font-bold",
                        profile && profile.gold >= purchaseConfirmItem.price ? "text-accent" : "text-destructive"
                      )}>
                        {profile?.gold.toLocaleString() || 0} Gold
                      </span>
                    </div>
                    {profile && profile.gold < purchaseConfirmItem.price && (
                      <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Not enough gold!</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPurchase}
              disabled={!profile || !purchaseConfirmItem || profile.gold < purchaseConfirmItem.price}
              className="bg-primary hover:bg-primary/90"
            >
              <Coins className="w-4 h-4 mr-2" />
              Confirm Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
