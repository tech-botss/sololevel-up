import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Swords, 
  User, 
  Trophy, 
  Users, 
  ShoppingBag, 
  Award,
  Flame 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/quests', icon: Swords, label: 'Quests' },
  { path: '/streaks', icon: Flame, label: 'Streaks' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/leaderboards', icon: Trophy, label: 'Ranks' },
  { path: '/friends', icon: Users, label: 'Friends' },
  { path: '/store', icon: ShoppingBag, label: 'Store' },
  { path: '/achievements', icon: Award, label: 'Awards' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="max-w-md mx-auto bg-dark-ultra/95 border-t border-primary/20 backdrop-blur-xl"
      >
        <div className="flex items-center justify-around px-1 py-2 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-item relative flex-1',
                  isActive ? 'active' : 'text-gray-dark'
                )}
              >
                {/* Cyan bottom indicator for active tab */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-cyan-neon rounded-full shadow-cyan"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? { y: [0, -2, 0] } : {}}
                  transition={isActive ? { duration: 0.3 } : {}}
                >
                  <Icon 
                    className={cn(
                      'nav-icon w-5 h-5 transition-all duration-200',
                      isActive ? 'text-cyan-neon' : 'text-gray-dark'
                    )} 
                    style={isActive ? { filter: 'drop-shadow(0 0 8px #00D9FF)' } : {}}
                  />
                </motion.div>
                <motion.span 
                  className={cn(
                    'text-[10px] font-medium mt-0.5',
                    isActive ? 'text-cyan-neon' : 'text-gray-dark'
                  )}
                  animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}