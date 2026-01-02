import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Trophy, Calendar as CalendarIcon, Sparkles, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, startOfMonth, endOfMonth, isSameDay, isToday, subDays, parseISO } from 'date-fns';
import { CalendarData, DayActivity } from '@/types/timer';
import { toast } from 'sonner';

interface ActivityCalendarProps {
  calendar: CalendarData | null;
  onRestoreStreak: () => boolean | Promise<boolean>;
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
  const date = parseISO(activity.date);
  const dayName = format(date, 'EEEE');
  const formattedDate = format(date, 'MMM d, yyyy');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="fixed z-50 px-4 py-3 rounded-xl bg-potblack-elevated border border-emerald/30 shadow-xl backdrop-blur-sm"
      style={{
        left: Math.min(position.x, window.innerWidth - 220),
        top: Math.max(position.y - 100, 10),
      }}
    >
      <p className="text-sm font-display text-white font-bold">{dayName}</p>
      <p className="text-xs font-sans text-gray-light mb-2">{formattedDate}</p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald" />
          <span className="text-xs font-sans text-emerald font-medium">{activity.xp} XP</span>
        </div>
        {activity.questsCompleted > 0 && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-pheromone" />
            <span className="text-xs font-sans text-pheromone">
              {activity.questsCompleted} quest{activity.questsCompleted > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      {activity.isRestored && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-dark">
          <Sparkles className="w-3 h-3 text-pheromone" />
          <span className="text-xs font-sans text-pheromone">Restored Day</span>
        </div>
      )}
    </motion.div>
  );
}

export function ActivityCalendar({ calendar, onRestoreStreak, canRestoreStreak }: ActivityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'year' | 'month'>('month');
  const [hoveredDay, setHoveredDay] = useState<{ activity: DayActivity; position: { x: number; y: number } } | null>(null);

  // Year view data
  const yearData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 11, 31));
    const days = eachDayOfInterval({ start, end });
    
    const months: { month: Date; days: Date[] }[] = [];
    let currentMonthDays: Date[] = [];
    let lastMonth = -1;

    days.forEach(day => {
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
  }, [currentMonth]);

  // Month view data
  const monthData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (viewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentMonth(newDate);
  };

  if (!calendar) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-light">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-gold" />
            <div>
              <p className="text-[10px] text-gray-light uppercase font-sans">Current</p>
              <p className="text-lg font-display font-bold text-white">{calendar.currentStreak}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-xl bg-gradient-to-br from-pheromone/20 to-pheromone/5 border border-pheromone/30"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-pheromone" />
            <div>
              <p className="text-[10px] text-gray-light uppercase font-sans">Best</p>
              <p className="text-lg font-display font-bold text-white">{calendar.longestStreak}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/5 border border-emerald/30"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald" />
            <div>
              <p className="text-[10px] text-gray-light uppercase font-sans">Active</p>
              <p className="text-lg font-display font-bold text-white">{calendar.activeDays}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Restore Streak */}
      {canRestoreStreak && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-pheromone/10 border border-pheromone/30"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-bold text-white">Streak Lost!</p>
              <p className="text-xs text-gray-light mt-1">
                You have {calendar.restoresRemaining} free restore{calendar.restoresRemaining > 1 ? 's' : ''} this month
              </p>
            </div>
            <Button
              onClick={handleRestoreStreak}
              className="bg-pheromone hover:bg-pheromone/80 text-white font-display text-sm w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Restore Streak
            </Button>
          </div>
        </motion.div>
      )}

      {/* View Mode Toggle & Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
            className={viewMode === 'month' 
              ? 'bg-emerald hover:bg-emerald/80 text-potblack font-display text-xs' 
              : 'border-gray-dark text-gray-light hover:text-white font-display text-xs'}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('year')}
            className={viewMode === 'year' 
              ? 'bg-emerald hover:bg-emerald/80 text-potblack font-display text-xs' 
              : 'border-gray-dark text-gray-light hover:text-white font-display text-xs'}
          >
            Year
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('prev')}
            className="text-gray-light hover:text-white hover:bg-potblack-elevated w-8 h-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-display text-sm text-white min-w-[120px] text-center">
            {viewMode === 'year' 
              ? currentMonth.getFullYear()
              : format(currentMonth, 'MMMM yyyy')
            }
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth('next')}
            className="text-gray-light hover:text-white hover:bg-potblack-elevated w-8 h-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'month' ? (
        <motion.div
          key="month"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-potblack-elevated border border-emerald/10"
        >
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-[10px] text-gray-light font-sans uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for padding */}
            {Array.from({ length: (getDay(monthData[0]) + 6) % 7 }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            
            {monthData.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const activity = calendar.activities.find(a => a.date === dateStr);
              const colorClass = getActivityColor(activity);
              const isTodayDate = isToday(day);

              return (
                <motion.div
                  key={dateStr}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer 
                    transition-all relative overflow-hidden
                    ${colorClass}
                    ${isTodayDate ? 'ring-2 ring-emerald' : ''}
                  `}
                  whileHover={{ scale: 1.1 }}
                  onMouseEnter={(e) => handleDayHover(e, activity || { date: dateStr, xp: 0, questsCompleted: 0, isRestored: false })}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className={`text-xs font-sans ${activity && activity.xp > 0 ? 'text-white' : 'text-gray-light'}`}>
                    {format(day, 'd')}
                  </span>
                  {activity && activity.xp > 0 && (
                    <span className="text-[8px] text-white/70">{activity.xp}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="year"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto pb-4"
        >
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 min-w-[600px]">
            {yearData.map(({ month, days }) => (
              <div key={month.toISOString()} className="space-y-1">
                <p className="text-[10px] font-sans text-gray-light text-center uppercase">
                  {format(month, 'MMM')}
                </p>
                <div className="grid grid-cols-7 gap-[2px]">
                  {Array.from({ length: (getDay(days[0]) + 6) % 7 }).map((_, i) => (
                    <div key={`pad-${i}`} className="w-2 h-2 md:w-3 md:h-3" />
                  ))}
                  {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const activity = calendar.activities.find(a => a.date === dateStr);
                    const colorClass = getActivityColor(activity);

                    return (
                      <motion.div
                        key={dateStr}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-sm cursor-pointer transition-all ${colorClass}`}
                        whileHover={{ scale: 1.5 }}
                        onMouseEnter={(e) => handleDayHover(e, activity)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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