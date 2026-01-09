import { motion } from 'framer-motion';
import { Pause, Play, Check, AlertTriangle, Lock, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveQuest } from '@/types/game';
import { Progress } from '@/components/ui/progress';

interface ActiveQuestCardProps {
  quest: ActiveQuest;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  canComplete: boolean;
  secondsUntilUnlock: number;
}

export function ActiveQuestCard({ quest, onPause, onResume, onComplete, canComplete, secondsUntilUnlock }: ActiveQuestCardProps) {
  const minutes = Math.floor(Math.abs(quest.remainingSeconds) / 60);
  const seconds = Math.abs(quest.remainingSeconds) % 60;
  const isOvertime = quest.remainingSeconds < 0;
  const progress = Math.max(0, Math.min(100, ((quest.estimatedMinutes * 60 - quest.remainingSeconds) / (quest.estimatedMinutes * 60)) * 100));

  // Format unlock countdown
  const unlockMinutes = Math.floor(secondsUntilUnlock / 60);
  const unlockSeconds = secondsUntilUnlock % 60;
  
  // Calculate unlock progress (percentage of minimum time completed)
  const totalSeconds = quest.estimatedMinutes * 60;
  const minRequiredSeconds = Math.max(60, totalSeconds * 0.6);
  const unlockProgress = Math.min(100, ((minRequiredSeconds - secondsUntilUnlock) / minRequiredSeconds) * 100);

  return (
    <motion.div
      className="card-notification mb-6 p-5 overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          animate={{ y: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-3 h-3 rounded-full ${quest.isPaused ? 'bg-muted-foreground' : isOvertime ? 'bg-destructive' : 'bg-accent'}`}
              animate={!quest.isPaused ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-display text-primary tracking-[0.15em] uppercase">
              {quest.isPaused ? 'PAUSED' : isOvertime ? 'OVERTIME' : 'IN PROGRESS'}
            </span>
          </div>
          {isOvertime && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </motion.div>
          )}
        </div>

        {/* Quest Name */}
        <h3 className="font-display text-xl font-bold text-foreground mb-4 tracking-wide">
          {quest.name}
        </h3>

        {/* Timer Display */}
        <motion.div 
          className="text-center mb-4"
          animate={!quest.isPaused && !isOvertime ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className={`font-display text-5xl font-bold tracking-wider ${
            isOvertime ? 'text-destructive' : 'text-primary'
          }`}>
            <motion.span
              className={isOvertime ? '' : 'text-glow'}
              animate={isOvertime ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {isOvertime && '-'}
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.span>
          </div>
          <p className="text-xs text-muted-foreground font-display tracking-wider mt-2">
            {isOvertime ? 'OVER TIME LIMIT' : 'REMAINING'}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-sm overflow-hidden border border-border">
            <motion.div
              className={`h-full ${isOvertime ? 'bg-destructive' : 'bg-primary'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
              animate={isOvertime ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Unlock Countdown */}
        {!canComplete && secondsUntilUnlock > 0 && (
          <motion.div 
            className="mb-4 p-3 rounded-lg bg-muted/50 border border-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-display text-muted-foreground tracking-wider">COMPLETE UNLOCKS IN</span>
              </div>
              <div className="flex items-center gap-1 text-primary font-display font-bold">
                <Timer className="w-4 h-4" />
                <span>{String(unlockMinutes).padStart(2, '0')}:{String(unlockSeconds).padStart(2, '0')}</span>
              </div>
            </div>
            <Progress value={unlockProgress} className="h-1.5" />
          </motion.div>
        )}
        
        {canComplete && (
          <motion.div 
            className="mb-4 p-3 rounded-lg bg-accent/20 border border-accent/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center gap-2 text-accent">
              <Check className="w-4 h-4" />
              <span className="text-xs font-display tracking-wider">QUEST READY TO COMPLETE!</span>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {quest.isPaused ? (
            <Button
              onClick={onResume}
              className="flex-1 btn-game font-display tracking-wider"
            >
              <Play className="w-4 h-4 mr-2" />
              RESUME
            </Button>
          ) : (
            <Button
              onClick={onPause}
              variant="outline"
              className="flex-1 btn-secondary font-display tracking-wider"
            >
              <Pause className="w-4 h-4 mr-2" />
              PAUSE
            </Button>
          )}
          <Button
            onClick={onComplete}
            disabled={!canComplete}
            className="flex-1 btn-accent font-display tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canComplete ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            COMPLETE
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
