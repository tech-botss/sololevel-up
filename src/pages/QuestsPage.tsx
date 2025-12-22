import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { predefinedQuests } from '@/data/quests';
import { Quest, QuestCategory } from '@/types/game';
import { Clock, Zap, Coins, Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomQuestBuilder } from '@/components/CustomQuestBuilder';
import { CurrentDateTime } from '@/components/CurrentDateTime';

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
  const [showQuestBuilder, setShowQuestBuilder] = useState(false);
  const [customQuests, setCustomQuests] = useState<Quest[]>([]);

  const allQuests = [...customQuests, ...predefinedQuests];
  const filteredQuests = selectedCategory === 'all' 
    ? allQuests 
    : allQuests.filter(q => q.category === selectedCategory);

  const handleStartQuest = (quest: Quest) => {
    if (!activeQuest) {
      startQuest(quest);
    }
  };

  const handleCreateQuest = (quest: Quest) => {
    setCustomQuests(prev => [quest, ...prev]);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Date & Time Display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <CurrentDateTime />
      </motion.div>

      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold text-foreground"
        >
          Quests
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            onClick={() => setShowQuestBuilder(true)}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </motion.div>
      </div>

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

      {/* Custom Quests Section */}
      {customQuests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Your Custom Quests
          </h2>
        </motion.div>
      )}

      {/* Quest List */}
      <div className="space-y-3">
        {filteredQuests.map((quest, index) => {
          const isCustom = quest.id.startsWith('custom-');
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'card-game p-4',
                isCustom && 'border-secondary/50'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{quest.name}</h3>
                    {isCustom && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary">
                        Custom
                      </span>
                    )}
                  </div>
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
          );
        })}
      </div>

      {/* Empty State */}
      {filteredQuests.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground mb-4">No quests in this category</p>
          <Button onClick={() => setShowQuestBuilder(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Quest
          </Button>
        </motion.div>
      )}

      {/* Custom Quest Builder Modal */}
      <CustomQuestBuilder
        isOpen={showQuestBuilder}
        onClose={() => setShowQuestBuilder(false)}
        onCreateQuest={handleCreateQuest}
      />
    </div>
  );
}
