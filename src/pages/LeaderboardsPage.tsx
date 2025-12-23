import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Globe, Users, TrendingUp, MapPin, Building, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { countryFlags } from '@/data/locations';

const tabs = ['Players', 'Countries', 'States', 'Cities'];

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  total_xp: number;
  active_title?: string;
  country?: string;
  state?: string;
  city?: string;
}

interface AggregateEntry {
  name: string;
  country?: string;
  total_xp: number;
  total_users: number;
  avg_level: number;
  top_player: string;
}

const listItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
};

export default function LeaderboardsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Players');
  const [search, setSearch] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [countryLeaderboard, setCountryLeaderboard] = useState<AggregateEntry[]>([]);
  const [stateLeaderboard, setStateLeaderboard] = useState<AggregateEntry[]>([]);
  const [cityLeaderboard, setCityLeaderboard] = useState<AggregateEntry[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userState, setUserState] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, username, level, total_xp, active_title, country, state, city')
      .order('total_xp', { ascending: false })
      .limit(500)
      .then(({ data }) => {
        if (data) {
          setLeaderboard(data);
          const rank = data.findIndex(e => e.id === user?.id);
          setUserRank(rank >= 0 ? rank + 1 : 999);
          
          const currentUser = data.find(e => e.id === user?.id);
          if (currentUser) {
            setUserCountry(currentUser.country || null);
            setUserState(currentUser.state || null);
            setUserCity(currentUser.city || null);
          }

          // Aggregate by country
          const countryStats: Record<string, { total_xp: number; users: string[]; levels: number[]; top_player: string }> = {};
          const stateStats: Record<string, { country: string; total_xp: number; users: string[]; levels: number[]; top_player: string }> = {};
          const cityStats: Record<string, { country: string; total_xp: number; users: string[]; levels: number[]; top_player: string }> = {};

          data.forEach((profile) => {
            // Country aggregation
            if (profile.country) {
              if (!countryStats[profile.country]) {
                countryStats[profile.country] = { total_xp: 0, users: [], levels: [], top_player: profile.username };
              }
              countryStats[profile.country].total_xp += profile.total_xp;
              countryStats[profile.country].users.push(profile.username);
              countryStats[profile.country].levels.push(profile.level);
            }

            // State aggregation
            if (profile.state && profile.country) {
              const stateKey = `${profile.state}|${profile.country}`;
              if (!stateStats[stateKey]) {
                stateStats[stateKey] = { country: profile.country, total_xp: 0, users: [], levels: [], top_player: profile.username };
              }
              stateStats[stateKey].total_xp += profile.total_xp;
              stateStats[stateKey].users.push(profile.username);
              stateStats[stateKey].levels.push(profile.level);
            }

            // City aggregation
            if (profile.city && profile.country) {
              const cityKey = `${profile.city}|${profile.country}`;
              if (!cityStats[cityKey]) {
                cityStats[cityKey] = { country: profile.country, total_xp: 0, users: [], levels: [], top_player: profile.username };
              }
              cityStats[cityKey].total_xp += profile.total_xp;
              cityStats[cityKey].users.push(profile.username);
              cityStats[cityKey].levels.push(profile.level);
            }
          });

          setCountryLeaderboard(
            Object.entries(countryStats)
              .map(([name, stats]) => ({
                name,
                total_xp: stats.total_xp,
                total_users: stats.users.length,
                avg_level: Math.round(stats.levels.reduce((a, b) => a + b, 0) / stats.levels.length),
                top_player: stats.top_player
              }))
              .sort((a, b) => b.total_xp - a.total_xp)
          );

          setStateLeaderboard(
            Object.entries(stateStats)
              .map(([key, stats]) => ({
                name: key.split('|')[0],
                country: stats.country,
                total_xp: stats.total_xp,
                total_users: stats.users.length,
                avg_level: Math.round(stats.levels.reduce((a, b) => a + b, 0) / stats.levels.length),
                top_player: stats.top_player
              }))
              .sort((a, b) => b.total_xp - a.total_xp)
          );

          setCityLeaderboard(
            Object.entries(cityStats)
              .map(([key, stats]) => ({
                name: key.split('|')[0],
                country: stats.country,
                total_xp: stats.total_xp,
                total_users: stats.users.length,
                avg_level: Math.round(stats.levels.reduce((a, b) => a + b, 0) / stats.levels.length),
                top_player: stats.top_player
              }))
              .sort((a, b) => b.total_xp - a.total_xp)
          );
        }
      });
  }, [user]);

  const filteredPlayers = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCountries = countryLeaderboard.filter(entry =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStates = stateLeaderboard.filter(entry =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = cityLeaderboard.filter(entry =>
    entry.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCountryFlag = (country: string) => countryFlags[country] || '🏳️';

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'Players': return <Users className="w-4 h-4" />;
      case 'Countries': return <Globe className="w-4 h-4" />;
      case 'States': return <MapPin className="w-4 h-4" />;
      case 'Cities': return <Building className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const renderAggregateList = (entries: AggregateEntry[], type: 'country' | 'state' | 'city') => (
    <motion.div 
      className="space-y-2"
      initial="hidden"
      animate="visible"
    >
      {entries.slice(0, 50).map((entry, index) => (
        <motion.div
          key={`${entry.name}-${entry.country || ''}`}
          custom={index}
          variants={listItemVariants}
          whileHover={{ 
            x: 4, 
            boxShadow: '0 5px 20px -5px hsl(var(--primary) / 0.2)',
            transition: { duration: 0.2 }
          }}
          className="card-game p-4 flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 text-center">
            {getMedalEmoji(index) ? (
              <motion.span 
                className="text-lg"
                animate={index < 3 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getMedalEmoji(index)}
              </motion.span>
            ) : (
              <span className="font-display text-sm font-bold text-muted-foreground">#{index + 1}</span>
            )}
          </div>
          <motion.div 
            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {type === 'country' ? (
              <span className="text-2xl">{getCountryFlag(entry.name)}</span>
            ) : (
              <span className="text-lg">{type === 'state' ? <MapPin className="w-5 h-5 text-primary" /> : <Building className="w-5 h-5 text-primary" />}</span>
            )}
          </motion.div>
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">{entry.name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {entry.country && type !== 'country' && (
                <span className="flex items-center gap-1">
                  {getCountryFlag(entry.country)} {entry.country}
                </span>
              )}
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
            <motion.p 
              className="text-sm text-primary font-bold"
              key={entry.total_xp}
            >
              {entry.total_xp.toLocaleString()}
            </motion.p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </motion.div>
      ))}
      {entries.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          {type === 'country' ? <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" /> : 
           type === 'state' ? <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" /> :
           <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />}
          <p>No {type} data yet</p>
          <p className="text-xs">Players need to set their location in profile</p>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-display text-2xl font-bold text-foreground mb-4"
      >
        Leaderboards
      </motion.h1>

      <motion.div 
        className="grid grid-cols-4 gap-1 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-2 py-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1',
              activeTab === tab ? 'bg-primary text-primary-foreground shadow-glow-primary' : 'bg-muted text-muted-foreground'
            )}
          >
            {getTabIcon(tab)}
            {tab}
          </motion.button>
        ))}
      </motion.div>

      <motion.div 
        className="relative mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder={`Search ${activeTab.toLowerCase()}...`} 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10 transition-all focus:ring-2 focus:ring-primary/50" 
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'Players' && userRank > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="card-game-glow p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-2"
                animate={{ 
                  textShadow: ['0 0 10px hsl(var(--primary) / 0.5)', '0 0 20px hsl(var(--primary) / 0.8)', '0 0 10px hsl(var(--primary) / 0.5)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-display text-2xl font-bold text-primary">#{userRank}</span>
              </motion.div>
              <motion.span 
                className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Your Rank
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeTab === 'Players' && (
          <motion.div 
            key="players"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredPlayers.slice(0, 20).map((entry, index) => (
              <motion.div
                key={entry.id}
                custom={index}
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  x: 4, 
                  boxShadow: '0 5px 20px -5px hsl(var(--primary) / 0.2)',
                  transition: { duration: 0.2 }
                }}
                className={cn(
                  "card-game p-3 flex items-center gap-3 cursor-pointer",
                  entry.id === user?.id && "ring-1 ring-primary/50"
                )}
              >
                <div className="w-8 text-center">
                  {getMedalEmoji(index) ? (
                    <motion.span 
                      className="text-lg"
                      animate={index < 3 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getMedalEmoji(index)}
                    </motion.span>
                  ) : (
                    <span className="font-display text-sm font-bold text-muted-foreground">#{index + 1}</span>
                  )}
                </div>
                <motion.div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xs font-bold text-foreground">{entry.username.slice(0, 2).toUpperCase()}</span>
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{entry.username}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">Lv.{entry.level}</p>
                    {entry.country && <span className="text-xs">{getCountryFlag(entry.country)}</span>}
                  </div>
                </div>
                <motion.p 
                  className="text-xs text-primary font-semibold"
                  whileHover={{ scale: 1.1 }}
                >
                  {entry.total_xp.toLocaleString()} XP
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Countries' && (
          <motion.div
            key="countries"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAggregateList(filteredCountries, 'country')}
          </motion.div>
        )}
        {activeTab === 'States' && (
          <motion.div
            key="states"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAggregateList(filteredStates, 'state')}
          </motion.div>
        )}
        {activeTab === 'Cities' && (
          <motion.div
            key="cities"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAggregateList(filteredCities, 'city')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
