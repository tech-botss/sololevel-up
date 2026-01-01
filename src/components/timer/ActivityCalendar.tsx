import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, startOfWeek, addMonths, subMonths, isSameMonth } from 'date-fns';
import { CalendarData, DayActivity } from '@/types/timer';
import { toast } from 'sonner';

interface ActivityCalendarProps {
  calendar: CalendarData | null;
  onRestoreStreak: () => boolean;
  canRestoreStreak: boolean;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getActivityLevel(xp: number): 'none' | 'low' | 'medium' | 'high' {
  if (xp === 0) return 'none';
  if (xp <= 50) return 'low';
  if (xp <= 150) return 'medium';
  return 'high';
}

function getActivityColor(activity: DayActivity | undefined): string {
  if (!activity || activity.xp === 0) return 'bg-potblack-elevated';
  if (activity.isRestored) return 'bg-pheromone/70';
  
  const level = getActivityLevel(activity.xp);
  switch (level) {
    case 'low': return 'bg-emerald/30';
    case 'medium': return 'bg-emerald/60';
    case 'high': return 'bg-emerald';
    default: return 'bg-potblack-elevated';
  }
}

interface DayTooltipProps {
  activity: DayActivity;
  position: { x: number; y: number };
}

function DayTooltip({ activity, position }: DayTooltipProps) {
  const date = new Date(activity.date);
  const dayName = format(date, 'EEEE');
  const formattedDate = format(date, 'MMM d, yyyy');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="fixed z-50 px-3 py-2 rounded-lg bg-potblack-elevated border border-emerald/20 shadow-lg"
      style={{
        left: Math.min(position.x, window.innerWidth - 200),
        top: Math.max(position.y - 70, 10),
      }}
    >
      <p className="text-xs font-sans text-white font-medium">{dayName}</p>
      <p className="text-xs font-sans text-gray-light">{formattedDate}</p>
      <p className="text-xs font-sans text-emerald mt-1">{activity.xp} XP earned</p>
      {activity.questsCompleted > 0 && (
        <p className="text-xs font-sans text-gray-light">
          {activity.questsCompleted} quest{activity.questsCompleted > 1 ? 's' : ''} complete
        </p>
      )}
      {activity.isRestored && (
        <p className="text-xs font-sans text-pheromone mt-1">Restored</p>
      )}
    </motion.div>
  );
}

export function ActivityCalendar({ calendar, onRestoreStreak, canRestoreStreak }: ActivityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<{ activity: DayActivity; position: { x: number; y: number } } | null>(null);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 11, 31));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Group days by month
  const monthsData = useMemo(() => {
    const months: { month: Date; days: Date[] }[] = [];
    let currentMonthDays: Date[] = [];
    let lastMonth = -1;

    calendarDays.forEach(day => {
      const month = day.getMonth();
      if (month !== lastMonth) {
        if (currentMonthDays.length > 0) {
          months.push({ month: new Date(day.getFullYear(), lastMonth, 1), days: currentMonthDays });
        }
        currentMonthDays = [];
        lastMonth = month;
      }
      currentMonthDays.push(day);
    });

    if (currentMonthDays.length > 0) {
      months.push({ month: new Date(currentMonth.getFullYear(), lastMonth, 1), days: currentMonthDays });
    }

    return months;
  }, [calendarDays, currentMonth]);

  const handleRestoreStreak = () => {
    const success = onRestoreStreak();
    if (success) {
      toast.success(`Streak restored! ${(calendar?.restoresRemaining ?? 1) - 1} restores remaining`, {
        icon: <Sparkles className="w-4 h-4 text-pheromone" />,
      });
    } else {
      toast.error('Unable to restore streak');
    }
  };

  const handleDayHover = (e: React.MouseEvent, activity: DayActivity | undefined) => {
    if (!activity) return;
    setHoveredDay({
      activity,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  if (!calendar) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-light">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald" />
          <h2 className="font-display text-lg font-bold text-white">
            {format(currentMonth, 'yyyy')} Activity
          </h2>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-potblack-elevated border border-emerald/20">
            <Flame className="w-4 h-4 text-gold" />
            <span className="text-xs font-sans text-gray-light">Current</span>
            <span className="font-display text-sm font-bold text-white">{calendar.currentStreak}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-potblack-elevated border border-pheromone/20">
            <Trophy className="w-4 h-4 text-pheromone" />
            <span className="text-xs font-sans text-gray-light">Best</span>
            <span className="font-display text-sm font-bold text-white">{calendar.longestStreak}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-potblack-elevated border border-emerald/20">
            <CalendarIcon className="w-4 h-4 text-emerald" />
            <span className="text-xs font-sans text-gray-light">Active</span>
            <span className="font-display text-sm font-bold text-white">{calendar.activeDays}</span>
          </div>
        </div>
      </div>

      {/* Restore Streak Button */}
      {canRestoreStreak && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-pheromone/10 border border-pheromone/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-bold text-white">Streak Lost!</p>
              <p className="text-xs text-gray-light mt-1">
                You have {calendar.restoresRemaining} free restore{calendar.restoresRemaining > 1 ? 's' : ''} this month
              </p>
            </div>
            <Button
              onClick={handleRestoreStreak}
              className="bg-pheromone hover:bg-pheromone/80 text-white font-display text-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Restore Streak
            </Button>
          </div>
        </motion.div>
      )}

      {/* Year Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() - 1, 0, 1))}
          className="text-gray-light hover:text-white hover:bg-potblack-elevated"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-display text-lg text-white">{currentMonth.getFullYear()}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear() + 1, 0, 1))}
          className="text-gray-light hover:text-white hover:bg-potblack-elevated"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Calendar Grid - Full Year */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-12 gap-2 min-w-[800px]">
          {monthsData.map(({ month, days }) => (
            <div key={month.toISOString()} className="space-y-1">
              <p className="text-[10px] font-sans text-gray-light text-center uppercase">
                {format(month, 'MMM')}
              </p>
              <div className="grid grid-cols-7 gap-[2px]">
                {/* Padding for first week */}
                {Array.from({ length: (getDay(days[0]) + 6) % 7 }).map((_, i) => (
                  <div key={`pad-${i}`} className="w-[14px] h-[14px]" />
                ))}
                {days.map(day => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const activity = calendar.activities.find(a => a.date === dateStr);
                  const colorClass = getActivityColor(activity);

                  return (
                    <motion.div
                      key={dateStr}
                      className={`w-[14px] h-[14px] rounded-sm cursor-pointer transition-all ${colorClass}`}
                      whileHover={{ scale: 1.3 }}
                      onMouseEnter={(e) => handleDayHover(e, activity)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-xs text-gray-light">Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-potblack-elevated" />
          <div className="w-3 h-3 rounded-sm bg-emerald/30" />
          <div className="w-3 h-3 rounded-sm bg-emerald/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald" />
        </div>
        <span className="text-xs text-gray-light">More</span>
        <div className="w-px h-3 bg-gray-dark" />
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-pheromone/70" />
          <span className="text-xs text-gray-light">Restored</span>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && <DayTooltip activity={hoveredDay.activity} position={hoveredDay.position} />}
      </AnimatePresence>
    </div>
  );
}
