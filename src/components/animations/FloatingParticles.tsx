import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'mixed';
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function FloatingParticles({
  count = 20,
  color = 'primary',
  size = 'md',
  speed = 'normal',
  className = '',
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: size === 'sm' ? 2 + Math.random() * 2 : size === 'md' ? 3 + Math.random() * 4 : 5 + Math.random() * 6,
      duration: speed === 'slow' ? 15 + Math.random() * 10 : speed === 'normal' ? 10 + Math.random() * 8 : 6 + Math.random() * 4,
      delay: Math.random() * 5,
      color: color === 'mixed' 
        ? ['primary', 'secondary', 'accent'][Math.floor(Math.random() * 3)]
        : color,
    }));
  }, [count, color, size, speed]);

  const colorMap = {
    primary: 'bg-primary/30',
    secondary: 'bg-secondary/30',
    accent: 'bg-accent/30',
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${colorMap[particle.color as keyof typeof colorMap]} blur-[1px]`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Sparkle effect for special moments
interface SparkleProps {
  className?: string;
}

export function Sparkle({ className = '' }: SparkleProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 180],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 0L11.5 8.5L20 10L11.5 11.5L10 20L8.5 11.5L0 10L8.5 8.5L10 0Z"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
    </motion.div>
  );
}

// Glow orb background effect
interface GlowOrbProps {
  color?: 'primary' | 'secondary' | 'accent';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function GlowOrb({
  color = 'primary',
  position = 'center',
  size = 'md',
  animate = true,
}: GlowOrbProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
  };

  const colorClasses = {
    primary: 'bg-primary/20',
    secondary: 'bg-secondary/20',
    accent: 'bg-accent/20',
  };

  return (
    <motion.div
      className={`absolute ${positionClasses[position]} ${sizeClasses[size]} ${colorClasses[color]} rounded-full blur-[80px] pointer-events-none`}
      animate={animate ? {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      } : undefined}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
