import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const tabs = ['Global', 'Country', 'State', 'City'];

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  total_xp: number;
  active_title?: string;
}

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Global');
  const [search, setSearch] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, username, level, total_xp, active_title')
      .order('total_xp', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) {
          setLeaderboard(data);
          const rank = data.findIndex(e => e.id === user?.id);
          setUserRank(rank >= 0 ? rank + 1 : 999);
        }
      });
  }, [user]);

  const filtered = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-foreground mb-4"
      >
        Leaderboards
      </motion.h1>

      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search player..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {userRank > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-game-glow p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-primary">#{userRank}</span>
            <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">Your Rank</span>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {filtered.slice(0, 20).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="card-game p-3 flex items-center gap-3"
          >
            <div className="w-8 text-center">
              {index < 3 ? (
                <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
              ) : (
                <span className="font-display text-sm font-bold text-muted-foreground">#{index + 1}</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold">{entry.username.slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{entry.username}</p>
              <p className="text-xs text-muted-foreground">Lv.{entry.level}</p>
            </div>
            <p className="text-xs text-primary font-semibold">{entry.total_xp.toLocaleString()} XP</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
