import { motion } from 'framer-motion';
import { Flame, Coins, Trophy, Zap, Shield } from 'lucide-react';

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
      className="status-window mb-6 relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* HUD Corner Decorations */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none rounded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          animate={{ y: ['-100%', '500%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <motion.h2 
          className="font-display text-2xl font-bold tracking-[0.25em] uppercase mb-3 text-glow-strong"
          style={{ color: 'hsl(190 100% 80%)' }}
          animate={{ 
            textShadow: [
              '0 0 10px hsl(190 100% 50% / 0.6), 0 0 30px hsl(190 100% 50% / 0.4)',
              '0 0 20px hsl(190 100% 50% / 0.9), 0 0 50px hsl(190 100% 50% / 0.6)',
              '0 0 10px hsl(190 100% 50% / 0.6), 0 0 30px hsl(190 100% 50% / 0.4)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          STATUS
        </motion.h2>
        <div className="flex items-center justify-center gap-8 text-sm">
          <span className="font-display tracking-[0.15em] text-muted-foreground">
            RANK: <span className="text-accent text-glow-accent font-bold">HUNTER</span>
          </span>
          <span className="font-display tracking-[0.15em] text-muted-foreground">
            TITLE: <span className="text-primary text-glow font-bold">{username}</span>
          </span>
        </div>
      </motion.div>

      {/* Level Display - 3D Badge */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
      >
        <p className="text-sm text-muted-foreground mb-3 font-display tracking-[0.2em] uppercase">Level</p>
        <motion.div
          className="inline-flex items-center justify-center px-10 py-4 rounded bg-gradient-to-b from-primary/20 to-primary/5 relative overflow-hidden"
          style={{ 
            border: '2px solid hsl(190 100% 50% / 0.6)',
            boxShadow: '0 0 30px hsl(190 100% 50% / 0.3), inset 0 0 30px hsl(190 100% 50% / 0.1)'
          }}
          animate={{
            boxShadow: [
              '0 0 30px hsl(190 100% 50% / 0.3), inset 0 0 30px hsl(190 100% 50% / 0.1)',
              '0 0 50px hsl(190 100% 50% / 0.5), inset 0 0 40px hsl(190 100% 50% / 0.15)',
              '0 0 30px hsl(190 100% 50% / 0.3), inset 0 0 30px hsl(190 100% 50% / 0.1)',
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-transparent pointer-events-none" />
          <span className="font-display text-5xl font-bold text-primary text-glow-strong relative z-10">{level}</span>
        </motion.div>
      </motion.div>

      {/* XP Progress - Glowing Bar */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(190 100% 50%))' }} />
            </motion.div>
            <span className="text-sm font-display tracking-[0.15em] text-muted-foreground uppercase">Experience</span>
          </div>
          <span className="text-sm font-display text-primary font-bold tracking-wider">
            {currentXp.toLocaleString()} / {xpToNext.toLocaleString()}
          </span>
        </div>
        <div className="progress-xp">
          <motion.div
            className="progress-xp-fill"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </motion.div>

      {/* Stats Grid - 3D Cards */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        {/* Streak Card */}
        <motion.div 
          className="flex items-center gap-4 p-4 rounded card-game"
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 8, -8, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Flame className="w-6 h-6 text-destructive" style={{ filter: 'drop-shadow(0 0 10px hsl(0 85% 55%))' }} />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground font-display tracking-[0.15em] uppercase">Streak</p>
            <p className="text-2xl font-display font-bold text-foreground">{currentStreak}</p>
          </div>
        </motion.div>

        {/* Gold Card */}
        <motion.div 
          className="flex items-center gap-4 p-4 rounded card-game"
          whileHover={{ scale: 1.03, y: -2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Coins className="w-6 h-6 text-accent" style={{ filter: 'drop-shadow(0 0 10px hsl(155 100% 50%))' }} />
          </motion.div>
          <div>
            <p className="text-xs text-muted-foreground font-display tracking-[0.15em] uppercase">Gold</p>
            <p className="text-2xl font-display font-bold text-accent">{gold.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Quests Card - Full Width */}
        <motion.div 
          className="col-span-2 flex items-center gap-4 p-4 rounded card-game"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Trophy className="w-6 h-6 text-secondary" style={{ filter: 'drop-shadow(0 0 10px hsl(270 80% 50%))' }} />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-display tracking-[0.15em] uppercase">Quests Completed</p>
            <p className="text-2xl font-display font-bold text-secondary">{achievementsCount}</p>
          </div>
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/10 border border-secondary/30"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-4 h-4 text-secondary" />
            <span className="text-xs font-display text-secondary tracking-wider">ACTIVE</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
