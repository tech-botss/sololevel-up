import { motion } from 'framer-motion';
import { Play, Pause, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveQuest } from '@/types/game';

interface ActiveQuestCardProps {
  quest: ActiveQuest;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
}

export function ActiveQuestCard({ quest, onPause, onResume, onComplete }: ActiveQuestCardProps) {
  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const sign = seconds < 0 ? '+' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLate = quest.remainingSeconds < 0;
  const isComplete = quest.remainingSeconds <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 rounded-xl border-2 relative overflow-hidden mb-6"
      style={{
        backgroundColor: '#1A1A1A',
        borderColor: isLate ? 'rgba(255, 99, 71, 0.5)' : 'rgba(53, 212, 117, 0.5)',
      }}
    >
      {/* Animated glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: isLate
            ? [
                'inset 0 0 20px rgba(255, 99, 71, 0.1)',
                'inset 0 0 40px rgba(255, 99, 71, 0.2)',
                'inset 0 0 20px rgba(255, 99, 71, 0.1)',
              ]
            : [
                'inset 0 0 20px rgba(53, 212, 117, 0.1)',
                'inset 0 0 40px rgba(53, 212, 117, 0.2)',
                'inset 0 0 20px rgba(53, 212, 117, 0.1)',
              ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative">
        <span className="text-sm text-gray-light">Active Quest</span>
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple/20 text-purple border border-purple/30 uppercase">
          {quest.category}
        </span>
      </div>

      {/* Quest Name */}
      <h3 className="font-display text-lg text-foreground mb-4 relative">{quest.name}</h3>

      {/* Timer Display */}
      <motion.div
        className="text-center mb-5 relative"
        animate={quest.remainingSeconds < 60 && quest.remainingSeconds > 0 ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <motion.span
          className="font-display text-5xl font-bold"
          style={{ color: isLate ? '#FF6347' : '#35D475' }}
          animate={{
            textShadow: isLate
              ? ['0 0 20px rgba(255, 99, 71, 0.3)', '0 0 40px rgba(255, 99, 71, 0.5)', '0 0 20px rgba(255, 99, 71, 0.3)']
              : ['0 0 20px rgba(53, 212, 117, 0.3)', '0 0 40px rgba(53, 212, 117, 0.5)', '0 0 20px rgba(53, 212, 117, 0.3)'],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {formatTime(quest.remainingSeconds)}
        </motion.span>
        {quest.isPaused && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gold mt-2"
          >
            PAUSED
          </motion.p>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 relative">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={quest.isPaused ? onResume : onPause}
            className="w-full border-potblack-elevated text-foreground hover:border-emerald/50"
          >
            {quest.isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )}
          </Button>
        </motion.div>
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onComplete}
            disabled={!isComplete}
            className="w-full bg-emerald text-potblack font-display font-bold hover:bg-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            COMPLETE
          </Button>
        </motion.div>
      </div>

      {/* Late Penalty Warning */}
      {isLate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-lg bg-tomato/10 border border-tomato/30 flex items-center gap-2 relative"
        >
          <AlertTriangle className="w-4 h-4 text-tomato flex-shrink-0" />
          <span className="text-xs text-tomato">
            Late penalty applies: {Math.abs(quest.remainingSeconds) >= 600 ? '75%' : '50%'} XP reduction
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
