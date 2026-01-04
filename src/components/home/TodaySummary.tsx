import { motion } from 'framer-motion';
import { CheckCircle, Zap, Flame } from 'lucide-react';

interface TodaySummaryProps {
  questsCompleted: number;
  totalDailyQuests: number;
  xpEarned: number;
  streak: number;
}

export function TodaySummary({ questsCompleted, xpEarned, streak }: TodaySummaryProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs font-display text-muted-foreground tracking-[0.2em] uppercase">Today</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Quests Completed */}
        <motion.div 
          className="card-game p-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="mb-2 flex justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle className="w-5 h-5 text-accent" />
          </motion.div>
          <p className="font-display text-lg font-bold text-foreground">{questsCompleted}</p>
          <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">Quests</p>
        </motion.div>

        {/* XP Earned */}
        <motion.div 
          className="card-game p-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="mb-2 flex justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-5 h-5 text-primary" />
          </motion.div>
          <p className="font-display text-lg font-bold text-primary">{xpEarned}</p>
          <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">XP</p>
        </motion.div>

        {/* Streak */}
        <motion.div 
          className="card-game p-3 text-center"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="mb-2 flex justify-center"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Flame className="w-5 h-5 text-destructive" />
          </motion.div>
          <p className="font-display text-lg font-bold text-destructive">{streak}</p>
          <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase">Streak</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
