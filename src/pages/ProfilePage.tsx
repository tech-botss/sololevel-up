import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { StatsRadarChart } from '@/components/StatsRadarChart';
import { AvatarPreview } from '@/components/AvatarPreview';
import { AuraEffect, getAuraTypeFromId } from '@/components/AuraEffect';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Target, Coins, MapPin, Settings } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, fetchProfile, equippedCosmetics } = useGameStore();

  useEffect(() => {
    if (user && !profile) {
      fetchProfile(user.id);
    }
  }, [user, profile, fetchProfile]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const stats = {
    str: profile.stat_str,
    int: profile.stat_int,
    end: profile.stat_end,
    wil: profile.stat_wil,
    soc: profile.stat_soc,
  };

  const equippedAvatar = equippedCosmetics.avatar || profile.avatar_url;
  const equippedAura = equippedCosmetics.aura;
  const auraType = equippedAura ? getAuraTypeFromId(equippedAura) : 'none';

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-foreground"
        >
          Profile
        </motion.h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile/edit')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Avatar & Basic Info with Aura */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-game p-5 text-center mb-4"
      >
        <div className="flex justify-center mb-3">
          <AuraEffect type={auraType} size="xl">
            {equippedAvatar ? (
              <AvatarPreview
                avatarId={equippedAvatar}
                name={profile.username}
                rarity="rare"
                size="xl"
                showGlow
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-primary-foreground">
                  {profile.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </AuraEffect>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{profile.username}</h2>
        <p className="text-sm text-primary">{profile.active_title || 'Hunter'}</p>
        {equippedAura && (
          <p className="text-xs text-secondary mt-1">
            ✨ {equippedAura.replace('aura-', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())} Aura
          </p>
        )}
        {profile.city && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            {profile.city}, {profile.state}
          </p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-orange-400 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Streak</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">{profile.current_streak}</span>
          <span className="text-xs text-muted-foreground ml-1">/ {profile.longest_streak} best</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Quests</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">{profile.total_quests_completed}</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-accent mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Gold Earned</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground">{profile.total_gold_earned.toLocaleString()}</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Global Rank</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">#{profile.rank_global}</span>
        </div>
      </motion.div>

      {/* Character Stats Radar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-game p-5"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">Character Stats</h3>
        <div className="flex justify-center">
          <StatsRadarChart stats={stats} size={220} />
        </div>
      </motion.div>
    </div>
  );
}
