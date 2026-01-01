import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimerSettings, TimerState, POSITION_CLASSES, TIMER_SIZE_MAP } from '@/types/timer';
import { useNavigate } from 'react-router-dom';

interface QuestTimerBubbleProps {
  settings: TimerSettings;
  timer: TimerState;
}

function formatTime(seconds: number): string {
  if (seconds <= 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatElapsedTime(seconds: number, startTime: number): string {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  
  if (hours > 0) {
    return `Active for ${hours}h ${minutes}m`;
  }
  return `Active for ${minutes}m`;
}

export function QuestTimerBubble({ settings, timer }: QuestTimerBubbleProps) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(timer.timeRemaining);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!timer.isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.isActive]);

  // Reset time when timer prop changes
  useEffect(() => {
    setTimeRemaining(timer.timeRemaining);
  }, [timer.timeRemaining]);

  if (!settings.showFloatingTimer || !timer.isActive) return null;

  const isWarning = timeRemaining < 300 && timeRemaining > 0; // < 5 minutes
  const isComplete = timeRemaining <= 0;
  const width = TIMER_SIZE_MAP[settings.timerSize];
  const positionClass = POSITION_CLASSES[settings.timerPosition];

  const displayTime = settings.timerFormat === 'remaining' 
    ? formatTime(timeRemaining)
    : formatElapsedTime(timeRemaining, startTime);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: settings.timerOpacity / 100, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`fixed z-[999] ${positionClass}`}
        style={{ width: `${width}px` }}
      >
        <div
          className={`
            p-4 rounded-xl bg-potblack border-2 transition-all duration-300
            ${isWarning ? 'border-gold animate-pulse-gold' : isComplete ? 'border-emerald' : 'border-emerald shadow-[0_0_12px_rgba(53,212,117,0.3)]'}
          `}
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-pheromone" />
            <span className="text-[11px] font-display uppercase tracking-wide text-pheromone">
              Quest Deadline
            </span>
          </div>

          {/* Timer Display */}
          <div className="mb-2">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="font-display text-2xl font-bold text-emerald text-center"
              >
                Quest Complete!
              </motion.div>
            ) : (
              <div 
                className={`font-display text-[28px] font-bold text-center ${isWarning ? 'text-gold' : 'text-white'}`}
                style={{
                  textShadow: isWarning 
                    ? '0 0 10px rgba(255, 215, 0, 0.6)' 
                    : '0 0 10px rgba(53, 212, 117, 0.4)'
                }}
              >
                {displayTime}
              </div>
            )}
          </div>

          {/* Quest Name */}
          <p className="text-[12px] text-gray-light text-center mb-3 truncate">
            {timer.questName || 'No active quest'}
          </p>

          {/* View Quest Button */}
          <Button
            onClick={() => navigate('/quests')}
            className="w-full h-8 text-[12px] font-display bg-emerald text-potblack hover:bg-emerald/90 transition-colors"
          >
            <Eye className="w-3 h-3 mr-1" />
            View Quest
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
