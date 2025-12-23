import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  separator?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 1.5,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0,
  separator = ',',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(from, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (latest) => {
    const formatted = latest.toFixed(decimals);
    const [whole, decimal] = formatted.split('.');
    const withSeparator = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimal ? `${withSeparator}.${decimal}` : withSeparator;
  });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(to);
      setHasAnimated(true);
    }
  }, [isInView, to, spring, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

// Animated number with flash effect on change
interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className = '' }: AnimatedNumberProps) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
      animate={{ scale: 1, color: 'inherit' }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
