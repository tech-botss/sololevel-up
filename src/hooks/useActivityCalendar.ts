import { useState, useEffect, useCallback } from 'react';
import { DayActivity, CalendarData } from '@/types/timer';
import { format, subDays, parseISO, isToday, differenceInDays } from 'date-fns';

const STORAGE_KEY = 'solorank_activity_calendar';
const RESTORES_PER_MONTH = 3;

function generateInitialCalendar(): CalendarData {
  const today = new Date();
  const activities: DayActivity[] = [];
  
  // Generate last 365 days with some random activity
  for (let i = 364; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Random activity pattern (30% chance of activity)
    const hasActivity = Math.random() > 0.7;
    const xp = hasActivity ? Math.floor(Math.random() * 200) + 10 : 0;
    
    activities.push({
      date: dateStr,
      xp,
      questsCompleted: hasActivity ? Math.floor(xp / 50) + 1 : 0,
      isRestored: false,
    });
  }

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let activeDays = 0;

  for (let i = activities.length - 1; i >= 0; i--) {
    if (activities[i].xp > 0) {
      activeDays++;
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (i === activities.length - 1 || i === activities.length - 2) {
        currentStreak = tempStreak;
      }
    } else {
      if (i >= activities.length - 2) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  return {
    activities,
    currentStreak,
    longestStreak,
    activeDays,
    restoresRemaining: RESTORES_PER_MONTH,
    restoresResetDate: format(new Date(today.getFullYear(), today.getMonth() + 1, 1), 'yyyy-MM-dd'),
  };
}

export function useActivityCalendar() {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load calendar from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CalendarData;
        
        // Check if we need to reset restores (new month)
        const resetDate = parseISO(parsed.restoresResetDate);
        if (new Date() >= resetDate) {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(1);
          parsed.restoresRemaining = RESTORES_PER_MONTH;
          parsed.restoresResetDate = format(nextMonth, 'yyyy-MM-dd');
        }
        
        setCalendar(parsed);
      } else {
        setCalendar(generateInitialCalendar());
      }
    } catch (error) {
      console.warn('Failed to load calendar from localStorage:', error);
      setCalendar(generateInitialCalendar());
    }
    setIsLoaded(true);
  }, []);

  // Save calendar to localStorage
  const saveCalendar = useCallback((data: CalendarData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setCalendar(data);
    } catch (error) {
      console.warn('Failed to save calendar to localStorage:', error);
    }
  }, []);

  // Restore streak
  const restoreStreak = useCallback(() => {
    if (!calendar || calendar.restoresRemaining <= 0) return false;

    // Find yesterday's date
    const yesterday = subDays(new Date(), 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    const updatedActivities = calendar.activities.map(activity => {
      if (activity.date === yesterdayStr && activity.xp === 0) {
        return { ...activity, xp: 1, isRestored: true };
      }
      return activity;
    });

    const newCalendar: CalendarData = {
      ...calendar,
      activities: updatedActivities,
      currentStreak: calendar.currentStreak + 1,
      restoresRemaining: calendar.restoresRemaining - 1,
    };

    saveCalendar(newCalendar);
    return true;
  }, [calendar, saveCalendar]);

  // Add activity for today
  const addActivity = useCallback((xp: number, questsCompleted: number = 1) => {
    if (!calendar) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let wasInactive = false;

    const updatedActivities = calendar.activities.map(activity => {
      if (activity.date === todayStr) {
        wasInactive = activity.xp === 0;
        return {
          ...activity,
          xp: activity.xp + xp,
          questsCompleted: activity.questsCompleted + questsCompleted,
        };
      }
      return activity;
    });

    const newCurrentStreak = wasInactive ? calendar.currentStreak + 1 : calendar.currentStreak;
    const newLongestStreak = Math.max(calendar.longestStreak, newCurrentStreak);
    const newActiveDays = wasInactive ? calendar.activeDays + 1 : calendar.activeDays;

    saveCalendar({
      ...calendar,
      activities: updatedActivities,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      activeDays: newActiveDays,
    });
  }, [calendar, saveCalendar]);

  // Get activity for a specific date
  const getActivityForDate = useCallback((dateStr: string): DayActivity | undefined => {
    return calendar?.activities.find(a => a.date === dateStr);
  }, [calendar]);

  // Check if streak can be restored
  const canRestoreStreak = calendar ? 
    calendar.currentStreak === 0 && calendar.restoresRemaining > 0 : 
    false;

  return {
    calendar,
    isLoaded,
    restoreStreak,
    addActivity,
    getActivityForDate,
    canRestoreStreak,
  };
}
