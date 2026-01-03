import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Quest } from '@/types/game';

interface QuestFeedProps {
  quests: Quest[];
  onStartQuest: (quest: Quest) => void;
}

const categories = ['All', 'Study', 'Fitness', 'Coding', 'Money', 'Social'];

export function QuestFeed({ quests, onStartQuest }: QuestFeedProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const questsPerPage = 6;

  const filteredQuests = activeCategory === 'All'
    ? quests
    : quests.filter((q) => q.category.toLowerCase() === activeCategory.toLowerCase());

  const totalPages = Math.ceil(filteredQuests.length / questsPerPage);
  const paginatedQuests = filteredQuests.slice(
    (currentPage - 1) * questsPerPage,
    currentPage * questsPerPage
  );

  const getDifficultyStars = (difficulty: string) => {
    return difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="mb-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg text-foreground">Available Quests</h3>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              setCurrentPage(1);
            }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === category
                ? 'bg-emerald text-potblack'
                : 'bg-potblack-surface border border-potblack-elevated text-gray-light hover:border-emerald/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {paginatedQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-potblack-surface border border-potblack-elevated transition-all duration-300 hover:border-emerald/50 hover:shadow-[0_0_15px_rgba(53,212,117,0.1)]"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-potblack border border-potblack-elevated flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{getCategoryEmoji(quest.category)}</span>
              </div>

              {/* Quest Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h4 className="font-display text-sm text-foreground truncate">{quest.name}</h4>
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-purple/20 text-purple uppercase flex-shrink-0">
                    {quest.category}
                  </span>
                </div>
                <p className="text-xs text-gray-light line-clamp-1 mt-0.5">{quest.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i < getDifficultyStars(quest.difficulty) ? 'text-gold fill-gold' : 'text-gray-dark'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-light flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {quest.estimatedMinutes}m
                  </span>
                </div>
              </div>

              {/* Reward + Button */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs font-bold text-gold">+{quest.xpReward} XP</span>
                <span className="text-[10px] text-emerald">+{quest.goldReward} Gold</span>
                <Button
                  size="sm"
                  onClick={() => onStartQuest(quest)}
                  className="mt-1 h-7 px-3 text-xs bg-emerald text-potblack font-medium hover:bg-emerald/90"
                >
                  Start
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-gray-light hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-gray-light">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-gray-light hover:text-foreground disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </motion.section>
  );
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    study: '📚',
    fitness: '💪',
    coding: '💻',
    money: '💰',
    social: '👥',
  };
  return emojis[category.toLowerCase()] || '⚔️';
}
