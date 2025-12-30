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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0F' }}>
        <motion.div 
          className="text-cyan-neon"
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
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden" style={{ backgroundColor: '#0A0A0F' }}>
      {/* Subtle cyan ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px]"
          style={{ backgroundColor: 'rgba(0, 217, 255, 0.05)' }}
        />
      </div>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <motion.h1 
          className="font-display text-2xl font-bold text-glow"
          style={{ color: '#00D9FF' }}
        >
          SoloRank
        </motion.h1>
        <div className="flex items-center gap-2">
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ 
              backgroundColor: 'rgba(102, 77, 0, 0.2)',
              borderColor: 'rgba(102, 77, 0, 0.5)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Coins className="w-4 h-4" style={{ color: '#A8860B' }} />
            <motion.span 
              key={profile.gold}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="font-display text-sm font-bold"
              style={{ color: '#A8860B' }}
            >
              {profile.gold.toLocaleString()}
            </motion.span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-gray-dark hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* XP Ring */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100, damping: 15 }}
        className="flex justify-center mb-6 relative z-10"
      >
        <motion.div
          className="relative"
          animate={{ 
            filter: ['drop-shadow(0 0 15px rgba(0, 217, 255, 0.2))', 'drop-shadow(0 0 30px rgba(0, 217, 255, 0.4))', 'drop-shadow(0 0 15px rgba(0, 217, 255, 0.2))']
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
        className="grid grid-cols-3 gap-3 mb-6 relative z-10"
      >
        {[
          { icon: Flame, value: profile.current_streak, label: 'Streak', color: '#FF6B35' },
          { icon: null, value: questsCompletedToday, label: 'Today', color: '#00D9FF' },
          { icon: RefreshCw, value: profile.restores_remaining, label: 'Restores', color: '#AAAAAA' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={cardVariants}
            className="p-3 text-center rounded-xl border transition-all duration-300 hover:scale-[1.02]"
            style={{ 
              backgroundColor: '#0A0A0F',
              borderColor: 'rgba(0, 217, 255, 0.15)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            whileHover={{ 
              borderColor: 'rgba(0, 217, 255, 0.3)',
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-center gap-1" style={{ color: stat.color }}>
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
            <span className="text-xs" style={{ color: '#666666' }}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Quest or Start Quest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >
        <AnimatePresence mode="wait">
          {activeQuest ? (
            <motion.div 
              key="active-quest"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-5 rounded-xl border relative overflow-hidden"
              style={{ 
                backgroundColor: '#0A0A0F',
                borderColor: 'rgba(0, 217, 255, 0.3)',
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                animate={{
                  boxShadow: activeQuest.remainingSeconds < 0 
                    ? ['inset 0 0 20px rgba(139, 69, 69, 0.2)', 'inset 0 0 40px rgba(139, 69, 69, 0.3)', 'inset 0 0 20px rgba(139, 69, 69, 0.2)']
                    : ['inset 0 0 20px rgba(0, 217, 255, 0.1)', 'inset 0 0 30px rgba(0, 217, 255, 0.2)', 'inset 0 0 20px rgba(0, 217, 255, 0.1)']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm" style={{ color: '#AAAAAA' }}>Active Quest</span>
                <motion.span 
                  className={`badge-${activeQuest.category} text-xs px-2 py-1 rounded-full`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {activeQuest.category}
                </motion.span>
              </div>
              <h3 className="font-semibold text-lg mb-4" style={{ color: '#FFFFFF' }}>{activeQuest.name}</h3>
              
              <motion.div 
                className="timer-display text-center mb-4"
                style={{ color: activeQuest.remainingSeconds < 0 ? '#8B4545' : '#00D9FF' }}
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
                    variant="cyan"
                    className="w-full"
                  >
                    COMPLETE
                  </Button>
                </motion.div>
              </div>

              {activeQuest.remainingSeconds < 0 && (
                <motion.p 
                  className="text-xs mt-3 flex items-center gap-1"
                  style={{ color: '#8B4545' }}
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
                  className="p-6 text-center rounded-xl border transition-all duration-300 group cursor-pointer"
                  style={{ 
                    backgroundColor: '#0A0A0F',
                    borderColor: 'rgba(0, 217, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  whileHover={{ 
                    y: -4, 
                    borderColor: 'rgba(0, 217, 255, 0.4)',
                    boxShadow: '0 0 40px rgba(0, 217, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
                    animate={{ 
                      boxShadow: ['0 0 20px rgba(0, 217, 255, 0.2)', '0 0 40px rgba(0, 217, 255, 0.4)', '0 0 20px rgba(0, 217, 255, 0.2)']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Play className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: '#00D9FF' }} />
                  </motion.div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#FFFFFF' }}>START A QUEST</h3>
                  <p className="text-sm" style={{ color: '#AAAAAA' }}>Choose a quest to begin your journey</p>
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
            className="mt-4 p-3 rounded-lg flex items-center gap-2 relative z-10"
            style={{ 
              backgroundColor: 'rgba(139, 69, 69, 0.15)',
              border: '1px solid rgba(139, 69, 69, 0.3)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertTriangle className="w-4 h-4" style={{ color: '#8B4545' }} />
            </motion.div>
            <span className="text-sm" style={{ color: '#8B4545' }}>
              XP penalty applied ({profile.missed_days} day missed)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}