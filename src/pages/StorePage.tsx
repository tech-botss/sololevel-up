import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { cosmetics } from '@/data/cosmetics';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const categories = ['all', 'outfits', 'weapons', 'auras', 'name_colors', 'frames'];

export default function StorePage() {
  const { user } = useAuth();
  const { profile, fetchProfile, purchaseCosmetic } = useGameStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [ownedCosmetics, setOwnedCosmetics] = useState<string[]>([]);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile(user.id);
    }
  }, [user, profile, fetchProfile]);

  useEffect(() => {
    if (user) {
      supabase
        .from('user_cosmetics')
        .select('cosmetic_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setOwnedCosmetics(data.map(c => c.cosmetic_id));
          }
        });
    }
  }, [user]);

  const filtered = activeCategory === 'all' ? cosmetics : cosmetics.filter(c => c.category === activeCategory);

  const handlePurchase = async (id: string, price: number, name: string) => {
    const success = await purchaseCosmetic(id, price);
    if (success) {
      setOwnedCosmetics([...ownedCosmetics, id]);
      toast({ title: 'Purchased!', description: `You now own ${name}` });
    } else {
      toast({ title: 'Not enough gold', variant: 'destructive' });
    }
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
              'px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all capitalize',
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((item, index) => {
          const owned = ownedCosmetics.includes(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="card-game p-3"
            >
              <div className={cn(
                'w-full aspect-square rounded-lg mb-2 flex items-center justify-center',
                item.rarity === 'legendary' && 'bg-gradient-to-br from-accent/30 to-accent/10',
                item.rarity === 'rare' && 'bg-gradient-to-br from-stat-int/30 to-stat-int/10',
                item.rarity === 'uncommon' && 'bg-gradient-to-br from-stat-end/30 to-stat-end/10',
                item.rarity === 'common' && 'bg-muted'
              )}>
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-sm text-foreground truncate">{item.name}</h3>
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded-full inline-block mt-1',
                `badge-rarity-${item.rarity}`
              )}>
                {item.rarity}
              </span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-accent font-semibold">{item.price.toLocaleString()} G</span>
                <Button
                  size="sm"
                  disabled={owned}
                  onClick={() => handlePurchase(item.id, item.price, item.name)}
                  className="h-7 text-xs"
                >
                  {owned ? <Check className="w-3 h-3" /> : 'Buy'}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
