import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Play, ChevronRight } from 'lucide-react';
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

export function QuestFeed({ quests, onStartQuest }: QuestFeedProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredQuests = activeCategory === 'All' 
    ? quests 
    : quests.filter(q => q.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground tracking-wide">Available Quests</h2>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded text-xs font-display tracking-wider uppercase whitespace-nowrap transition-all border',
              activeCategory === cat
                ? 'bg-primary/20 text-primary border-primary/50 shadow-cyan'
                : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/30'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQuests.slice(0, 5).map((quest, index) => (
            <motion.div
              key={quest.id}
              className="quest-card group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-4">
                {/* Quest Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-semibold text-foreground truncate">{quest.name}</h4>
                    <span className={`text-[9px] font-display px-1.5 py-0.5 rounded uppercase tracking-wider ${difficultyStyles[quest.difficulty]}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quest.estimatedMinutes}m
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      <Zap className="w-3 h-3" />
                      +{quest.xpReward}
                    </span>
                  </div>
                </div>

                {/* Start Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    size="icon"
                    className="w-10 h-10 rounded btn-game"
                    onClick={() => onStartQuest(quest)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredQuests.length === 0 && (
        <motion.div
          className="text-center py-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-display tracking-wider">No quests available in this category</p>
        </motion.div>
      )}
    </motion.div>
  );
}
