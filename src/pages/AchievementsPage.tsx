import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const filters = ['all', 'unlocked', 'locked'];

export default function AchievementsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setUnlockedAchievements(data.map(a => a.achievement_id));
          }
        });
    }
  }, [user]);

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return unlockedAchievements.includes(a.id);
    if (filter === 'locked') return !unlockedAchievements.includes(a.id);
    return true;
  });

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Achievements</h1>
        <span className="text-sm text-primary font-semibold">
          {unlockedAchievements.length} / {achievements.length}
        </span>
      </motion.div>

      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium capitalize',
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map((ach, index) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={cn('card-game p-3 text-center', !unlocked && 'achievement-locked')}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h3 className="font-semibold text-xs text-foreground truncate">{ach.name}</h3>
              <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-1', `badge-rarity-${ach.rarity}`)}>
                {ach.rarity}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
