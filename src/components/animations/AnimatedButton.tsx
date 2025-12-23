import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  icon?: ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', size = 'md', loading, success, icon, className, disabled, ...props }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors overflow-hidden';
    
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      ghost: 'hover:bg-muted text-foreground',
      outline: 'border border-border text-foreground hover:bg-muted',
      glow: 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow-primary',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          whileHover={{ translateX: '100%' }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.span>
          ) : success ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              ✓
            </motion.span>
          ) : icon ? (
            <motion.span
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              {icon}
            </motion.span>
          ) : null}
          {children}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

// Pulse button for CTAs
interface PulseButtonProps extends AnimatedButtonProps {
  pulseColor?: 'primary' | 'secondary' | 'accent';
}

export function PulseButton({ pulseColor = 'primary', className, children, ...props }: PulseButtonProps) {
  const pulseColorMap = {
    primary: 'bg-primary/30',
    secondary: 'bg-secondary/30',
    accent: 'bg-accent/30',
  };

  return (
    <div className="relative inline-flex">
      <motion.div
        className={`absolute inset-0 rounded-lg ${pulseColorMap[pulseColor]}`}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <AnimatedButton className={className} {...props}>
        {children}
      </AnimatedButton>
    </div>
  );
}
