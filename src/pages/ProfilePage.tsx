import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { StatsDisplay } from '@/components/StatsDisplay';
import { Trophy, Flame, Target, Coins, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useGameStore();

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-foreground mb-6"
      >
        Profile
      </motion.h1>

      {/* Avatar & Basic Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-game p-5 text-center mb-4"
      >
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="font-display text-2xl font-bold text-primary-foreground">
            {user.username.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">{user.username}</h2>
        <p className="text-sm text-primary">{user.activeTitle || 'Hunter'}</p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3" />
          {user.location.city}, {user.location.state}
        </p>
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
          <span className="font-display text-xl font-bold text-foreground">{user.currentStreak}</span>
          <span className="text-xs text-muted-foreground ml-1">/ {user.longestStreak} best</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Quests</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">{user.totalQuestsCompleted}</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-accent mb-1">
            <Coins className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Gold Earned</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground">{user.totalGoldEarned.toLocaleString()}</span>
        </div>
        <div className="card-game p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs text-muted-foreground">Global Rank</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">#{user.ranks.global}</span>
        </div>
      </motion.div>

      {/* Character Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-game p-5"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Character Stats</h3>
        <StatsDisplay stats={user.stats} />
      </motion.div>
    </div>
  );
}
