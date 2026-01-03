import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, Flame } from 'lucide-react';

interface TodaySummaryProps {
  questsCompleted: number;
  totalDailyQuests: number;
  xpEarned: number;
  streak: number;
}

export function TodaySummary({
  questsCompleted,
  totalDailyQuests,
  xpEarned,
  streak,
}: TodaySummaryProps) {
  const questProgress = (questsCompleted / totalDailyQuests) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mb-6"
    >
      <h3 className="font-display text-lg text-foreground mb-3">Today's Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Daily Quests Card */}
        <motion.div
          className="p-4 rounded-xl bg-potblack-surface border border-potblack-elevated"
          whileHover={{ borderColor: 'rgba(53, 212, 117, 0.5)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-emerald" />
            <span className="text-xs text-gray-light">Daily Quests</span>
          </div>
          <p className="font-display text-xl text-emerald">
            {questsCompleted} <span className="text-sm text-gray-light">of {totalDailyQuests}</span>
          </p>
          <div className="mt-2 h-1.5 bg-potblack-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${questProgress}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* XP Earned Card */}
        <motion.div
          className="p-4 rounded-xl bg-potblack-surface border border-potblack-elevated relative overflow-hidden"
          whileHover={{ borderColor: 'rgba(255, 215, 0, 0.5)' }}
        >
          <motion.div
            className="absolute top-2 right-2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-gold/50" />
          </motion.div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-xs text-gray-light">XP Earned</span>
          </div>
          <motion.p
            className="font-display text-xl text-gold"
            animate={{ textShadow: ['0 0 10px rgba(255, 215, 0, 0.3)', '0 0 20px rgba(255, 215, 0, 0.5)', '0 0 10px rgba(255, 215, 0, 0.3)'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {xpEarned.toLocaleString()}
          </motion.p>
          <p className="text-xs text-gray-light mt-1">This Session</p>
        </motion.div>

        {/* Login Streak Card */}
        <motion.div
          className="p-4 rounded-xl bg-potblack-surface border border-potblack-elevated col-span-2 md:col-span-1"
          whileHover={{ borderColor: 'rgba(255, 99, 71, 0.5)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Flame className="w-5 h-5 text-tomato" />
            </motion.div>
            <span className="text-xs text-gray-light">Login Streak</span>
          </div>
          <motion.p
            className="font-display text-xl text-tomato"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          >
            {streak}
          </motion.p>
          <p className="text-xs text-gray-light mt-1">Days in a Row</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
