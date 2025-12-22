import { motion } from 'framer-motion';

interface XPRingProps {
  currentXp: number;
  xpToNext: number;
  level: number;
  size?: number;
}

export function XPRing({ currentXp, xpToNext, level, size = 180 }: XPRingProps) {
  const percentage = (currentXp / xpToNext) * 100;
  const circumference = 2 * Math.PI * (size / 2 - 12);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative level-ring" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="url(#xpGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-muted-foreground text-xs uppercase tracking-wider">Level</span>
        <motion.span
          className="font-display text-4xl font-bold gradient-text"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          key={level}
        >
          {level}
        </motion.span>
        <div className="text-sm text-muted-foreground mt-1">
          <span className="text-primary font-semibold">{currentXp.toLocaleString()}</span>
          <span> / {xpToNext.toLocaleString()}</span>
        </div>
      </div>

      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))`,
        }}
      />
    </div>
  );
}
