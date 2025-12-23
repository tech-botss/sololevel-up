import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { StatsRadarChart } from '@/components/StatsRadarChart';
import { AvatarPreview } from '@/components/AvatarPreview';
import { AuraEffect, getAuraTypeFromId } from '@/components/AuraEffect';
import { Button } from '@/components/ui/button';
import { Trophy, Flame, Target, Coins, MapPin, Settings, Sparkles, TrendingUp, Zap, Award, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountUp } from '@/components/animations';
import { ProfilePageSkeleton } from '@/components/skeletons';

const statCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const statBarConfig = {
  str: { label: 'STR', name: 'Strength', color: 'bg-stat-str', textColor: 'text-stat-str' },
  int: { label: 'INT', name: 'Intelligence', color: 'bg-stat-int', textColor: 'text-stat-int' },
  end: { label: 'END', name: 'Endurance', color: 'bg-stat-end', textColor: 'text-stat-end' },
  wil: { label: 'WIL', name: 'Willpower', color: 'bg-stat-wil', textColor: 'text-stat-wil' },
  soc: { label: 'SOC', name: 'Social', color: 'bg-stat-soc', textColor: 'text-stat-soc' },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, fetchProfile, equippedCosmetics } = useGameStore();
  const [showStatBars, setShowStatBars] = useState(false);

  useEffect(() => {
    if (user && !profile) {
      fetchProfile(user.id);
    }
  }, [user, profile, fetchProfile]);

  if (!profile) {
    return <ProfilePageSkeleton />;
  }

  const stats = {
    str: profile.stat_str,
    int: profile.stat_int,
    end: profile.stat_end,
    wil: profile.stat_wil,
    soc: profile.stat_soc,
  };

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);
  const avgStat = Math.round(totalStats / 5);

  const equippedAvatar = equippedCosmetics.avatar || profile.avatar_url;
  const equippedAura = equippedCosmetics.aura;
  const auraType = equippedAura ? getAuraTypeFromId(equippedAura) : 'none';

  const statCards = [
    { icon: Flame, value: profile.current_streak, label: 'Streak', sub: `Best: ${profile.longest_streak}`, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { icon: Target, value: profile.total_quests_completed, label: 'Quests', color: 'text-primary', bgColor: 'bg-primary/10' },
    { icon: Coins, value: profile.total_gold_earned, label: 'Gold Earned', color: 'text-accent', bgColor: 'bg-accent/10', formatNumber: true },
    { icon: Trophy, value: profile.rank_global, label: 'Global Rank', color: 'text-secondary', bgColor: 'bg-secondary/10', prefix: '#' },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Animated background glows */}
      <motion.div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="fixed bottom-1/3 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header */}
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
        className="card-game p-6 text-center mb-4 relative overflow-hidden"
      >
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Avatar with entrance animation */}
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            animate={{ 
              filter: ['drop-shadow(0 0 20px hsl(var(--primary) / 0.3))', 'drop-shadow(0 0 40px hsl(var(--primary) / 0.5))', 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05 }}
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
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  <span className="font-display text-3xl font-bold text-primary-foreground">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </span>
                </motion.div>
              )}
            </AuraEffect>
          </motion.div>
        </motion.div>

        {/* Name with typing effect style */}
        <motion.h2 
          className="font-display text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {profile.username}
        </motion.h2>

        {/* Level badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, type: 'spring' }}
          className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/50"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-bold text-primary">Level {profile.level}</span>
        </motion.div>

        {/* Title */}
        <motion.p 
          className="text-sm text-secondary mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {profile.active_title || 'Hunter'}
        </motion.p>

        {/* Aura info */}
        {equippedAura && (
          <motion.div 
            className="flex items-center justify-center gap-1 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3 h-3 text-accent" />
            </motion.div>
            <span className="text-xs text-accent">
              {equippedAura.replace('aura-', '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())} Aura
            </span>
          </motion.div>
        )}

        {/* Location */}
        {profile.city && (
          <motion.p 
            className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin className="w-3 h-3" />
            {profile.city}, {profile.state}
          </motion.p>
        )}
      </motion.div>

      {/* Stats Grid with 3D hover */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-4"
        initial="hidden"
        animate="visible"
        style={{ perspective: 1000 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={statCardVariants}
            whileHover={{ 
              y: -6, 
              rotateX: 5,
              boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.3)',
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="card-game p-4 group cursor-pointer relative overflow-hidden"
          >
            {/* Background icon */}
            <motion.div 
              className={cn('absolute -right-2 -bottom-2 opacity-10', stat.color)}
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <stat.icon className="w-16 h-16" />
            </motion.div>

            <div className="relative z-10">
              <div className={cn('flex items-center gap-2 mb-2', stat.color)}>
                <motion.div
                  className={cn('p-1.5 rounded-lg', stat.bgColor)}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-4 h-4" />
                </motion.div>
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              
              <motion.div 
                className="font-display text-2xl font-bold text-foreground"
                key={stat.value}
                initial={{ scale: 1.1, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {stat.prefix}
                {stat.formatNumber ? (
                  <CountUp to={stat.value} duration={1.5} />
                ) : (
                  <CountUp to={stat.value} duration={1} />
                )}
              </motion.div>
              
              {stat.sub && (
                <motion.span 
                  className="text-[10px] text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.sub}
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Character Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-game p-5 relative overflow-hidden"
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="p-2 rounded-lg bg-primary/20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <TrendingUp className="w-4 h-4 text-primary" />
            </motion.div>
            <h3 className="font-display text-lg font-bold text-foreground">Character Stats</h3>
          </div>
          
          {/* Toggle button */}
          <motion.button
            onClick={() => setShowStatBars(!showStatBars)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showStatBars ? 'Radar' : 'Bars'}
            <ChevronRight className={cn('w-3 h-3 transition-transform', showStatBars && 'rotate-90')} />
          </motion.button>
        </div>

        {/* Average stat indicator */}
        <motion.div 
          className="flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-xl bg-muted/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Award className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Average Stat:</span>
          <motion.span 
            className="font-display text-lg font-bold text-accent"
            key={avgStat}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {avgStat}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </motion.div>

        {/* Stats visualization */}
        <AnimatePresence mode="wait">
          {showStatBars ? (
            <motion.div
              key="bars"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {(Object.entries(stats) as [keyof typeof statBarConfig, number][]).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('font-display text-xs font-bold', statBarConfig[key].textColor)}>
                        {statBarConfig[key].label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {statBarConfig[key].name}
                      </span>
                    </div>
                    <motion.span 
                      className="font-display text-sm font-bold text-foreground"
                      key={value}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {value}
                    </motion.span>
                  </div>
                  
                  <div className="h-3 bg-muted rounded-full overflow-hidden relative">
                    <motion.div
                      className={cn('h-full rounded-full relative', statBarConfig[key].color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1.5, delay: 1 + index * 0.1, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center"
            >
              <StatsRadarChart stats={stats} size={240} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
