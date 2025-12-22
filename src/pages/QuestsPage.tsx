import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { predefinedQuests } from '@/data/quests';
import { Quest, QuestCategory } from '@/types/game';
import { Clock, Zap, Coins, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories: { id: QuestCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'study', label: 'Study' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'coding', label: 'Coding' },
  { id: 'money', label: 'Money' },
  { id: 'social', label: 'Social' },
];

export default function QuestsPage() {
  const { activeQuest, startQuest } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');

  const filteredQuests = selectedCategory === 'all' 
    ? predefinedQuests 
    : predefinedQuests.filter(q => q.category === selectedCategory);

  const handleStartQuest = (quest: Quest) => {
    if (!activeQuest) {
      startQuest(quest);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-bold text-foreground mb-4"
      >
        Quests
      </motion.h1>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Quest List */}
      <div className="space-y-3">
        {filteredQuests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-game p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">{quest.name}</h3>
                <p className="text-xs text-muted-foreground">{quest.description}</p>
              </div>
              <span className={`badge-${quest.difficulty} text-xs px-2 py-1 rounded-full`}>
                {quest.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {quest.estimatedMinutes}m
              </span>
              <span className="flex items-center gap-1 text-primary">
                <Zap className="w-3 h-3" />
                {quest.xpReward} XP
              </span>
              <span className="flex items-center gap-1 text-accent">
                <Coins className="w-3 h-3" />
                {quest.goldReward}
              </span>
            </div>

            <Button
              onClick={() => handleStartQuest(quest)}
              disabled={!!activeQuest}
              size="sm"
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {activeQuest ? 'Quest Active' : 'Start Quest'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
