import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface AmbientBackgroundProps {
  particleCount?: number;
  showOrbs?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function AmbientBackground({ 
  particleCount = 30, 
  showOrbs = true,
  intensity = 'medium'
}: AmbientBackgroundProps) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [particleCount]);

  const intensityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient orbs */}
      {showOrbs && (
        <>
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(185 100% 50% / ${0.08 * intensityMultiplier}) 0%, transparent 70%)`,
              left: '-10%',
              top: '-10%',
            }}
            animate={{
              x: [0, 100, 50, 0],
              y: [0, 50, 100, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(270 85% 55% / ${0.1 * intensityMultiplier}) 0%, transparent 70%)`,
              right: '-5%',
              top: '20%',
            }}
            animate={{
              x: [0, -80, -40, 0],
              y: [0, 80, 40, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(45 95% 55% / ${0.05 * intensityMultiplier}) 0%, transparent 70%)`,
              left: '30%',
              bottom: '-5%',
            }}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -60, -30, 0],
              scale: [1, 1.3, 0.85, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `hsl(185 100% 50% / ${particle.opacity * intensityMultiplier})`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(185 100% 50% / ${particle.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, particle.opacity * intensityMultiplier, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(230 25% 3% / 0.4) 100%)',
        }}
      />
    </div>
  );
}
