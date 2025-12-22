import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

const filters = ['all', 'unlocked', 'locked'];

export default function AchievementsPage() {
  const { user } = useGameStore();
  const [filter, setFilter] = useState('all');

  const filtered = achievements.filter(a => {
    if (filter === 'unlocked') return user.unlockedAchievements.includes(a.id);
    if (filter === 'locked') return !user.unlockedAchievements.includes(a.id);
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
          {user.unlockedAchievements.length} / {achievements.length}
        </span>
      </motion.div>

      {/* Filters */}
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

      {/* Achievements Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((ach, index) => {
          const unlocked = user.unlockedAchievements.includes(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                'card-game p-3 text-center',
                !unlocked && 'achievement-locked'
              )}
            >
              <div className="text-3xl mb-2">{ach.icon}</div>
              <h3 className="font-semibold text-xs text-foreground truncate">{ach.name}</h3>
              <span className={cn(
                'text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-1',
                `badge-rarity-${ach.rarity}`
              )}>
                {ach.rarity}
              </span>
              {!unlocked && ach.progress && (
                <div className="mt-2">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(ach.progress.current / ach.progress.required) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {ach.progress.current}/{ach.progress.required}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
