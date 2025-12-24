import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Quest, QuestCategory, QuestDifficulty } from '@/types/game';

interface CommunityQuestRow {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_minutes: number;
  xp_reward: number;
  gold_reward: number;
  stat_str: number;
  stat_int: number;
  stat_end: number;
  stat_wil: number;
  stat_soc: number;
}

export function useCommunityQuests() {
  const [communityQuests, setCommunityQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunityQuests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_quests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const quests: Quest[] = (data as CommunityQuestRow[]).map(q => ({
        id: `community-${q.id}`,
        name: q.name,
        description: q.description,
        category: q.category as QuestCategory,
        difficulty: q.difficulty as QuestDifficulty,
        estimatedMinutes: q.estimated_minutes,
        xpReward: q.xp_reward,
        goldReward: q.gold_reward,
        statBoosts: {
          str: q.stat_str,
          int: q.stat_int,
          end: q.stat_end,
          wil: q.stat_wil,
          soc: q.stat_soc,
        },
      }));

      setCommunityQuests(quests);
    } catch (error) {
      console.error('Error fetching community quests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityQuests();
  }, [fetchCommunityQuests]);

  return { communityQuests, isLoading, refetch: fetchCommunityQuests };
}
