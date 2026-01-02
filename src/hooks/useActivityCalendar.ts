import { useState, useEffect, useCallback } from 'react';
import { DayActivity, CalendarData } from '@/types/timer';
import { format, subDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const STORAGE_KEY = 'solorank_activity_calendar';
const RESTORES_PER_MONTH = 3;

function generateEmptyCalendar(): CalendarData {
  const today = new Date();
  const activities: DayActivity[] = [];
  
  // Generate last 365 days with no activity
  for (let i = 364; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    activities.push({
      date: dateStr,
      xp: 0,
      questsCompleted: 0,
      isRestored: false,
    });
  }

  return {
    activities,
    currentStreak: 0,
    longestStreak: 0,
    activeDays: 0,
    restoresRemaining: RESTORES_PER_MONTH,
    restoresResetDate: format(new Date(today.getFullYear(), today.getMonth() + 1, 1), 'yyyy-MM-dd'),
  };
}

function calculateStreaks(activities: DayActivity[]): { currentStreak: number; longestStreak: number; activeDays: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let activeDays = 0;

  // Sort by date descending
  const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date));

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].xp > 0 || sorted[i].isRestored) {
      activeDays++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Current streak is from today/yesterday
      if (i < 2) {
        currentStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
      if (i === 0) {
        currentStreak = 0;
      }
    }
  }

  return { currentStreak, longestStreak, activeDays };
}

export function useActivityCalendar() {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Fetch activities from database
  const fetchActivities = useCallback(async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCalendar(JSON.parse(stored));
        } else {
          setCalendar(generateEmptyCalendar());
        }
      } catch {
        setCalendar(generateEmptyCalendar());
      }
      setIsLoaded(true);
      return;
    }

    try {
      const { data: dbActivities, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Get profile for restores info
      const { data: profile } = await supabase
        .from('profiles')
        .select('restores_remaining, restores_reset_date, current_streak, longest_streak')
        .eq('id', user.id)
        .single();

      // Generate full calendar with DB data merged
      const emptyCalendar = generateEmptyCalendar();
      
      // Merge DB activities into the calendar
      const activitiesMap = new Map(dbActivities?.map(a => [a.date, a]) || []);
      const mergedActivities = emptyCalendar.activities.map(day => {
        const dbActivity = activitiesMap.get(day.date);
        if (dbActivity) {
          return {
            date: day.date,
            xp: dbActivity.xp,
            questsCompleted: dbActivity.quests_completed,
            isRestored: dbActivity.is_restored,
          };
        }
        return day;
      });

      const { currentStreak, longestStreak, activeDays } = calculateStreaks(mergedActivities);

      // Check if restores need to be reset
      let restoresRemaining = profile?.restores_remaining ?? RESTORES_PER_MONTH;
      let restoresResetDate = profile?.restores_reset_date ?? format(new Date(), 'yyyy-MM-dd');
      
      const resetDate = parseISO(restoresResetDate);
      if (new Date() >= resetDate) {
        restoresRemaining = RESTORES_PER_MONTH;
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        restoresResetDate = format(nextMonth, 'yyyy-MM-dd');
        
        // Update in DB
        await supabase
          .from('profiles')
          .update({ 
            restores_remaining: RESTORES_PER_MONTH,
            restores_reset_date: restoresResetDate
          })
          .eq('id', user.id);
      }

      setCalendar({
        activities: mergedActivities,
        currentStreak: profile?.current_streak ?? currentStreak,
        longestStreak: profile?.longest_streak ?? longestStreak,
        activeDays,
        restoresRemaining,
        restoresResetDate,
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      setCalendar(generateEmptyCalendar());
    }
    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Save activity to database
  const saveActivityToDB = useCallback(async (date: string, xp: number, questsCompleted: number, isRestored: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('daily_activities')
        .upsert({
          user_id: user.id,
          date,
          xp,
          quests_completed: questsCompleted,
          is_restored: isRestored,
        }, {
          onConflict: 'user_id,date',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }, [user]);

  // Restore streak
  const restoreStreak = useCallback(async () => {
    if (!calendar || calendar.restoresRemaining <= 0) return false;

    const yesterday = subDays(new Date(), 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    const updatedActivities = calendar.activities.map(activity => {
      if (activity.date === yesterdayStr && activity.xp === 0) {
        return { ...activity, xp: 1, isRestored: true };
      }
      return activity;
    });

    const { currentStreak, longestStreak, activeDays } = calculateStreaks(updatedActivities);

    const newCalendar: CalendarData = {
      ...calendar,
      activities: updatedActivities,
      currentStreak,
      longestStreak,
      activeDays,
      restoresRemaining: calendar.restoresRemaining - 1,
    };

    setCalendar(newCalendar);

    // Save to DB
    if (user) {
      await saveActivityToDB(yesterdayStr, 1, 0, true);
      await supabase
        .from('profiles')
        .update({ 
          restores_remaining: newCalendar.restoresRemaining,
          current_streak: currentStreak,
          longest_streak: longestStreak,
        })
        .eq('id', user.id);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalendar));
    }

    return true;
  }, [calendar, user, saveActivityToDB]);

  // Add activity for today
  const addActivity = useCallback(async (xp: number, questsCompleted: number = 1) => {
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

    const { currentStreak, longestStreak, activeDays } = calculateStreaks(updatedActivities);
    const todayActivity = updatedActivities.find(a => a.date === todayStr);

    const newCalendar = {
      ...calendar,
      activities: updatedActivities,
      currentStreak,
      longestStreak,
      activeDays,
    };

    setCalendar(newCalendar);

    // Save to DB
    if (user && todayActivity) {
      await saveActivityToDB(todayStr, todayActivity.xp, todayActivity.questsCompleted, todayActivity.isRestored);
      await supabase
        .from('profiles')
        .update({ 
          current_streak: currentStreak,
          longest_streak: longestStreak,
        })
        .eq('id', user.id);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCalendar));
    }
  }, [calendar, user, saveActivityToDB]);

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
    refetch: fetchActivities,
  };
}