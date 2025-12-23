import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy } from 'lucide-react';

const filters = ['all', 'unlocked', 'locked'];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.02,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
};

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
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-1/4 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Achievements</h1>
        <motion.div
          className="flex items-center gap-1 text-sm text-primary font-semibold"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-4 h-4" />
          {unlockedAchievements.length} / {achievements.length}
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex gap-2 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {filters.map((f, index) => (
          <motion.button
            key={f}
            onClick={() => setFilter(f)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium capitalize transition-all',
              filter === f ? 'bg-primary text-primary-foreground shadow-glow-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-3 gap-3"
        initial="hidden"
        animate="visible"
        key={filter}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((ach, index) => {
            const unlocked = unlockedAchievements.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  y: -4, 
                  boxShadow: unlocked ? '0 10px 30px -10px hsl(var(--accent) / 0.4)' : undefined,
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  'card-game p-3 text-center relative overflow-hidden cursor-pointer', 
                  !unlocked && 'opacity-50 grayscale'
                )}
              >
                {/* Unlocked glow effect */}
                {unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <motion.div 
                  className="text-3xl mb-2"
                  animate={unlocked ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {ach.icon}
                </motion.div>
                <h3 className="font-semibold text-xs text-foreground truncate">{ach.name}</h3>
                <motion.span 
                  className={cn('text-[9px] px-1.5 py-0.5 rounded-full inline-block mt-1', `badge-rarity-${ach.rarity}`)}
                  whileHover={{ scale: 1.1 }}
                >
                  {ach.rarity}
                </motion.span>
                
                {unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1"
                  >
                    <Sparkles className="w-3 h-3 text-accent" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
