import { motion } from 'framer-motion';
import { Trophy, User, Backpack, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: Trophy, label: 'Achievements', path: '/achievements', emoji: '🏆' },
  { icon: User, label: 'My Profile', path: '/profile', emoji: '👤' },
  { icon: Backpack, label: 'Inventory', path: '/store', emoji: '🎒' },
  { icon: Settings, label: 'Settings', path: '/streaks', emoji: '⚙️' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mb-6"
    >
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            onClick={() => navigate(action.path)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="flex-shrink-0 w-[100px] h-[80px] md:w-[140px] md:h-[100px] flex flex-col items-center justify-center gap-2 rounded-xl bg-potblack-surface border-2 border-potblack-elevated transition-all duration-300 hover:border-emerald hover:shadow-[0_0_20px_rgba(53,212,117,0.2)]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl md:text-3xl">{action.emoji}</span>
            <span className="text-xs text-gray-light font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
