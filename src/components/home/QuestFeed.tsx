import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Play, ChevronRight, Coins } from 'lucide-react';
import { Quest } from '@/types/game';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestFeedProps {
  quests: Quest[];
  onStartQuest: (quest: Quest) => void;
}

const categories = ['All', 'Study', 'Fitness', 'Social', 'Money'];

const difficultyStyles = {
  easy: 'badge-difficulty-easy',
  medium: 'badge-difficulty-medium',
  hard: 'badge-difficulty-hard',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.98 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 }
  },
  exit: { 
    opacity: 0, 
    x: 30, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export function QuestFeed({ quests, onStartQuest }: QuestFeedProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredQuests = activeCategory === 'All' 
    ? quests 
    : quests.filter(q => q.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <motion.h2 
          className="font-display text-xl font-bold text-foreground tracking-wide"
          animate={{ 
            textShadow: ['0 0 10px hsl(190 100% 50% / 0.2)', '0 0 20px hsl(190 100% 50% / 0.4)', '0 0 10px hsl(190 100% 50% / 0.2)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Available Quests
        </motion.h2>
        <motion.div
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <ChevronRight className="w-5 h-5 text-primary" style={{ filter: 'drop-shadow(0 0 5px hsl(190 100% 50%))' }} />
        </motion.div>
      </div>

      {/* Category Filter - Glowing Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-5 hide-scrollbar">
        {categories.map((cat, index) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded text-xs font-display tracking-[0.12em] uppercase whitespace-nowrap transition-all border relative overflow-hidden',
              activeCategory === cat
                ? 'text-primary border-primary/60'
                : 'bg-muted/30 text-muted-foreground border-border hover:border-primary/40'
            )}
            style={activeCategory === cat ? {
              background: 'linear-gradient(160deg, hsl(190 100% 50% / 0.2) 0%, hsl(190 100% 50% / 0.05) 100%)',
              boxShadow: '0 0 20px hsl(190 100% 50% / 0.2), inset 0 0 20px hsl(190 100% 50% / 0.05)'
            } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeCategory === cat && (
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent, hsl(190 100% 50% / 0.1), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </div>

      {/* Quest List - 3D Cards */}
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {filteredQuests.slice(0, 5).map((quest) => (
            <motion.div
              key={quest.id}
              className="quest-card group relative"
              variants={itemVariants}
              layout
              whileHover={{ x: 6, scale: 1.01 }}
            >
              {/* Hover glow overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at left, hsl(190 100% 50% / 0.08) 0%, transparent 70%)' }}
              />

              <div className="flex items-center gap-4 relative z-10">
                {/* Quest Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-display font-bold text-foreground truncate text-base">{quest.name}</h4>
                    <motion.span 
                      className={`text-[10px] font-display px-2 py-1 rounded uppercase tracking-wider ${difficultyStyles[quest.difficulty]}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {quest.difficulty}
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {quest.estimatedMinutes}m
                    </span>
                    <span className="flex items-center gap-1.5 text-primary font-semibold">
                      <Zap className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px hsl(190 100% 50%))' }} />
                      +{quest.xpReward}
                    </span>
                    <span className="flex items-center gap-1.5 text-accent font-semibold">
                      <Coins className="w-3.5 h-3.5" style={{ filter: 'drop-shadow(0 0 4px hsl(155 100% 50%))' }} />
                      +{quest.goldReward}
                    </span>
                  </div>
                </div>

                {/* Start Button */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="icon"
                    className="w-11 h-11 rounded-lg btn-game relative overflow-hidden"
                    onClick={() => onStartQuest(quest)}
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 hover:opacity-100"
                      style={{ background: 'radial-gradient(circle, hsl(190 100% 50% / 0.2), transparent)' }}
                    />
                    <Play className="w-5 h-5 relative z-10" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredQuests.length === 0 && (
        <motion.div
          className="text-center py-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="font-display tracking-[0.15em] text-muted-foreground">No quests available in this category</p>
        </motion.div>
      )}
    </motion.div>
  );
}
