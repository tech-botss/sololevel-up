import { motion } from 'framer-motion';
import { Trophy, User, Package, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: Trophy, label: 'Achievements', path: '/achievements', color: 'text-accent', glowColor: 'hsl(155 100% 50%)' },
  { icon: User, label: 'Profile', path: '/profile', color: 'text-primary', glowColor: 'hsl(190 100% 50%)' },
  { icon: Package, label: 'Store', path: '/store', color: 'text-secondary', glowColor: 'hsl(270 80% 50%)' },
  { icon: Calendar, label: 'Streaks', path: '/streaks', color: 'text-destructive', glowColor: 'hsl(0 85% 55%)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
  }
};

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="grid grid-cols-4 gap-3 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {actions.map((action) => (
        <motion.button
          key={action.label}
          onClick={() => navigate(action.path)}
          className="card-game p-4 flex flex-col items-center gap-3 group relative overflow-hidden"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.08, 
            y: -4,
            transition: { type: 'spring', stiffness: 400 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${action.glowColor}15 0%, transparent 70%)`
            }}
          />

          {/* Icon with glow */}
          <motion.div
            className={`${action.color} relative z-10`}
            whileHover={{ 
              scale: 1.25,
              filter: `drop-shadow(0 0 12px ${action.glowColor})`
            }}
          >
            <action.icon className="w-7 h-7" />
          </motion.div>

          {/* Label */}
          <span className="text-[11px] font-display text-muted-foreground group-hover:text-foreground transition-colors tracking-[0.12em] uppercase relative z-10">
            {action.label}
          </span>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-1/4 right-1/4 h-[2px] opacity-0 group-hover:opacity-100"
            style={{ background: `linear-gradient(90deg, transparent, ${action.glowColor}, transparent)` }}
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
