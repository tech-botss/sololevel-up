import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types/game';
import { getAchievementById } from '@/data/achievements';
import { Trophy, X, Star, Sparkles } from 'lucide-react';

interface AchievementPopupProps {
  achievementId: string | null;
  onClose: () => void;
}

// Achievement unlock sound using Web Audio API
function playUnlockSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a sequence of tones for the unlock sound
    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.15) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    
    // Epic unlock sound sequence
    playTone(523.25, now, 0.15, 0.2);         // C5
    playTone(659.25, now + 0.1, 0.15, 0.2);   // E5
    playTone(783.99, now + 0.2, 0.15, 0.2);   // G5
    playTone(1046.50, now + 0.3, 0.4, 0.25);  // C6 (hold)
    playTone(1318.51, now + 0.35, 0.4, 0.15); // E6 (shimmer)
    
  } catch (error) {
    console.log('Audio not supported');
  }
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  uncommon: 'from-emerald-400 to-teal-600',
  rare: 'from-blue-400 to-indigo-600',
  legendary: 'from-amber-400 via-orange-500 to-red-500',
};

const rarityGlows = {
  common: 'shadow-[0_0_60px_rgba(156,163,175,0.4)]',
  uncommon: 'shadow-[0_0_60px_rgba(16,185,129,0.5)]',
  rare: 'shadow-[0_0_60px_rgba(59,130,246,0.5)]',
  legendary: 'shadow-[0_0_80px_rgba(245,158,11,0.6)]',
};

const rarityBorders = {
  common: 'border-gray-400/50',
  uncommon: 'border-emerald-400/50',
  rare: 'border-blue-400/50',
  legendary: 'border-amber-400/50',
};

export function AchievementPopup({ achievementId, onClose }: AchievementPopupProps) {
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    if (achievementId) {
      const ach = getAchievementById(achievementId);
      setAchievement(ach || null);
      
      if (ach && !hasPlayedSound.current) {
        hasPlayedSound.current = true;
        playUnlockSound();
      }
    } else {
      hasPlayedSound.current = false;
    }
  }, [achievementId]);

  if (!achievement) return null;

  const rarity = achievement.rarity || 'common';

  return (
    <AnimatePresence>
      {achievementId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with particles */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Animated particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${rarityColors[rarity]}`}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* Main popup */}
          <motion.div
            initial={{ scale: 0.5, y: 50, rotateX: -15 }}
            animate={{ 
              scale: 1, 
              y: 0, 
              rotateX: 0,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }
            }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`
              relative w-full max-w-sm rounded-3xl overflow-hidden
              bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
              border-2 ${rarityBorders[rarity]} ${rarityGlows[rarity]}
            `}
            style={{ perspective: '1000px' }}
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${rarityColors[rarity]} opacity-10`}
              animate={{
                opacity: [0.05, 0.15, 0.05],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Top glow line */}
            <motion.div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${rarityColors[rarity]}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-white/70" />
            </motion.button>

            {/* Content */}
            <div className="relative p-8 pt-10 text-center">
              {/* Achievement unlocked text */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
                  Achievement Unlocked
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </motion.div>

              {/* Icon container */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.4 
                }}
                className="relative mx-auto mb-6"
              >
                {/* Outer glow rings */}
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${rarityColors[rarity]} blur-xl opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transform: 'scale(1.5)' }}
                />
                
                {/* Icon background */}
                <div className={`
                  relative w-24 h-24 mx-auto rounded-2xl 
                  bg-gradient-to-br ${rarityColors[rarity]}
                  flex items-center justify-center
                  shadow-lg
                `}>
                  {/* Inner shine */}
                  <motion.div
                    className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/30 to-transparent"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Icon */}
                  <span className="text-5xl relative z-10">{achievement.icon}</span>
                </div>

                {/* Rotating stars */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </motion.div>
              </motion.div>

              {/* Achievement name */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-display text-2xl font-bold text-white mb-2"
              >
                {achievement.name}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-400 mb-4"
              >
                {achievement.description}
              </motion.p>

              {/* Rarity badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${rarityColors[rarity]} bg-clip-text text-transparent`}>
                  {rarity}
                </span>
              </motion.div>

              {/* Tap to close hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-[10px] text-gray-500"
              >
                Tap anywhere to close
              </motion.p>
            </div>

            {/* Bottom shine effect */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${rarityColors[rarity]} opacity-5`}
              animate={{
                opacity: [0.02, 0.08, 0.02],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}