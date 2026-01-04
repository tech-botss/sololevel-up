import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, Sparkles, Coins } from 'lucide-react';
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
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop with blue tint */}
          <motion.div 
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Ambient glow effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(189 100% 50% / 0.15) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* Main notification card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer glow border */}
            <motion.div
              className="absolute -inset-[2px] rounded-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(189 100% 50% / 0.6), hsl(189 100% 50% / 0.2), hsl(189 100% 50% / 0.6))',
                backgroundSize: '200% 200%',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Card content */}
            <div className="relative card-notification p-6 rounded-lg">
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                  animate={{ y: ['-100%', '400%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* Header with icon */}
              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="notification-icon"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px hsl(189 100% 50% / 0.3)',
                      '0 0 40px hsl(189 100% 50% / 0.5)',
                      '0 0 20px hsl(189 100% 50% / 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertCircle className="w-6 h-6" />
                </motion.div>
                <motion.h2 
                  className="notification-title"
                  animate={{ 
                    textShadow: [
                      '0 0 10px hsl(189 100% 50% / 0.5)',
                      '0 0 30px hsl(189 100% 50% / 0.8)',
                      '0 0 10px hsl(189 100% 50% / 0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  LEVEL UP
                </motion.h2>
              </motion.div>

              {/* Message */}
              <motion.p
                className="text-center text-muted-foreground mb-6 font-display tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Your rank has increased.
              </motion.p>

              {/* Level transition */}
              <motion.div
                className="flex flex-col items-center gap-3 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Previous level */}
                <div className="px-6 py-2 border border-border bg-muted/50 rounded text-muted-foreground font-display tracking-widest">
                  [Level {newLevel - 1}]
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ChevronDown className="w-6 h-6 text-primary" />
                  <ChevronDown className="w-6 h-6 text-primary -mt-3" />
                </motion.div>

                {/* New level */}
                <motion.div
                  className="level-badge"
                  animate={{
                    boxShadow: [
                      '0 0 20px hsl(156 100% 50% / 0.3)',
                      '0 0 40px hsl(156 100% 50% / 0.5)',
                      '0 0 20px hsl(156 100% 50% / 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  [Level {newLevel}]
                </motion.div>
              </motion.div>

              {/* Gold reward */}
              <motion.div
                className="flex items-center justify-center gap-3 p-4 mb-6 rounded border border-accent/30 bg-accent/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Coins className="w-6 h-6 text-accent" />
                </motion.div>
                <span className="font-display text-xl font-bold text-accent tracking-wider">
                  +{goldReward.toLocaleString()} GOLD
                </span>
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full btn-primary font-display text-base tracking-wider"
                >
                  CONTINUE
                </Button>
              </motion.div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
