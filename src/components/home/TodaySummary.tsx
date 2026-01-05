import { motion } from 'framer-motion';
import { CheckCircle, Zap, Flame } from 'lucide-react';

interface TodaySummaryProps {
  questsCompleted: number;
  totalDailyQuests: number;
  xpEarned: number;
  streak: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
  }
};

export function TodaySummary({ questsCompleted, xpEarned, streak }: TodaySummaryProps) {
  return (
    <motion.div
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Header */}
      <motion.div 
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" 
          style={{ boxShadow: '0 0 10px hsl(190 100% 50% / 0.2)' }} />
        <span className="text-xs font-display text-primary/80 tracking-[0.25em] uppercase text-glow">Today</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          style={{ boxShadow: '0 0 10px hsl(190 100% 50% / 0.2)' }} />
      </motion.div>

      <motion.div 
        className="grid grid-cols-3 gap-3"
        variants={containerVariants}
      >
        {/* Quests Completed */}
        <motion.div 
          className="card-game p-4 text-center relative overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -3 }}
        >
          <motion.div
            className="mb-3 flex justify-center"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <CheckCircle className="w-6 h-6 text-accent" style={{ filter: 'drop-shadow(0 0 10px hsl(155 100% 50%))' }} />
          </motion.div>
          <motion.p 
            className="font-display text-2xl font-bold text-foreground"
            animate={{ textShadow: ['0 0 10px hsl(155 100% 50% / 0.3)', '0 0 20px hsl(155 100% 50% / 0.5)', '0 0 10px hsl(155 100% 50% / 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {questsCompleted}
          </motion.p>
          <p className="text-[10px] text-muted-foreground font-display tracking-[0.15em] uppercase mt-1">Quests</p>
          
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
        </motion.div>

        {/* XP Earned */}
        <motion.div 
          className="card-game p-4 text-center relative overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -3 }}
        >
          <motion.div
            className="mb-3 flex justify-center"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-6 h-6 text-primary" style={{ filter: 'drop-shadow(0 0 10px hsl(190 100% 50%))' }} />
          </motion.div>
          <motion.p 
            className="font-display text-2xl font-bold text-primary"
            animate={{ textShadow: ['0 0 10px hsl(190 100% 50% / 0.3)', '0 0 20px hsl(190 100% 50% / 0.6)', '0 0 10px hsl(190 100% 50% / 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {xpEarned}
          </motion.p>
          <p className="text-[10px] text-muted-foreground font-display tracking-[0.15em] uppercase mt-1">XP</p>
          
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        </motion.div>

        {/* Streak */}
        <motion.div 
          className="card-game p-4 text-center relative overflow-hidden"
          variants={cardVariants}
          whileHover={{ scale: 1.05, y: -3 }}
        >
          <motion.div
            className="mb-3 flex justify-center"
            animate={{ 
              y: [0, -4, 0],
              rotate: [0, 8, -8, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Flame className="w-6 h-6 text-destructive" style={{ filter: 'drop-shadow(0 0 10px hsl(0 85% 55%))' }} />
          </motion.div>
          <motion.p 
            className="font-display text-2xl font-bold text-destructive"
            animate={{ textShadow: ['0 0 10px hsl(0 85% 55% / 0.3)', '0 0 20px hsl(0 85% 55% / 0.5)', '0 0 10px hsl(0 85% 55% / 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {streak}
          </motion.p>
          <p className="text-[10px] text-muted-foreground font-display tracking-[0.15em] uppercase mt-1">Streak</p>
          
          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-destructive/5 to-transparent pointer-events-none" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
