import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Flame, Coins, Trophy } from 'lucide-react';

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
  avatarUrl,
}: HeroSectionProps) {
  const navigate = useNavigate();
  const xpProgress = (currentXp / xpToNext) * 100;
  const tierNumber = Math.floor(level / 10) + 1;
  const tierName = getTierName(tierNumber);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      {/* Character Portrait */}
      <motion.div
        className="relative mx-auto md:mx-0 cursor-pointer"
        onClick={() => navigate('/profile')}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-[140px] h-[160px] md:w-[180px] md:h-[200px] rounded-xl border-[3px] border-emerald overflow-hidden"
          animate={{
            boxShadow: [
              '0 0 20px rgba(53, 212, 117, 0.3)',
              '0 0 30px rgba(53, 212, 117, 0.5)',
              '0 0 20px rgba(53, 212, 117, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-potblack-surface flex items-center justify-center">
              <span className="text-4xl font-display text-emerald">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Player Stats */}
      <div className="flex-1 space-y-3">
        {/* Name + Level Badge */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <h2 className="font-display text-xl text-foreground">{username}</h2>
          <motion.div
            className="flex items-center justify-center w-12 h-8 rounded-full bg-gold/20 border border-gold"
            animate={{ boxShadow: ['0 0 8px rgba(255, 215, 0, 0.3)', '0 0 16px rgba(255, 215, 0, 0.5)', '0 0 8px rgba(255, 215, 0, 0.3)'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="font-display text-sm text-gold">Lv.{level}</span>
          </motion.div>
        </div>

        {/* Current Tier */}
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-light">
            Tier {tierNumber} - {tierName}
          </p>
          <div className="mt-1 h-2 bg-potblack-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(level % 10) * 10}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* XP Progress */}
        <div className="text-center md:text-left">
          <p className="text-xs text-gray-light mb-1">Session XP</p>
          <div className="h-2 bg-potblack-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-gray-light mt-1">
            {currentXp.toLocaleString()} / {xpToNext.toLocaleString()} XP
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <motion.div
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-potblack-surface border border-potblack-elevated"
            whileHover={{ borderColor: 'rgba(255, 99, 71, 0.5)' }}
          >
            <Flame className="w-4 h-4 text-tomato" />
            <span className="text-xs font-medium text-gold">{currentStreak}-Day</span>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-potblack-surface border border-potblack-elevated"
            whileHover={{ borderColor: 'rgba(53, 212, 117, 0.5)' }}
          >
            <Coins className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-emerald">{gold.toLocaleString()}</span>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-potblack-surface border border-potblack-elevated"
            whileHover={{ borderColor: 'rgba(129, 39, 185, 0.5)' }}
          >
            <Trophy className="w-4 h-4 text-purple" />
            <span className="text-xs font-medium text-purple">{achievementsCount}</span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function getTierName(tier: number): string {
  const tierNames: Record<number, string> = {
    1: "Initiate's Path",
    2: "Rising Hunter",
    3: "Proven Warrior",
    4: "Elite Striker",
    5: "Warrior's Ascension",
    6: "Shadow Blade",
    7: "Legendary Hunter",
    8: "Mythic Champion",
    9: "Transcendent",
    10: "Monarch",
  };
  return tierNames[Math.min(tier, 10)] || "Unknown";
}
