import { motion } from 'framer-motion';
import { UserStats as UserStatsType } from '@/types/game';
import { cn } from '@/lib/utils';

interface StatsDisplayProps {
  stats: UserStatsType;
  showRadar?: boolean;
}

const statConfig = {
  str: { label: 'STR', name: 'Strength', color: 'bg-stat-str' },
  int: { label: 'INT', name: 'Intelligence', color: 'bg-stat-int' },
  end: { label: 'END', name: 'Endurance', color: 'bg-stat-end' },
  wil: { label: 'WIL', name: 'Willpower', color: 'bg-stat-wil' },
  soc: { label: 'SOC', name: 'Social', color: 'bg-stat-soc' },
};

export function StatsDisplay({ stats, showRadar = false }: StatsDisplayProps) {
  const statEntries = Object.entries(stats) as [keyof UserStatsType, number][];
  const maxStat = 100;

  if (showRadar) {
    return <StatsRadar stats={stats} />;
  }

  return (
    <div className="space-y-3">
      {statEntries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <span className="w-10 font-display text-xs font-bold text-muted-foreground">
            {statConfig[key].label}
          </span>
          <div className="flex-1 stat-bar">
            <motion.div
              className={cn('h-full rounded-full', statConfig[key].color)}
              initial={{ width: 0 }}
              animate={{ width: `${(value / maxStat) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            />
          </div>
          <span className="w-8 text-right font-display text-sm font-bold text-foreground">
            {value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function StatsRadar({ stats }: { stats: UserStatsType }) {
  const statEntries = Object.entries(stats) as [keyof UserStatsType, number][];
  const numStats = statEntries.length;
  const angleStep = (2 * Math.PI) / numStats;
  const centerX = 100;
  const centerY = 100;
  const maxRadius = 80;

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

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-full">
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
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {statEntries.map((_, i) => {
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
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Stats area */}
        <motion.path
          d={pathD}
          fill="url(#radarGradient)"
          fillOpacity={0.3}
          stroke="url(#radarStroke)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}

        {/* Labels */}
        {statEntries.map(([key, value], i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = maxRadius + 20;
          const x = centerX + labelRadius * Math.cos(angle);
          const y = centerY + labelRadius * Math.sin(angle);
          return (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-display text-[10px] font-bold fill-muted-foreground"
            >
              {statConfig[key].label}
            </text>
          );
        })}

        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
