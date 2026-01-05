import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronDown, Sparkles, Coins, Crown } from 'lucide-react';
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
          {/* Deep space backdrop with intense glow */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at center, hsl(220 60% 6% / 0.97) 0%, hsl(220 50% 3%) 100%)
              `
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Animated ambient glow effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Central cyan glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(190 100% 50% / 0.2) 0%, transparent 60%)' }}
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.4, 0.8, 0.4],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            
            {/* Secondary purple glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle, hsl(270 80% 50% / 0.1) 0%, transparent 60%)' }}
              animate={{ 
                scale: [1.2, 1, 1.2], 
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            />

            {/* Rays of light */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 h-[400px]"
                style={{
                  background: 'linear-gradient(180deg, hsl(190 100% 50% / 0.3), transparent)',
                  transformOrigin: 'top',
                  rotate: `${i * 45}deg`,
                }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scaleY: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Main notification card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -30 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative max-w-sm w-full mx-6"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: '1000px' }}
          >
            {/* Outer animated glow border */}
            <motion.div
              className="absolute -inset-[3px] rounded-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(190 100% 60% / 0.8), hsl(190 100% 50% / 0.2), hsl(270 80% 50% / 0.3), hsl(190 100% 60% / 0.8))',
                backgroundSize: '400% 400%',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Card content */}
            <div className="relative card-notification p-8 rounded-lg overflow-hidden">
              {/* HUD Corners */}
              <div className="hud-corner-tl" />
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />
              <div className="hud-corner-br" />

              {/* Top accent line */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1 rounded-b"
                style={{ 
                  background: 'linear-gradient(90deg, transparent, hsl(190 100% 60%), transparent)',
                  boxShadow: '0 0 30px hsl(190 100% 50% / 0.8)'
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Multiple scan lines for depth */}
              <motion.div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <motion.div
                  className="absolute inset-x-0 h-[2px]"
                  style={{ 
                    background: 'linear-gradient(90deg, transparent 20%, hsl(190 100% 60% / 0.6) 50%, transparent 80%)',
                    boxShadow: '0 0 20px hsl(190 100% 50% / 0.5)'
                  }}
                  animate={{ y: ['-20%', '500%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  animate={{ y: ['-20%', '500%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: 1 }}
                />
              </motion.div>

              {/* Header with icon */}
              <motion.div 
                className="flex items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <motion.div
                  className="notification-icon"
                  animate={{ 
                    boxShadow: [
                      '0 0 25px hsl(190 100% 50% / 0.4), inset 0 0 15px hsl(190 100% 50% / 0.1)',
                      '0 0 50px hsl(190 100% 50% / 0.7), inset 0 0 25px hsl(190 100% 50% / 0.15)',
                      '0 0 25px hsl(190 100% 50% / 0.4), inset 0 0 15px hsl(190 100% 50% / 0.1)',
                    ],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <AlertCircle className="w-7 h-7" />
                </motion.div>
                <motion.h2 
                  className="notification-title"
                  animate={{ 
                    textShadow: [
                      '0 0 15px hsl(190 100% 50% / 0.6), 0 0 40px hsl(190 100% 50% / 0.4)',
                      '0 0 30px hsl(190 100% 50%), 0 0 60px hsl(190 100% 50% / 0.6)',
                      '0 0 15px hsl(190 100% 50% / 0.6), 0 0 40px hsl(190 100% 50% / 0.4)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  NOTIFICATION
                </motion.h2>
              </motion.div>

              {/* Message */}
              <motion.p
                className="text-center text-muted-foreground mb-8 font-display tracking-[0.1em] text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Your rank has increased.
              </motion.p>

              {/* Level transition */}
              <motion.div
                className="flex flex-col items-center gap-4 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
              >
                {/* Previous level */}
                <motion.div 
                  className="px-8 py-3 border-2 border-border/60 bg-muted/40 rounded text-muted-foreground font-display tracking-[0.2em] text-lg"
                  style={{ boxShadow: 'inset 0 0 20px hsl(0 0% 0% / 0.3)' }}
                >
                  [Level {newLevel - 1}]
                </motion.div>

                {/* Animated arrows */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <ChevronDown className="w-7 h-7 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(190 100% 50%))' }} />
                  <ChevronDown className="w-7 h-7 text-primary -mt-4" style={{ filter: 'drop-shadow(0 0 8px hsl(190 100% 50%))' }} />
                </motion.div>

                {/* New level - Glowing badge */}
                <motion.div
                  className="level-badge relative"
                  animate={{
                    boxShadow: [
                      '0 0 30px hsl(155 100% 50% / 0.4), 0 0 60px hsl(155 100% 50% / 0.2)',
                      '0 0 50px hsl(155 100% 50% / 0.6), 0 0 100px hsl(155 100% 50% / 0.3)',
                      '0 0 30px hsl(155 100% 50% / 0.4), 0 0 60px hsl(155 100% 50% / 0.2)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  >
                    <Crown className="w-5 h-5 text-accent" style={{ filter: 'drop-shadow(0 0 8px hsl(155 100% 50%))' }} />
                  </motion.div>
                  [Level {newLevel}]
                </motion.div>
              </motion.div>

              {/* Gold reward */}
              <motion.div
                className="flex items-center justify-center gap-4 p-5 mb-8 rounded border-2 border-accent/40 relative overflow-hidden"
                style={{ 
                  background: 'linear-gradient(160deg, hsl(155 100% 50% / 0.1) 0%, hsl(155 100% 50% / 0.02) 100%)',
                  boxShadow: '0 0 30px hsl(155 100% 50% / 0.15), inset 0 0 20px hsl(155 100% 50% / 0.05)'
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Coins className="w-7 h-7 text-accent" style={{ filter: 'drop-shadow(0 0 10px hsl(155 100% 50%))' }} />
                </motion.div>
                <motion.span 
                  className="font-display text-2xl font-bold text-accent tracking-[0.12em]"
                  animate={{ 
                    textShadow: ['0 0 10px hsl(155 100% 50% / 0.4)', '0 0 25px hsl(155 100% 50% / 0.7)', '0 0 10px hsl(155 100% 50% / 0.4)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  +{goldReward.toLocaleString()} GOLD
                </motion.span>
              </motion.div>

              {/* Continue button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full btn-primary font-display text-lg tracking-[0.15em] py-7 relative overflow-hidden group"
                >
                  {/* Animated shine */}
                  <motion.div
                    className="absolute inset-0 opacity-50"
                    style={{ background: 'linear-gradient(90deg, transparent, hsl(190 100% 80% / 0.3), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="relative z-10">CONTINUE</span>
                </Button>
              </motion.div>

              {/* Bottom accent line */}
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-0.5 rounded-t"
                style={{ 
                  background: 'linear-gradient(90deg, transparent, hsl(190 100% 50% / 0.6), transparent)',
                  boxShadow: '0 0 15px hsl(190 100% 50% / 0.4)'
                }}
              />
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: i % 2 === 0 ? 'hsl(190 100% 60%)' : 'hsl(155 100% 55%)',
                boxShadow: i % 2 === 0 
                  ? '0 0 10px hsl(190 100% 50%)' 
                  : '0 0 10px hsl(155 100% 50%)',
              }}
              animate={{
                y: [0, -150, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Sparkle effects */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${25 + Math.random() * 50}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" style={{ filter: 'drop-shadow(0 0 8px hsl(190 100% 50%))' }} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
