import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { XPRing } from '@/components/XPRing';
import { Flame, Coins, AlertTriangle, RefreshCw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { user, activeQuest, questsCompletedToday, updateQuestTimer, completeQuest, pauseQuest, resumeQuest } = useGameStore();
  const [showLevelUp, setShowLevelUp] = useState(false);

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

  const handleComplete = () => {
    const result = completeQuest();
    if (result.leveledUp) {
      setShowLevelUp(true);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="font-display text-2xl font-bold gradient-text">SoloRank</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/50">
          <Coins className="w-4 h-4 text-accent" />
          <span className="font-display text-sm font-bold text-accent">{user.gold.toLocaleString()}</span>
        </div>
      </motion.div>

      {/* XP Ring */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        <XPRing currentXp={user.currentXp} xpToNext={user.xpToNextLevel} level={user.level} />
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="card-game p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="font-display text-lg font-bold">{user.currentStreak}</span>
          </div>
          <span className="text-xs text-muted-foreground">Streak</span>
        </div>
        <div className="card-game p-3 text-center">
          <span className="font-display text-lg font-bold text-primary">{questsCompletedToday}</span>
          <span className="text-xs text-muted-foreground block">Today</span>
        </div>
        <div className="card-game p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 text-muted-foreground" />
            <span className="font-display text-lg font-bold text-foreground">{user.restoresRemaining}</span>
          </div>
          <span className="text-xs text-muted-foreground">Restores</span>
        </div>
      </motion.div>

      {/* Active Quest or Start Quest */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {activeQuest ? (
          <div className="card-game-glow p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Active Quest</span>
              <span className={`badge-${activeQuest.category} text-xs px-2 py-1 rounded-full`}>
                {activeQuest.category}
              </span>
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-4">{activeQuest.name}</h3>
            
            <div className={`timer-display text-center mb-4 ${activeQuest.remainingSeconds < 0 ? 'text-destructive' : ''}`}>
              {formatTime(activeQuest.remainingSeconds)}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={activeQuest.isPaused ? resumeQuest : pauseQuest}
                className="flex-1"
              >
                {activeQuest.isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {activeQuest.isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={handleComplete}
                disabled={activeQuest.remainingSeconds > 0}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Complete
              </Button>
            </div>

            {activeQuest.remainingSeconds < 0 && (
              <p className="text-xs text-destructive mt-3 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Late penalty applies: {Math.abs(activeQuest.remainingSeconds) >= 600 ? '75%' : '50%'} XP reduction
              </p>
            )}
          </div>
        ) : (
          <Link to="/quests">
            <div className="card-game p-6 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Start a Quest</h3>
              <p className="text-sm text-muted-foreground">Choose a quest to begin your journey</p>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Penalty Warning */}
      {user.pendingPenalty && user.pendingPenalty > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded-lg bg-destructive/20 border border-destructive/50 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">
            -{user.pendingPenalty.toLocaleString()} XP penalty ({user.missedDays} day missed)
          </span>
        </motion.div>
      )}
    </div>
  );
}
