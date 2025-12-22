import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { Sparkles, Star, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpPopupProps {
  isOpen: boolean;
  newLevel: number;
  goldReward: number;
  onClose: () => void;
}

export function LevelUpPopup({ isOpen, newLevel, goldReward, onClose }: LevelUpPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="relative p-8 rounded-2xl card-game-glow text-center max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background burst effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary/30 rounded-full"
                  initial={{ scale: 0, x: '-50%', y: '-50%' }}
                  animate={{
                    scale: [0, 2, 0],
                    x: `calc(-50% + ${Math.cos((i * Math.PI * 2) / 8) * 100}px)`,
                    y: `calc(-50% + ${Math.sin((i * Math.PI * 2) / 8) * 100}px)`,
                  }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity, repeatDelay: 2 }}
                />
              ))}
            </div>

            {/* Sparkle icons */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-accent" />
            </motion.div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="mb-4"
              >
                <Star className="w-16 h-16 mx-auto text-accent fill-accent" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-2xl font-bold gradient-text mb-2"
              >
                LEVEL UP!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-foreground text-lg mb-4"
              >
                You are now{' '}
                <span className="font-display font-bold text-primary text-2xl">
                  Level {newLevel}
                </span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg bg-accent/20 border border-accent/50"
              >
                <Coins className="w-6 h-6 text-accent" />
                <span className="font-display text-xl font-bold text-accent">
                  +{goldReward.toLocaleString()} Gold
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
