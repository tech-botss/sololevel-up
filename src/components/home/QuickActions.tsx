import { motion } from 'framer-motion';
import { Trophy, User, Package, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: Trophy, label: 'Achievements', path: '/achievements', color: 'text-accent' },
  { icon: User, label: 'Profile', path: '/profile', color: 'text-primary' },
  { icon: Package, label: 'Store', path: '/store', color: 'text-secondary' },
  { icon: Calendar, label: 'Streaks', path: '/streaks', color: 'text-destructive' },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="grid grid-cols-4 gap-2 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          onClick={() => navigate(action.path)}
          className="card-game p-3 flex flex-col items-center gap-2 group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`${action.color}`}
            whileHover={{ scale: 1.2 }}
          >
            <action.icon className="w-6 h-6" />
          </motion.div>
          <span className="text-[10px] font-display text-muted-foreground group-hover:text-foreground transition-colors tracking-wider uppercase">
            {action.label}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
