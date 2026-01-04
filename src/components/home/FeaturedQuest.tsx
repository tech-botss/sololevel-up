import { motion } from 'framer-motion';
import { Clock, Zap, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quest } from '@/types/game';

interface FeaturedQuestProps {
  quest: Quest;
  onStartQuest: (quest: Quest) => void;
}

const difficultyStyles = {
  easy: 'badge-difficulty-easy',
  medium: 'badge-difficulty-medium',
  hard: 'badge-difficulty-hard',
};

export function FeaturedQuest({ quest, onStartQuest }: FeaturedQuestProps) {
  return (
    <motion.div
      className="card-game-glow mb-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3 }}
    >
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
      >
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          animate={{ y: [0, 200, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            className="flex items-center gap-2"
            animate={{ 
              textShadow: [
                '0 0 5px hsl(189 100% 50% / 0.3)',
                '0 0 15px hsl(189 100% 50% / 0.5)',
                '0 0 5px hsl(189 100% 50% / 0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-display text-primary tracking-[0.15em] uppercase">Featured Quest</span>
          </motion.div>
          <span className={`text-[10px] font-display px-2 py-1 rounded uppercase tracking-wider ${difficultyStyles[quest.difficulty]}`}>
            {quest.difficulty}
          </span>
        </div>

        {/* Quest Info */}
        <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-wide">{quest.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{quest.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-display text-muted-foreground">{quest.estimatedMinutes}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-display text-primary">+{quest.xpReward} XP</span>
          </div>
        </div>

        {/* Start Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => onStartQuest(quest)}
            className="w-full btn-primary font-display tracking-wider"
          >
            <Play className="w-4 h-4 mr-2" />
            START QUEST
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
