import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Trophy, Target, Flame, Coins, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AmbientBackground } from '@/components/AmbientBackground';
import { StatsRadarChart } from '@/components/StatsRadarChart';
import { CountUp } from '@/components/animations';
import { ProfilePageSkeleton } from '@/components/skeletons';

interface FriendProfile {
  id: string;
  username: string;
  level: number;
  current_xp: number;
  total_xp: number;
  gold: number;
  total_gold_earned: number;
  current_streak: number;
  longest_streak: number;
  total_quests_completed: number;
  rank_global: number;
  active_title: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  stat_str: number;
  stat_int: number;
  stat_end: number;
  stat_wil: number;
  stat_soc: number;
}

const statBarConfig = {
  stat_str: { label: 'STR', name: 'Strength', color: 'bg-stat-str' },
  stat_int: { label: 'INT', name: 'Intelligence', color: 'bg-stat-int' },
  stat_end: { label: 'END', name: 'Endurance', color: 'bg-stat-end' },
  stat_wil: { label: 'WIL', name: 'Willpower', color: 'bg-stat-wil' },
  stat_soc: { label: 'SOC', name: 'Social', color: 'bg-stat-soc' },
};

export default function FriendProfilePage() {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRadar, setShowRadar] = useState(false);

  useEffect(() => {
    if (friendId) {
      fetchFriendProfile();
    }
  }, [friendId]);

  const fetchFriendProfile = async () => {
    if (!friendId) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', friendId)
      .single();

    if (data && !error) {
      setProfile(data);
    }
    setLoading(false);
  };

  const xpForNextLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const stats = {
    stat_str: profile.stat_str,
    stat_int: profile.stat_int,
    stat_end: profile.stat_end,
    stat_wil: profile.stat_wil,
    stat_soc: profile.stat_soc,
  };

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);
  const xpNeeded = xpForNextLevel(profile.level);
  const xpProgress = (profile.current_xp / xpNeeded) * 100;

  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative">
      <AmbientBackground particleCount={20} intensity="low" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6 relative z-10"
      >
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground">Hunter Profile</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="card-game-glow p-6 mb-6 relative z-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center ring-2 ring-primary/30">
              <span className="font-display text-2xl font-bold text-primary-foreground">
                {profile.username.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-card border border-primary/50 rounded-full px-2 py-0.5">
              <span className="font-display text-xs font-bold text-primary">{profile.level}</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground text-glow">
              {profile.username}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.active_title || 'Hunter'}</p>
            {location && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>XP Progress</span>
            <span>{profile.current_xp} / {xpNeeded}</span>
          </div>
          <div className="progress-xp">
            <motion.div 
              className="progress-xp-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-6 relative z-10"
      >
        <div className="card-game p-4 text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-orange-400" />
          <p className="font-display text-2xl font-bold text-foreground">
            <CountUp to={profile.current_streak} />
          </p>
          <p className="text-xs text-muted-foreground">Day Streak</p>
        </div>
        <div className="card-game p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="font-display text-2xl font-bold text-foreground">
            <CountUp to={profile.total_quests_completed} />
          </p>
          <p className="text-xs text-muted-foreground">Quests Done</p>
        </div>
        <div className="card-game p-4 text-center">
          <Coins className="w-5 h-5 mx-auto mb-1 text-accent" />
          <p className="font-display text-2xl font-bold text-foreground">
            <CountUp to={profile.total_gold_earned} />
          </p>
          <p className="text-xs text-muted-foreground">Gold Earned</p>
        </div>
        <div className="card-game p-4 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
          <p className="font-display text-2xl font-bold text-foreground">
            #{profile.rank_global < 999999 ? <CountUp to={profile.rank_global} /> : '—'}
          </p>
          <p className="text-xs text-muted-foreground">Global Rank</p>
        </div>
      </motion.div>

      {/* Character Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-game p-4 relative z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">Character Stats</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRadar(!showRadar)}
            className="text-xs"
          >
            {showRadar ? 'Bars' : 'Radar'}
          </Button>
        </div>

        {showRadar ? (
          <div className="flex justify-center">
            <StatsRadarChart
              stats={{
                str: stats.stat_str,
                int: stats.stat_int,
                end: stats.stat_end,
                wil: stats.stat_wil,
                soc: stats.stat_soc,
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {(Object.entries(statBarConfig) as [keyof typeof stats, typeof statBarConfig[keyof typeof statBarConfig]][]).map(([key, config]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{config.name}</span>
                  <span className="font-display font-bold text-foreground">{stats[key]}</span>
                </div>
                <div className="stat-bar">
                  <motion.div
                    className={`h-full rounded-full ${config.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stats[key] / 100) * 100, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Power</span>
            <span className="font-display font-bold text-primary">
              <CountUp to={totalStats} />
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
