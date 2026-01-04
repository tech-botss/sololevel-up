import { motion } from 'framer-motion';
import { Flame, Coins, Trophy, Zap } from 'lucide-react';

interface HeroSectionProps {
  username: string;
  level: number;
  currentXp: number;
  xpToNext: number;
  currentStreak: number;
  gold: number;
  achievementsCount: number;
  avatarUrl?: string;
}

export function HeroSection({
  username,
  level,
  currentXp,
  xpToNext,
  currentStreak,
  gold,
  achievementsCount,
}: HeroSectionProps) {
  const xpProgress = Math.min((currentXp / xpToNext) * 100, 100);

  return (
    <motion.div 
      className="status-window mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.h2 
          className="font-display text-xl font-bold text-primary tracking-[0.2em] uppercase mb-2"
          animate={{ 
            textShadow: [
              '0 0 10px hsl(189 100% 50% / 0.5)',
              '0 0 25px hsl(189 100% 50% / 0.8)',
              '0 0 10px hsl(189 100% 50% / 0.5)',
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          STATUS
        </motion.h2>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="font-display tracking-wider">RANK: <span className="text-accent">HUNTER</span></span>
          <span className="font-display tracking-wider">TITLE: <span className="text-primary">{username}</span></span>
        </div>
      </motion.div>

      {/* Level Display */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-muted-foreground mb-2 font-display tracking-wider uppercase">Level</p>
        <motion.div
          className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary/50 rounded bg-primary/10"
          animate={{
            boxShadow: [
              '0 0 15px hsl(189 100% 50% / 0.2)',
              '0 0 30px hsl(189 100% 50% / 0.4)',
              '0 0 15px hsl(189 100% 50% / 0.2)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-display text-4xl font-bold text-primary text-glow">{level}</span>
        </motion.div>
      </motion.div>

      {/* XP Progress */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-display tracking-wider text-muted-foreground">XP</span>
          </div>
          <span className="text-sm font-display text-primary">
            {currentXp.toLocaleString()} / {xpToNext.toLocaleString()}
          </span>
        </div>
        <div className="progress-xp">
          <motion.div
            className="progress-xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Streak */}
        <div className="flex items-center gap-3 p-3 rounded border border-border bg-muted/30">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="w-5 h-5 text-destructive" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground font-display tracking-wider uppercase">Streak</p>
            <p className="text-lg font-display font-bold text-foreground">{currentStreak}</p>
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-3 p-3 rounded border border-border bg-muted/30">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Coins className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground font-display tracking-wider uppercase">Gold</p>
            <p className="text-lg font-display font-bold text-accent">{gold.toLocaleString()}</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="col-span-2 flex items-center gap-3 p-3 rounded border border-border bg-muted/30">
          <Trophy className="w-5 h-5 text-secondary" />
          <div>
            <p className="text-xs text-muted-foreground font-display tracking-wider uppercase">Quests Completed</p>
            <p className="text-lg font-display font-bold text-secondary">{achievementsCount}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
