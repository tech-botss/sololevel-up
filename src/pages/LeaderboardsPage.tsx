import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Globe, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { countryFlags } from '@/data/locations';

const tabs = ['Players', 'Countries'];

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  total_xp: number;
  active_title?: string;
  country?: string;
}

interface CountryLeaderboardEntry {
  country: string;
  total_xp: number;
  total_users: number;
  avg_level: number;
  top_player: string;
}

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Players');
  const [search, setSearch] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [countryLeaderboard, setCountryLeaderboard] = useState<CountryLeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userCountryRank, setUserCountryRank] = useState(0);

  useEffect(() => {
    // Fetch player leaderboard
    supabase
      .from('profiles')
      .select('id, username, level, total_xp, active_title, country')
      .order('total_xp', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) {
          setLeaderboard(data);
          const rank = data.findIndex(e => e.id === user?.id);
          setUserRank(rank >= 0 ? rank + 1 : 999);
          
          const currentUser = data.find(e => e.id === user?.id);
          if (currentUser?.country) {
            setUserCountry(currentUser.country);
          }
        }
      });

    // Fetch and aggregate country leaderboard
    supabase
      .from('profiles')
      .select('username, level, total_xp, country')
      .not('country', 'is', null)
      .order('total_xp', { ascending: false })
      .then(({ data }) => {
        if (data) {
          const countryStats: Record<string, { total_xp: number; users: string[]; levels: number[]; top_player: string }> = {};
          
          data.forEach((profile) => {
            if (!profile.country) return;
            
            if (!countryStats[profile.country]) {
              countryStats[profile.country] = {
                total_xp: 0,
                users: [],
                levels: [],
                top_player: profile.username
              };
            }
            
            countryStats[profile.country].total_xp += profile.total_xp;
            countryStats[profile.country].users.push(profile.username);
            countryStats[profile.country].levels.push(profile.level);
          });

          const countryEntries: CountryLeaderboardEntry[] = Object.entries(countryStats)
            .map(([country, stats]) => ({
              country,
              total_xp: stats.total_xp,
              total_users: stats.users.length,
              avg_level: Math.round(stats.levels.reduce((a, b) => a + b, 0) / stats.levels.length),
              top_player: stats.top_player
            }))
            .sort((a, b) => b.total_xp - a.total_xp);

          setCountryLeaderboard(countryEntries);
          
          // Find user's country rank
          if (userCountry) {
            const countryRank = countryEntries.findIndex(e => e.country === userCountry);
            setUserCountryRank(countryRank >= 0 ? countryRank + 1 : 999);
          }
        }
      });
  }, [user, userCountry]);

  const filteredPlayers = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCountries = countryLeaderboard.filter(entry =>
    entry.country.toLowerCase().includes(search.toLowerCase())
  );

  const getCountryFlag = (country: string) => {
    return countryFlags[country] || '🏳️';
  };

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
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 flex items-center justify-center gap-2',
              activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {tab === 'Players' ? <Users className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder={activeTab === 'Players' ? "Search player..." : "Search country..."} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {activeTab === 'Players' && userRank > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-game-glow p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-primary">#{userRank}</span>
            <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">Your Rank</span>
          </div>
        </motion.div>
      )}

      {activeTab === 'Countries' && userCountry && userCountryRank > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-game-glow p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getCountryFlag(userCountry)}</span>
              <span className="font-display text-2xl font-bold text-primary">#{userCountryRank}</span>
            </div>
            <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">{userCountry}</span>
          </div>
        </motion.div>
      )}

      {activeTab === 'Players' && (
        <div className="space-y-2">
          {filteredPlayers.slice(0, 20).map((entry, index) => (
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
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Lv.{entry.level}</p>
                  {entry.country && (
                    <span className="text-xs">{getCountryFlag(entry.country)}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-primary font-semibold">{entry.total_xp.toLocaleString()} XP</p>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'Countries' && (
        <div className="space-y-2">
          {filteredCountries.slice(0, 50).map((entry, index) => (
            <motion.div
              key={entry.country}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card-game p-4 flex items-center gap-3"
            >
              <div className="w-8 text-center">
                {index < 3 ? (
                  <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                ) : (
                  <span className="font-display text-sm font-bold text-muted-foreground">#{index + 1}</span>
                )}
              </div>
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-2xl">{getCountryFlag(entry.country)}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{entry.country}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {entry.total_users} players
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Avg Lv.{entry.avg_level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary font-bold">{entry.total_xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
            </motion.div>
          ))}
          {filteredCountries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No country data yet</p>
              <p className="text-xs">Players need to set their location in profile</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
