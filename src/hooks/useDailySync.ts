import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DailySyncData {
  questsCompletedToday: number;
  xpEarnedToday: number;
  loginStreak: number;
  showDailyRewards: boolean;
  lastLoginDate: string | null;
}

export function useDailySync(userId: string | undefined) {
  const [syncData, setSyncData] = useState<DailySyncData>({
    questsCompletedToday: 0,
    xpEarnedToday: 0,
    loginStreak: 1,
    showDailyRewards: false,
    lastLoginDate: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchDailyData = useCallback(async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Fetch today's completed quests from completed_quests table
      const { data: todayQuests, error: questsError } = await supabase
        .from('completed_quests')
        .select('xp_earned')
        .eq('user_id', userId)
        .gte('completed_at', today);

      if (questsError) {
        console.error('Error fetching today quests:', questsError);
      }

      const questsCount = todayQuests?.length || 0;
      const xpToday = todayQuests?.reduce((sum, q) => sum + q.xp_earned, 0) || 0;

      // Fetch profile for login streak
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_login_date, login_streak, current_streak')
        .eq('id', userId)
        .single();

      let newLoginStreak = profile?.login_streak || profile?.current_streak || 1;
      let showRewards = false;

      // Check if this is a new day login
      if (profile?.last_login_date !== today) {
        showRewards = true;
        
        // Check if streak continues (logged in yesterday) or resets
        if (profile?.last_login_date === yesterday) {
          newLoginStreak = (profile?.login_streak || profile?.current_streak || 0) + 1;
        } else if (profile?.last_login_date && profile.last_login_date < yesterday) {
          newLoginStreak = 1; // Reset streak
        }

        // Update profile with new login date and streak
        await supabase.from('profiles').update({
          last_login_date: today,
          login_streak: newLoginStreak,
          current_streak: newLoginStreak,
        }).eq('id', userId);
      }

      // Update or create daily activity record
      const { data: existingActivity } = await supabase
        .from('daily_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (!existingActivity) {
        await supabase.from('daily_activities').insert({
          user_id: userId,
          date: today,
          quests_completed: questsCount,
          xp: xpToday,
        });
      } else {
        await supabase.from('daily_activities').update({
          quests_completed: questsCount,
          xp: xpToday,
        }).eq('id', existingActivity.id);
      }

      setSyncData({
        questsCompletedToday: questsCount,
        xpEarnedToday: xpToday,
        loginStreak: newLoginStreak,
        showDailyRewards: showRewards,
        lastLoginDate: today,
      });
    } catch (error) {
      console.error('Error in daily sync:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]);

  const dismissDailyRewards = useCallback(() => {
    setSyncData(prev => ({ ...prev, showDailyRewards: false }));
  }, []);

  const refreshSync = useCallback(() => {
    setLoading(true);
    fetchDailyData();
  }, [fetchDailyData]);

  return { 
    ...syncData, 
    loading, 
    dismissDailyRewards,
    refreshSync,
  };
}