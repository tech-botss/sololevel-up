export { PageTransition, staggerContainer, staggerItem, fadeInFrom, scaleIn, slideUpModal, backdrop } from './PageTransition';
export { AnimatedCard, StaggeredList, listItemVariants } from './AnimatedCard';
export { CountUp, AnimatedNumber } from './CountUp';
export { FloatingParticles, Sparkle, GlowOrb } from './FloatingParticles';
export { AnimatedButton, PulseButton } from './AnimatedButton';

// Common animation variants for reuse
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const popIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.8 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
};

// Shared transition configs
export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

export const smoothTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

export const bouncyTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 15,
};
