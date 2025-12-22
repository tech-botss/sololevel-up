import { motion } from 'framer-motion';
import { UserStats as UserStatsType } from '@/types/game';

interface StatsRadarChartProps {
  stats: UserStatsType;
  size?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animated?: boolean;
}

const statConfig = {
  str: { label: 'STR', name: 'Strength', color: 'var(--stat-str)' },
  int: { label: 'INT', name: 'Intelligence', color: 'var(--stat-int)' },
  end: { label: 'END', name: 'Endurance', color: 'var(--stat-end)' },
  wil: { label: 'WIL', name: 'Willpower', color: 'var(--stat-wil)' },
  soc: { label: 'SOC', name: 'Social', color: 'var(--stat-soc)' },
};

export function StatsRadarChart({ 
  stats, 
  size = 200, 
  showLabels = true,
  showValues = true,
  animated = true 
}: StatsRadarChartProps) {
  const statEntries = Object.entries(stats) as [keyof UserStatsType, number][];
  const numStats = statEntries.length;
  const angleStep = (2 * Math.PI) / numStats;
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 30;

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
    const labelRadius = maxRadius + 22;
    return {
      key,
      value,
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
    };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          {/* Main gradient for the filled area */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </linearGradient>
          
          {/* Stroke gradient */}
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--primary))" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Point glow filters for each stat color */}
          {statEntries.map(([key]) => (
            <filter key={`glow-${key}`} id={`glow-${key}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Background circle with subtle gradient */}
        <circle
          cx={centerX}
          cy={centerY}
          r={maxRadius}
          fill="hsl(var(--card))"
          fillOpacity="0.5"
        />

        {/* Grid lines */}
        {gridLevels.map((level) => {
          const gridPoints = statEntries.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const radius = (level / 100) * maxRadius;
            return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
          });
          const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={level}
              d={gridPath}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={level === 100 ? 0.4 : 0.2}
            />
          );
        })}

        {/* Axis lines */}
        {statEntries.map(([key], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = centerX + maxRadius * Math.cos(angle);
          const y2 = centerY + maxRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x2}
              y2={y2}
              stroke={`hsl(${statConfig[key].color})`}
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Stats area with animation */}
        <motion.path
          d={pathD}
          fill="url(#radarGradient)"
          stroke="url(#radarStroke)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
          animate={animated ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Data points with stat-specific colors */}
        {points.map((p, i) => {
          const [key] = statEntries[i];
          return (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill={`hsl(${statConfig[key].color})`}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              filter={`url(#glow-${key})`}
              initial={animated ? { scale: 0 } : undefined}
              animate={animated ? { scale: 1 } : undefined}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          );
        })}

        {/* Labels */}
        {showLabels && labelPositions.map(({ key, value, x, y }) => (
          <g key={key}>
            <text
              x={x}
              y={y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display text-[11px] font-bold"
              fill={`hsl(${statConfig[key].color})`}
            >
              {statConfig[key].label}
            </text>
            {showValues && (
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-display text-[10px] font-semibold"
                fill="hsl(var(--foreground))"
              >
                {value}
              </text>
            )}
          </g>
        ))}

        {/* Center point */}
        <circle
          cx={centerX}
          cy={centerY}
          r="3"
          fill="hsl(var(--muted-foreground))"
          opacity="0.5"
        />
      </svg>
      
      {/* Ambient glow effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{
          background: `conic-gradient(
            from 0deg,
            hsl(var(--stat-str)),
            hsl(var(--stat-int)),
            hsl(var(--stat-end)),
            hsl(var(--stat-wil)),
            hsl(var(--stat-soc)),
            hsl(var(--stat-str))
          )`,
        }}
      />
    </div>
  );
}
