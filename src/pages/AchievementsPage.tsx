import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy, Lock, Star, Target, Info, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Achievement } from '@/types/game';

const filters = ['all', 'unlocked', 'locked'];
const categories = ['all', 'easy', 'medium', 'hard', 'very_hard'];

const categoryLabels: Record<string, string> = {
  all: '🏆 All',
  easy: '🌱 Easy',
  medium: '⚔️ Medium',
  hard: '🔥 Hard',
  very_hard: '💎 Legendary',
};

const rarityColors: Record<string, string> = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-green-400 to-emerald-600',
  rare: 'from-blue-400 to-indigo-600',
  legendary: 'from-amber-400 to-orange-600',
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
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
  const [category, setCategory] = useState('all');
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

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
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'unlocked' 
        ? unlockedAchievements.includes(a.id) 
        : !unlockedAchievements.includes(a.id);
    
    const matchesCategory = category === 'all' ? true : a.category === category;
    
    return matchesFilter && matchesCategory;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glows */}
      <motion.div 
        className="fixed top-1/4 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="fixed bottom-1/3 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Achievements</h1>
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50"
          animate={{ boxShadow: ['0 0 10px hsl(var(--accent) / 0.2)', '0 0 20px hsl(var(--accent) / 0.4)', '0 0 10px hsl(var(--accent) / 0.2)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-4 h-4 text-accent" />
          <span className="font-display text-sm font-bold text-accent">
            {unlockedCount} / {totalCount}
          </span>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Overall Progress</span>
          <span>{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2 mb-3 hide-scrollbar"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((cat, index) => (
          <motion.button
            key={cat}
            onClick={() => setCategory(cat)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              category === cat 
                ? 'bg-primary text-primary-foreground shadow-glow-primary' 
                : 'bg-muted text-muted-foreground'
            )}
          >
            {categoryLabels[cat]}
          </motion.button>
        ))}
      </motion.div>

      {/* Status Filter */}
      <motion.div 
        className="flex gap-2 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
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
              filter === f ? 'bg-accent text-accent-foreground shadow-glow-accent' : 'bg-muted text-muted-foreground'
            )}
          >
            {f}
          </motion.button>
        ))}
      </motion.div>

      {/* Achievements Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        key={`${filter}-${category}`}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((ach, index) => {
            const unlocked = unlockedAchievements.includes(ach.id);
            const progressPercent = ach.progress ? (ach.progress.current / ach.progress.required) * 100 : 0;
            
            return (
              <motion.div
                key={ach.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                whileHover={{ 
                  y: -6, 
                  boxShadow: unlocked 
                    ? '0 15px 40px -10px hsl(var(--accent) / 0.5)' 
                    : '0 10px 30px -10px hsl(var(--primary) / 0.3)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAchievement(ach)}
                className={cn(
                  'card-game p-4 relative overflow-hidden cursor-pointer group', 
                  !unlocked && 'opacity-70'
                )}
              >
                {/* Unlocked glow effect */}
                {unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-transparent pointer-events-none"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Rarity gradient border */}
                <motion.div 
                  className={cn(
                    'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity',
                    'bg-gradient-to-br', rarityColors[ach.rarity]
                  )}
                  style={{ padding: '1px' }}
                />
                
                {/* Icon */}
                <motion.div 
                  className="relative text-4xl mb-3 text-center"
                  animate={unlocked ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {!unlocked && (
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                  )}
                  <span className={cn(!unlocked && 'blur-sm grayscale')}>
                    {ach.icon}
                  </span>
                </motion.div>
                
                {/* Name */}
                <h3 className="font-semibold text-sm text-foreground text-center line-clamp-1 mb-1">
                  {ach.name}
                </h3>
                
                {/* Description */}
                <p className="text-[10px] text-muted-foreground text-center line-clamp-2 mb-2 min-h-[28px]">
                  {ach.description}
                </p>
                
                {/* Rarity Badge */}
                <div className="flex justify-center mb-2">
                  <motion.span 
                    className={cn(
                      'text-[9px] px-2 py-0.5 rounded-full capitalize font-medium',
                      `badge-rarity-${ach.rarity}`
                    )}
                    whileHover={{ scale: 1.1 }}
                  >
                    {ach.rarity}
                  </motion.span>
                </div>

                {/* Progress Bar */}
                {ach.progress && !unlocked && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{ach.progress.current}/{ach.progress.required}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Unlocked indicator */}
                {unlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="absolute top-2 right-2"
                  >
                    <motion.div
                      animate={{ 
                        boxShadow: ['0 0 10px hsl(var(--accent) / 0.5)', '0 0 20px hsl(var(--accent) / 0.8)', '0 0 10px hsl(var(--accent) / 0.5)']
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-accent-foreground" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Info button hint */}
                <motion.div
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  <Info className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          </motion.div>
          <p className="text-muted-foreground text-lg font-medium">No achievements found</p>
          <p className="text-muted-foreground/70 text-sm mt-1">Try a different filter</p>
        </motion.div>
      )}

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedAchievement(null)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background glow based on rarity */}
                <motion.div 
                  className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none',
                    selectedAchievement.rarity === 'legendary' && 'bg-amber-500/30',
                    selectedAchievement.rarity === 'rare' && 'bg-blue-500/30',
                    selectedAchievement.rarity === 'uncommon' && 'bg-green-500/30',
                    selectedAchievement.rarity === 'common' && 'bg-gray-500/20'
                  )}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Close button */}
                <motion.button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedAchievement(null)}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
                
                <motion.div 
                  className="w-12 h-1 bg-muted rounded-full mx-auto mb-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2 }}
                />
                
                <motion.div 
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Large Icon */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative"
                  >
                    <motion.div
                      className={cn(
                        'w-24 h-24 rounded-2xl flex items-center justify-center text-5xl',
                        'bg-gradient-to-br shadow-xl',
                        rarityColors[selectedAchievement.rarity]
                      )}
                      animate={unlockedAchievements.includes(selectedAchievement.id) ? {
                        boxShadow: [
                          '0 0 20px hsl(var(--accent) / 0.3)',
                          '0 0 40px hsl(var(--accent) / 0.5)',
                          '0 0 20px hsl(var(--accent) / 0.3)'
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {!unlockedAchievements.includes(selectedAchievement.id) && (
                        <motion.div 
                          className="absolute inset-0 rounded-2xl bg-background/60 flex items-center justify-center"
                        >
                          <Lock className="w-10 h-10 text-muted-foreground" />
                        </motion.div>
                      )}
                      <span className={cn(
                        !unlockedAchievements.includes(selectedAchievement.id) && 'blur-md grayscale'
                      )}>
                        {selectedAchievement.icon}
                      </span>
                    </motion.div>
                    
                    {unlockedAchievements.includes(selectedAchievement.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-glow-accent"
                      >
                        <Star className="w-4 h-4 text-accent-foreground fill-current" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Name */}
                  <motion.h2 
                    className="font-display text-2xl font-bold text-foreground mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedAchievement.name}
                  </motion.h2>
                  
                  {/* Rarity Badge */}
                  <motion.span 
                    className={cn(
                      'text-xs px-4 py-1 rounded-full capitalize font-semibold mt-2',
                      `badge-rarity-${selectedAchievement.rarity}`
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    {selectedAchievement.rarity}
                  </motion.span>
                  
                  {/* Description */}
                  <motion.p 
                    className="text-sm text-muted-foreground text-center mt-4 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {selectedAchievement.description}
                  </motion.p>

                  {/* Unlock Condition */}
                  <motion.div
                    className="flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-muted/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs text-foreground font-medium">
                      {selectedAchievement.unlockCondition}
                    </span>
                  </motion.div>

                  {/* Progress Section */}
                  {selectedAchievement.progress && (
                    <motion.div 
                      className="w-full mt-6 px-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">
                          {selectedAchievement.progress.current} / {selectedAchievement.progress.required}
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(selectedAchievement.progress.current / selectedAchievement.progress.required) * 100}%`,
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                          }}
                          transition={{ 
                            width: { delay: 0.3, duration: 0.8, ease: 'easeOut' },
                            backgroundPosition: { duration: 3, repeat: Infinity }
                          }}
                          style={{ backgroundSize: '200% 100%' }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center mt-2">
                        {((selectedAchievement.progress.current / selectedAchievement.progress.required) * 100).toFixed(0)}% Complete
                      </p>
                    </motion.div>
                  )}

                  {/* Status */}
                  <motion.div 
                    className={cn(
                      'mt-6 px-6 py-3 rounded-xl font-semibold text-sm',
                      unlockedAchievements.includes(selectedAchievement.id)
                        ? 'bg-accent/20 text-accent border border-accent/50'
                        : 'bg-muted text-muted-foreground'
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {unlockedAchievements.includes(selectedAchievement.id) ? (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Achievement Unlocked!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Keep going to unlock!
                      </span>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
