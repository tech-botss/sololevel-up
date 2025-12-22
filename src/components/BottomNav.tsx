import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Swords, 
  User, 
  Trophy, 
  Users, 
  ShoppingBag, 
  Award 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/quests', icon: Swords, label: 'Quests' },
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
      <div className="max-w-md mx-auto glass border-t border-border/50 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-item relative flex-1',
                  isActive ? 'active' : 'text-muted-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon 
                  className={cn(
                    'nav-icon w-5 h-5 transition-all duration-200',
                    isActive && 'text-primary scale-110'
                  )} 
                />
                <span className={cn(
                  'text-[10px] font-medium mt-0.5',
                  isActive && 'text-primary'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
