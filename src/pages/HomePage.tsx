import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { XPRing } from '@/components/XPRing';
import { Flame, Coins, AlertTriangle, RefreshCw, Play, Pause, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { calculateXpForLevel } from '@/types/game';
import { FloatingParticles } from '@/components/animations';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

export default function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { profile, activeQuest, questsCompletedToday, fetchProfile, updateQuestTimer, completeQuest, pauseQuest, resumeQuest } = useGameStore();
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Timer logic
  useEffect(() => {
    if (!activeQuest || activeQuest.isPaused) return;
    
    const interval = setInterval(() => {
      updateQuestTimer(activeQuest.remainingSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuest, updateQuestTimer]);

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const sign = seconds < 0 ? '+' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    const result = await completeQuest();
    if (result.leveledUp) {
      setShowLevelUp(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Sparkles className="w-8 h-8 animate-spin-slow" />
        </motion.div>
      </div>
    );
  }

  const xpToNext = calculateXpForLevel(profile.level + 1);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Subtle floating particles */}
      <FloatingParticles count={15} color="primary" size="sm" speed="slow" className="opacity-30" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <motion.h1 
          className="font-display text-2xl font-bold"
          style={{ 
            backgroundImage: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SoloRank
        </motion.h1>
        <div className="flex items-center gap-2">
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coins className="w-4 h-4 text-accent" />
            <motion.span 
              key={profile.gold}
              initial={{ scale: 1.2, color: 'hsl(var(--accent))' }}
              animate={{ scale: 1 }}
              className="font-display text-sm font-bold text-accent"
            >
              {profile.gold.toLocaleString()}
            </motion.span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* XP Ring with enhanced animation */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <motion.div
          animate={{ 
            filter: ['drop-shadow(0 0 20px hsl(var(--primary) / 0.3))', 'drop-shadow(0 0 40px hsl(var(--primary) / 0.5))', 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))']
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <XPRing currentXp={profile.current_xp} xpToNext={xpToNext} level={profile.level} />
        </motion.div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: Flame, value: profile.current_streak, label: 'Streak', color: 'text-orange-400' },
          { icon: null, value: questsCompletedToday, label: 'Today', color: 'text-primary' },
          { icon: RefreshCw, value: profile.restores_remaining, label: 'Restores', color: 'text-foreground' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={cardVariants}
            className="card-game p-3 text-center group"
            whileHover={{ y: -2, boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)' }}
          >
            <div className={`flex items-center justify-center gap-1 ${stat.color}`}>
              {stat.icon && <stat.icon className="w-4 h-4" />}
              <motion.span 
                key={stat.value}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="font-display text-lg font-bold"
              >
                {stat.value}
              </motion.span>
            </div>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Quest or Start Quest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {activeQuest ? (
            <motion.div 
              key="active-quest"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-game-glow p-5 relative overflow-hidden"
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                animate={{
                  boxShadow: activeQuest.remainingSeconds < 0 
                    ? ['0 0 20px hsl(var(--destructive) / 0.3)', '0 0 40px hsl(var(--destructive) / 0.5)', '0 0 20px hsl(var(--destructive) / 0.3)']
                    : ['0 0 20px hsl(var(--primary) / 0.2)', '0 0 30px hsl(var(--primary) / 0.4)', '0 0 20px hsl(var(--primary) / 0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Active Quest</span>
                <motion.span 
                  className={`badge-${activeQuest.category} text-xs px-2 py-1 rounded-full`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {activeQuest.category}
                </motion.span>
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-4">{activeQuest.name}</h3>
              
              <motion.div 
                className={`timer-display text-center mb-4 ${activeQuest.remainingSeconds < 0 ? 'text-destructive' : ''}`}
                animate={activeQuest.remainingSeconds < 60 && activeQuest.remainingSeconds > 0 ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(activeQuest.remainingSeconds)}
              </motion.div>

              <div className="flex gap-3">
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="outline"
                    onClick={activeQuest.isPaused ? resumeQuest : pauseQuest}
                    className="w-full"
                  >
                    {activeQuest.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {activeQuest.isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </motion.div>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleComplete}
                    disabled={activeQuest.remainingSeconds > 0}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Complete
                  </Button>
                </motion.div>
              </div>

              {activeQuest.remainingSeconds < 0 && (
                <motion.p 
                  className="text-xs text-destructive mt-3 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="w-3 h-3" />
                  Late penalty applies: {Math.abs(activeQuest.remainingSeconds) >= 600 ? '75%' : '50%'} XP reduction
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="start-quest"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Link to="/quests">
                <motion.div 
                  className="card-game p-6 text-center hover:border-primary/50 transition-colors group"
                  whileHover={{ 
                    y: -4, 
                    boxShadow: '0 20px 40px -20px hsl(var(--primary) / 0.4)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{ 
                      boxShadow: ['0 0 20px hsl(var(--primary) / 0.3)', '0 0 40px hsl(var(--primary) / 0.5)', '0 0 20px hsl(var(--primary) / 0.3)']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Play className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Start a Quest</h3>
                  <p className="text-sm text-muted-foreground">Choose a quest to begin your journey</p>
                </motion.div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Penalty Warning */}
      <AnimatePresence>
        {profile.missed_days > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 rounded-lg bg-destructive/20 border border-destructive/50 flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </motion.div>
            <span className="text-sm text-destructive">
              XP penalty applied ({profile.missed_days} day missed)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
