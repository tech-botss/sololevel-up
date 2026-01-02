import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar, 
  Flame,
  Trophy,
  Clock,
  Activity
} from 'lucide-react';
import { CalendarData } from '@/types/timer';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, getDay, parseISO } from 'date-fns';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface ActivityStatsProps {
  calendar: CalendarData | null;
}

const COLORS = {
  emerald: '#35D475',
  pheromone: '#8127B9',
  gold: '#FFD700',
  cyan: '#00D9FF',
  red: '#FF4757',
};

export function ActivityStats({ calendar }: ActivityStatsProps) {
  const stats = useMemo(() => {
    if (!calendar) return null;

    const today = new Date();
    const last7Days = calendar.activities.filter(a => {
      const date = parseISO(a.date);
      return date >= subDays(today, 7);
    });
    const last30Days = calendar.activities.filter(a => {
      const date = parseISO(a.date);
      return date >= subDays(today, 30);
    });

    const totalXP = calendar.activities.reduce((sum, a) => sum + a.xp, 0);
    const totalQuests = calendar.activities.reduce((sum, a) => sum + a.questsCompleted, 0);
    const avgDailyXP = Math.round(totalXP / calendar.activeDays || 0);
    const avgDailyQuests = Math.round((totalQuests / calendar.activeDays) * 10) / 10 || 0;

    const weeklyXP = last7Days.reduce((sum, a) => sum + a.xp, 0);
    const monthlyXP = last30Days.reduce((sum, a) => sum + a.xp, 0);

    // Weekly breakdown by day
    const weeklyBreakdown = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const activity = calendar.activities.find(a => a.date === dateStr);
      return {
        day: format(date, 'EEE'),
        xp: activity?.xp || 0,
        quests: activity?.questsCompleted || 0,
      };
    });

    // Monthly trend (last 30 days grouped by week)
    const monthlyTrend = Array.from({ length: 4 }, (_, weekIndex) => {
      const weekStart = subDays(today, (3 - weekIndex) * 7 + 6);
      const weekEnd = subDays(today, (3 - weekIndex) * 7);
      const weekData = calendar.activities.filter(a => {
        const date = parseISO(a.date);
        return date >= weekStart && date <= weekEnd;
      });
      return {
        week: `Week ${weekIndex + 1}`,
        xp: weekData.reduce((sum, a) => sum + a.xp, 0),
        quests: weekData.reduce((sum, a) => sum + a.questsCompleted, 0),
      };
    });

    // Activity by day of week
    const dayOfWeekData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, i) => {
      const dayActivities = calendar.activities.filter(a => {
        const dayIndex = getDay(parseISO(a.date));
        return (dayIndex === 0 ? 6 : dayIndex - 1) === i;
      });
      const totalDayXP = dayActivities.reduce((sum, a) => sum + a.xp, 0);
      return {
        day: dayName,
        xp: Math.round(totalDayXP / (dayActivities.length || 1)),
        fullMark: 200,
      };
    });

    // Streak distribution
    const streakData = [
      { name: 'Current', value: calendar.currentStreak, color: COLORS.emerald },
      { name: 'To Best', value: Math.max(0, calendar.longestStreak - calendar.currentStreak), color: COLORS.pheromone },
    ];

    // Activity intensity distribution
    const intensityData = [
      { name: 'No Activity', value: calendar.activities.filter(a => a.xp === 0).length, color: '#2A2A2A' },
      { name: 'Light (1-50)', value: calendar.activities.filter(a => a.xp > 0 && a.xp <= 50).length, color: 'rgba(53, 212, 117, 0.3)' },
      { name: 'Medium (51-150)', value: calendar.activities.filter(a => a.xp > 50 && a.xp <= 150).length, color: 'rgba(53, 212, 117, 0.6)' },
      { name: 'High (150+)', value: calendar.activities.filter(a => a.xp > 150).length, color: COLORS.emerald },
    ];

    return {
      totalXP,
      totalQuests,
      avgDailyXP,
      avgDailyQuests,
      weeklyXP,
      monthlyXP,
      weeklyBreakdown,
      monthlyTrend,
      dayOfWeekData,
      streakData,
      intensityData,
    };
  }, [calendar]);

  if (!calendar || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-light">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          icon={<Zap className="w-5 h-5" />}
          label="Total XP"
          value={stats.totalXP.toLocaleString()}
          color="emerald"
        />
        <StatCard 
          icon={<Target className="w-5 h-5" />}
          label="Quests Done"
          value={stats.totalQuests.toString()}
          color="pheromone"
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Daily XP"
          value={stats.avgDailyXP.toString()}
          color="gold"
        />
        <StatCard 
          icon={<Calendar className="w-5 h-5" />}
          label="Active Days"
          value={calendar.activeDays.toString()}
          color="cyan"
        />
      </div>

      {/* Streak Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/20">
              <Flame className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-xs text-gray-light font-sans">Current Streak</p>
              <p className="text-2xl font-display font-bold text-white">{calendar.currentStreak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-pheromone/20 to-pheromone/5 border border-pheromone/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pheromone/20">
              <Trophy className="w-6 h-6 text-pheromone" />
            </div>
            <div>
              <p className="text-xs text-gray-light font-sans">Longest Streak</p>
              <p className="text-2xl font-display font-bold text-white">{calendar.longestStreak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald/20">
              <Activity className="w-6 h-6 text-emerald" />
            </div>
            <div>
              <p className="text-xs text-gray-light font-sans">This Week</p>
              <p className="text-2xl font-display font-bold text-white">{stats.weeklyXP} XP</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly XP Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-potblack-elevated border border-emerald/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald" />
          <h3 className="font-display text-sm font-bold text-white">Weekly Activity</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="day" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #35D475',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="xp" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-potblack-elevated border border-pheromone/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-pheromone" />
          <h3 className="font-display text-sm font-bold text-white">Monthly Trend</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthlyTrend}>
              <defs>
                <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.pheromone} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.pheromone} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="week" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #8127B9',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke={COLORS.pheromone} 
                strokeWidth={2}
                fill="url(#colorXP)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Day of Week Radar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-xl bg-potblack-elevated border border-gold/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gold" />
          <h3 className="font-display text-sm font-bold text-white">Activity by Day of Week</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats.dayOfWeekData}>
              <PolarGrid stroke="#2A2A2A" />
              <PolarAngleAxis dataKey="day" stroke="#888" fontSize={12} />
              <PolarRadiusAxis stroke="#888" fontSize={10} />
              <Radar
                name="Avg XP"
                dataKey="xp"
                stroke={COLORS.gold}
                fill={COLORS.gold}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1A1A', 
                  border: '1px solid #FFD700',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Activity Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl bg-potblack-elevated border border-emerald/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-emerald" />
            <h3 className="font-display text-sm font-bold text-white">Activity Intensity</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.intensityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.intensityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #35D475',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} days`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {stats.intensityData.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-light">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl bg-potblack-elevated border border-pheromone/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-pheromone" />
            <h3 className="font-display text-sm font-bold text-white">Streak Progress</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.streakData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.streakData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid #8127B9',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value} days`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-white">
              {calendar.longestStreak > 0 
                ? `${Math.round((calendar.currentStreak / calendar.longestStreak) * 100)}%`
                : '0%'
              }
            </p>
            <p className="text-xs text-gray-light">of personal best</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'emerald' | 'pheromone' | 'gold' | 'cyan';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald/10 border-emerald/30 text-emerald',
    pheromone: 'bg-pheromone/10 border-pheromone/30 text-pheromone',
    gold: 'bg-gold/10 border-gold/30 text-gold',
    cyan: 'bg-cyan-neon/10 border-cyan-neon/30 text-cyan-neon',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-3 rounded-xl border ${colorClasses[color]}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] text-gray-light font-sans uppercase">{label}</span>
      </div>
      <p className="text-xl font-display font-bold text-white">{value}</p>
    </motion.div>
  );
}