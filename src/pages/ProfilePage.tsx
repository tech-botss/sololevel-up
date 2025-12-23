import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { StatsRadarChart } from '@/components/StatsRadarChart';
import { AvatarPreview } from '@/components/AvatarPreview';
import { AuraEffect, getAuraTypeFromId } from '@/components/AuraEffect';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Target, Coins, MapPin, Settings, Sparkles } from 'lucide-react';

const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.2 + i * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
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

  const statCards = [
    { icon: Flame, value: profile.current_streak, label: 'Streak', sub: `/ ${profile.longest_streak} best`, color: 'text-orange-400' },
    { icon: Target, value: profile.total_quests_completed, label: 'Quests', color: 'text-primary' },
    { icon: Coins, value: profile.total_gold_earned.toLocaleString(), label: 'Gold Earned', color: 'text-accent' },
    { icon: Trophy, value: `#${profile.rank_global}`, label: 'Global Rank', color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl font-bold text-foreground"
        >
          Profile
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile/edit')}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Avatar & Basic Info with Aura */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="card-game p-5 text-center mb-4 relative overflow-hidden"
      >
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        <motion.div 
          className="flex justify-center mb-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            animate={{ 
              filter: ['drop-shadow(0 0 20px hsl(var(--primary) / 0.3))', 'drop-shadow(0 0 40px hsl(var(--primary) / 0.5))', 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
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
          </motion.div>
        </motion.div>
        <motion.h2 
          className="font-display text-xl font-bold text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {profile.username}
        </motion.h2>
        <motion.p 
          className="text-sm text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {profile.active_title || 'Hunter'}
        </motion.p>
        {equippedAura && (
          <motion.p 
            className="text-xs text-secondary mt-1 flex items-center justify-center gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-3 h-3" />
            {equippedAura.replace('aura-', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())} Aura
          </motion.p>
        )}
        {profile.city && (
          <motion.p 
            className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin className="w-3 h-3" />
            {profile.city}, {profile.state}
          </motion.p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-4"
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={statCardVariants}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
              transition: { duration: 0.2 }
            }}
            className="card-game p-4 group cursor-pointer"
          >
            <div className={`flex items-center gap-2 ${stat.color} mb-1`}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-4 h-4" />
              </motion.div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <motion.span 
              className="font-display text-xl font-bold text-foreground"
              key={stat.value}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {stat.value}
            </motion.span>
            {stat.sub && <span className="text-xs text-muted-foreground ml-1">{stat.sub}</span>}
          </motion.div>
        ))}
      </motion.div>

      {/* Character Stats Radar */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.2)' }}
        className="card-game p-5"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-4 text-center">Character Stats</h3>
        <motion.div 
          className="flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
        >
          <StatsRadarChart stats={stats} size={220} />
        </motion.div>
      </motion.div>
    </div>
  );
}
