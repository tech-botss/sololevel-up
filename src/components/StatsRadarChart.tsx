import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { UserStats as UserStatsType } from '@/types/game';
import { useEffect, useRef, useState } from 'react';

interface StatsRadarChartProps {
  stats: UserStatsType;
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animated?: boolean;
}

const statConfig = {
  str: { label: 'STR', name: 'Strength', color: 'var(--stat-str)', emoji: '💪' },
  int: { label: 'INT', name: 'Intelligence', color: 'var(--stat-int)', emoji: '🧠' },
  end: { label: 'END', name: 'Endurance', color: 'var(--stat-end)', emoji: '🏃' },
  wil: { label: 'WIL', name: 'Willpower', color: 'var(--stat-wil)', emoji: '🔥' },
  soc: { label: 'SOC', name: 'Social', color: 'var(--stat-soc)', emoji: '👥' },
};

function AnimatedNumber({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<SVGTextElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.2,
        delay,
        ease: 'easeOut',
        onUpdate: (v) => setDisplayValue(Math.round(v)),
      });
      return controls.stop;
    }
  }, [isInView, value, delay]);

  return (
    <tspan ref={ref}>{displayValue}</tspan>
  );
}

export function StatsRadarChart({ 
  stats, 
  size = 200, 
  showLabels = true,
  showValues = true,
  animated = true 
}: StatsRadarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  
  const statEntries = Object.entries(stats) as [keyof UserStatsType, number][];
  const numStats = statEntries.length;
  const angleStep = (2 * Math.PI) / numStats;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 35;

  // Generate points for the radar chart
  const points = statEntries.map(([_, value], i) => {
    const angle = i * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Generate grid lines
  const gridLevels = [20, 40, 60, 80, 100];

  // Calculate label positions
  const labelPositions = statEntries.map(([key, value], i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 28;
    return {
      key,
      value,
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
      angle: (angle * 180) / Math.PI,
    };
  });

  // Path length for draw animation
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathD]);

  return (
    <div ref={containerRef} className="relative" style={{ width: size, height: size }}>
      {/* Rotating ambient glow */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-30 blur-2xl pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          background: `conic-gradient(
            from 0deg,
            hsl(var(--stat-str) / 0.6),
            hsl(var(--stat-int) / 0.6),
            hsl(var(--stat-end) / 0.6),
            hsl(var(--stat-wil) / 0.6),
            hsl(var(--stat-soc) / 0.6),
            hsl(var(--stat-str) / 0.6)
          )`,
        }}
      />
      
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full relative z-10">
        <defs>
          {/* Main gradient for the filled area */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.5" />
          </linearGradient>
          
          {/* Animated stroke gradient */}
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <motion.stop 
              offset="0%" 
              stopColor="hsl(var(--primary))"
              animate={{ stopColor: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--primary))'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.stop 
              offset="100%" 
              stopColor="hsl(var(--secondary))"
              animate={{ stopColor: ['hsl(var(--secondary))', 'hsl(var(--primary))', 'hsl(var(--secondary))'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Strong glow for hovered items */}
          <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with pulse */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="hsl(var(--card))"
          fillOpacity="0.3"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          animate={isInView ? { 
            fillOpacity: [0.2, 0.4, 0.2],
            strokeOpacity: [0.3, 0.5, 0.3]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid lines with staggered animation */}
        {gridLevels.map((level, gridIndex) => {
          const gridPoints = statEntries.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = (level / 100) * maxRadius;
            return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
          });
          const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <motion.path
              key={level}
              d={gridPath}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
              animate={isInView && animated ? { 
                opacity: level === 100 ? 0.4 : 0.2, 
                scale: 1 
              } : { opacity: level === 100 ? 0.4 : 0.2 }}
              transition={{ delay: gridIndex * 0.1, duration: 0.5 }}
              style={{ transformOrigin: 'center' }}
            />
          );
        })}

        {/* Axis lines with staggered draw */}
        {statEntries.map(([key], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = centerX + maxRadius * Math.cos(angle);
          const y2 = centerY + maxRadius * Math.sin(angle);
          const isHovered = hoveredStat === key;
          return (
            <motion.line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x2}
              y2={y2}
              stroke={`hsl(${statConfig[key].color})`}
              strokeWidth={isHovered ? 2 : 1}
              initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
              animate={isInView && animated ? { 
                pathLength: 1, 
                opacity: isHovered ? 0.8 : 0.4 
              } : { opacity: isHovered ? 0.8 : 0.4 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            />
          );
        })}

        {/* Stats area with draw animation */}
        <motion.path
          ref={pathRef}
          d={pathD}
          fill="url(#radarGradient)"
          stroke="url(#radarStroke)"
          strokeWidth="3"
          filter="url(#glow)"
          initial={animated ? { 
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            fillOpacity: 0,
            scale: 0.8
          } : undefined}
          animate={isInView && animated ? { 
            strokeDashoffset: 0,
            fillOpacity: 1,
            scale: 1
          } : { fillOpacity: 1, scale: 1 }}
          transition={{ 
            strokeDashoffset: { delay: 0.5, duration: 1.5, ease: 'easeInOut' },
            fillOpacity: { delay: 1.2, duration: 0.8 },
            scale: { delay: 0.3, duration: 0.8, type: 'spring', stiffness: 100 }
          }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Data points with stat-specific colors and interactions */}
        {points.map((p, i) => {
          const [key, value] = statEntries[i];
          const isHovered = hoveredStat === key;
          return (
            <motion.g key={i}>
              {/* Outer ring for hover */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 12 : 8}
                fill="transparent"
                stroke={`hsl(${statConfig[key].color})`}
                strokeWidth="2"
                strokeOpacity={isHovered ? 0.5 : 0}
                initial={animated ? { scale: 0 } : undefined}
                animate={isInView && animated ? { 
                  scale: isHovered ? [1, 1.3, 1] : 1,
                  strokeOpacity: isHovered ? 0.5 : 0
                } : {}}
                transition={{ 
                  scale: { duration: 1, repeat: isHovered ? Infinity : 0 },
                  delay: 1 + i * 0.1 
                }}
              />
              
              {/* Main point */}
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 8 : 6}
                fill={`hsl(${statConfig[key].color})`}
                stroke="hsl(var(--background))"
                strokeWidth="2"
                filter={isHovered ? "url(#glowStrong)" : "url(#glow)"}
                initial={animated ? { scale: 0, opacity: 0 } : undefined}
                animate={isInView && animated ? { 
                  scale: 1, 
                  opacity: 1 
                } : { scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.3 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.4, type: 'spring' }}
                onHoverStart={() => setHoveredStat(key)}
                onHoverEnd={() => setHoveredStat(null)}
                style={{ cursor: 'pointer' }}
              />

              {/* Value tooltip on hover */}
              {isHovered && (
                <motion.g
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <rect
                    x={p.x - 20}
                    y={p.y - 35}
                    width="40"
                    height="22"
                    rx="6"
                    fill="hsl(var(--card))"
                    stroke={`hsl(${statConfig[key].color})`}
                    strokeWidth="1"
                  />
                  <text
                    x={p.x}
                    y={p.y - 21}
                    textAnchor="middle"
                    className="font-display text-[11px] font-bold"
                    fill={`hsl(${statConfig[key].color})`}
                  >
                    {statConfig[key].name}
                  </text>
                </motion.g>
              )}
            </motion.g>
          );
        })}

        {/* Labels with staggered animation */}
        {showLabels && labelPositions.map(({ key, value, x, y }, i) => {
          const isHovered = hoveredStat === key;
          return (
            <motion.g 
              key={key}
              initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
              animate={isInView && animated ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              onHoverStart={() => setHoveredStat(key)}
              onHoverEnd={() => setHoveredStat(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Label background on hover */}
              {isHovered && (
                <motion.rect
                  x={x - 22}
                  y={y - 18}
                  width="44"
                  height="36"
                  rx="8"
                  fill="hsl(var(--card))"
                  fillOpacity="0.9"
                  stroke={`hsl(${statConfig[key].color})`}
                  strokeWidth="1"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              )}
              
              <motion.text
                x={x}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-display text-[12px] font-bold"
                fill={`hsl(${statConfig[key].color})`}
                animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              >
                {statConfig[key].label}
              </motion.text>
              
              {showValues && (
                <text
                  x={x}
                  y={y + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-display text-[11px] font-semibold"
                  fill="hsl(var(--foreground))"
                >
                  <AnimatedNumber value={value} delay={1 + i * 0.1} />
                </text>
              )}
            </motion.g>
          );
        })}

        {/* Center pulsing point */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="hsl(var(--primary))"
          animate={isInView ? { 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}
