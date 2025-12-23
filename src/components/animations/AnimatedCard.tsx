import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: 'lift' | 'glow' | 'scale' | 'tilt' | 'none';
  glowColor?: 'primary' | 'secondary' | 'accent';
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hover = 'lift',
  glowColor = 'primary',
  ...props
}: AnimatedCardProps) {
  const hoverVariants = {
    lift: {
      y: -4,
      transition: { duration: 0.2 },
    },
    glow: {
      boxShadow: `0 0 30px hsl(var(--${glowColor}) / 0.4)`,
      transition: { duration: 0.2 },
    },
    scale: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tilt: {
      rotateX: -2,
      rotateY: 2,
      transition: { duration: 0.2 },
    },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={hoverVariants[hover]}
      whileTap={{ scale: 0.98 }}
      className={cn('transition-shadow', className)}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Staggered list wrapper
interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggeredList({ children, className, staggerDelay = 0.05 }: StaggeredListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered item
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
