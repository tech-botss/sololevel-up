import { useState } from 'react';
import { motion } from 'framer-motion';
import { globalLeaderboard } from '@/data/mockUsers';
import { useGameStore } from '@/stores/gameStore';
import { Trophy, Medal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const tabs = ['Global', 'Country', 'State', 'City'];

export default function LeaderboardsPage() {
  const { user } = useGameStore();
  const [activeTab, setActiveTab] = useState('Global');
  const [search, setSearch] = useState('');

  const filteredLeaderboard = globalLeaderboard.filter(entry =>
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

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1',
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Your Rank */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-game-glow p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold text-primary">#{user.ranks.global}</span>
            <div>
              <p className="font-semibold text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground">Level {user.level}</p>
            </div>
          </div>
          <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full">Top 0.5%</span>
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {filteredLeaderboard.slice(0, 20).map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="card-game p-3 flex items-center gap-3"
          >
            <div className="w-8 text-center">
              {entry.rank <= 3 ? (
                <span className={cn(
                  'text-lg',
                  entry.rank === 1 && 'rank-gold',
                  entry.rank === 2 && 'rank-silver',
                  entry.rank === 3 && 'rank-bronze'
                )}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="font-display text-sm font-bold text-muted-foreground">#{entry.rank}</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-bold">{entry.username.slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{entry.username}</p>
              <p className="text-xs text-muted-foreground">Lv.{entry.level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-primary font-semibold">{entry.totalXp.toLocaleString()} XP</p>
              <div className={cn(
                'w-2 h-2 rounded-full ml-auto',
                entry.isOnline ? 'bg-status-online' : 'bg-status-offline'
              )} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
