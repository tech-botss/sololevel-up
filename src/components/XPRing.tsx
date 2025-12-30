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
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="#111111"
          strokeWidth="8"
        />
        {/* Progress circle - Cyan only */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="none"
          stroke="#00D9FF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.5))' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-wider" style={{ color: '#666666' }}>Level</span>
        <motion.span
          className="font-display text-4xl font-bold"
          style={{ color: '#00D9FF', textShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          key={level}
        >
          {level}
        </motion.span>
        <div className="text-sm mt-1">
          <span className="font-semibold" style={{ color: '#00D9FF' }}>{currentXp.toLocaleString()}</span>
          <span style={{ color: '#666666' }}> / {xpToNext.toLocaleString()}</span>
        </div>
      </div>

      {/* Subtle glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}