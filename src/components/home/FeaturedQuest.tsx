import { motion } from 'framer-motion';
import { Clock, Zap, Star, Play, Sparkles } from 'lucide-react';
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
      className="card-game-glow mb-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
    >
      {/* HUD Corners */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Animated scan line */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
      >
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{ y: [0, 250, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ boxShadow: '0 0 15px hsl(190 100% 50% / 0.5)' }}
        />
      </motion.div>

      {/* Particle effects */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <motion.div 
            className="flex items-center gap-3"
            animate={{ 
              textShadow: [
                '0 0 8px hsl(190 100% 50% / 0.4)',
                '0 0 20px hsl(190 100% 50% / 0.7)',
                '0 0 8px hsl(190 100% 50% / 0.4)',
              ]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Star className="w-5 h-5 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(190 100% 50%))' }} />
            </motion.div>
            <span className="text-sm font-display text-primary tracking-[0.2em] uppercase font-bold">Featured Quest</span>
          </motion.div>
          <motion.span 
            className={`text-[11px] font-display px-3 py-1.5 rounded uppercase tracking-wider ${difficultyStyles[quest.difficulty]}`}
            whileHover={{ scale: 1.05 }}
          >
            {quest.difficulty}
          </motion.span>
        </div>

        {/* Quest Info */}
        <motion.h3 
          className="font-display text-xl font-bold text-foreground mb-3 tracking-wide"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {quest.name}
        </motion.h3>
        <motion.p 
          className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {quest.description}
        </motion.p>

        {/* Stats Row */}
        <motion.div 
          className="flex items-center gap-6 mb-5 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-display text-muted-foreground">{quest.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-primary" style={{ filter: 'drop-shadow(0 0 6px hsl(190 100% 50%))' }} />
            </motion.div>
            <span className="font-display text-primary font-bold">+{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" style={{ filter: 'drop-shadow(0 0 6px hsl(155 100% 50%))' }} />
            <span className="font-display text-accent font-bold">+{quest.goldReward} Gold</span>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => onStartQuest(quest)}
            className="w-full btn-primary font-display tracking-[0.15em] text-base py-6 relative overflow-hidden group"
          >
            {/* Button glow effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(190 100% 70% / 0.2), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Play className="w-5 h-5 mr-2" />
            START QUEST
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
