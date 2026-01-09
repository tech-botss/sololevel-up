import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { predefinedQuests } from '@/data/quests';
import { Quest, QuestCategory } from '@/types/game';
import { Clock, Zap, Coins, Play, Plus, Pause, X, CheckCircle, Sparkles, Code, Users, Lock, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CustomQuestBuilder } from '@/components/CustomQuestBuilder';
import { DeveloperQuestBuilder } from '@/components/DeveloperQuestBuilder';
import { CurrentDateTime } from '@/components/CurrentDateTime';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useDeveloperRole } from '@/hooks/useDeveloperRole';
import { useCommunityQuests } from '@/hooks/useCommunityQuests';
import { AchievementPopup } from '@/components/AchievementPopup';
import { playUnlockChime } from '@/lib/sounds';

const categories: { id: QuestCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'study', label: '📚 Study' },
  { id: 'fitness', label: '💪 Fitness' },
  { id: 'coding', label: '💻 Coding' },
  { id: 'money', label: '💰 Money' },
  { id: 'social', label: '👥 Social' },
];

const listItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

export default function QuestsPage() {
  const { activeQuest, startQuest, pauseQuest, resumeQuest, abandonQuest, completeQuest, updateQuestTimer, canCompleteQuest, getSecondsUntilCompletable, pendingAchievement, clearPendingAchievement } = useGameStore();
  const [secondsUntilUnlock, setSecondsUntilUnlock] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<QuestCategory | 'all'>('all');
  const [showQuestBuilder, setShowQuestBuilder] = useState(false);
  const [showDevQuestBuilder, setShowDevQuestBuilder] = useState(false);
  const [customQuests, setCustomQuests] = useState<Quest[]>([]);
  const { isDeveloper } = useDeveloperRole();
  const { communityQuests, refetch: refetchCommunityQuests } = useCommunityQuests();
  const hasPlayedUnlockSound = useRef(false);

  const allQuests = [...customQuests, ...communityQuests, ...predefinedQuests];
  const filteredQuests = selectedCategory === 'all' 
    ? allQuests 
    : allQuests.filter(q => q.category === selectedCategory);

  // Timer logic for active quest
  useEffect(() => {
    if (!activeQuest) return;
    
    // Update unlock countdown even when paused (it tracks real time)
    const updateUnlockTimer = () => {
      setSecondsUntilUnlock(getSecondsUntilCompletable());
    };
    
    // Initial update
    updateUnlockTimer();

    if (activeQuest.isPaused) {
      // When paused, still update unlock timer every second
      const interval = setInterval(updateUnlockTimer, 1000);
      return () => clearInterval(interval);
    }

    const interval = setInterval(() => {
      updateQuestTimer(activeQuest.remainingSeconds - 1);
      updateUnlockTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuest, updateQuestTimer, getSecondsUntilCompletable]);

  // Play unlock sound when quest becomes completable
  useEffect(() => {
    const isCompletable = canCompleteQuest();
    if (isCompletable && !hasPlayedUnlockSound.current && activeQuest) {
      hasPlayedUnlockSound.current = true;
      playUnlockChime();
    } else if (!activeQuest) {
      hasPlayedUnlockSound.current = false;
    }
  }, [canCompleteQuest, activeQuest]);

  const handleStartQuest = (quest: Quest) => {
    if (!activeQuest) {
      startQuest(quest);
    }
  };

  const handleCreateQuest = (quest: Quest) => {
    setCustomQuests(prev => [quest, ...prev]);
  };

  const handleCompleteQuest = async () => {
    const result = await completeQuest();
    if (result.xpEarned > 0) {
      toast.success(`Quest Complete! +${result.xpEarned} XP, +${result.goldEarned} Gold`);
    }
  };

  const handleAbandonQuest = () => {
    abandonQuest();
    toast.info('Quest abandoned');
  };

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!activeQuest) return 0;
    const totalSeconds = activeQuest.estimatedMinutes * 60;
    const elapsed = totalSeconds - activeQuest.remainingSeconds;
    return Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <motion.div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl font-bold text-foreground"
        >
          Quests
        </motion.h1>
        <div className="flex items-center gap-2">
          {isDeveloper && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setShowDevQuestBuilder(true)}
                size="sm"
                variant="outline"
                className="gap-2 relative overflow-hidden group border-secondary text-secondary hover:bg-secondary/10"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                <Code className="w-4 h-4" />
                Dev Quest
              </Button>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowQuestBuilder(true)}
              size="sm"
              className="gap-2 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Active Quest Card */}
      <AnimatePresence>
        {activeQuest && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/30 shadow-lg relative overflow-hidden"
          >
            {/* Animated glow border */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{
                boxShadow: activeQuest.remainingSeconds < 0 
                  ? ['inset 0 0 20px hsl(var(--destructive) / 0.2)', 'inset 0 0 40px hsl(var(--destructive) / 0.3)', 'inset 0 0 20px hsl(var(--destructive) / 0.2)']
                  : ['inset 0 0 20px hsl(var(--primary) / 0.1)', 'inset 0 0 30px hsl(var(--primary) / 0.2)', 'inset 0 0 20px hsl(var(--primary) / 0.1)']
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Active Quest</span>
              </div>
              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={handleAbandonQuest}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground mb-1">
              {activeQuest.name}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">{activeQuest.description}</p>

            {/* Timer Display */}
            <div className="text-center mb-4">
              <motion.div 
                className={cn(
                  "font-mono text-4xl font-bold",
                  activeQuest.remainingSeconds < 0 ? "text-destructive" : "text-foreground"
                )}
                animate={activeQuest.remainingSeconds <= 10 && activeQuest.remainingSeconds > 0 
                  ? { scale: [1, 1.05, 1] } 
                  : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
                key={activeQuest.remainingSeconds}
              >
                <motion.span
                  initial={{ opacity: 0.8, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatTime(activeQuest.remainingSeconds)}
                </motion.span>
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeQuest.remainingSeconds < 0 ? (
                  <motion.span 
                    className="text-destructive"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    Overtime!
                  </motion.span>
                ) : 'Time Remaining'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0 }}
              >
                <Progress value={getProgress()} className="h-2" />
              </motion.div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{Math.round(getProgress())}% complete</span>
                <span>{activeQuest.estimatedMinutes}min goal</span>
              </div>
            </div>

            {/* Rewards Preview */}
            <motion.div 
              className="flex items-center justify-center gap-6 text-sm mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span 
                className="flex items-center gap-1 text-primary"
                whileHover={{ scale: 1.1 }}
              >
                <Zap className="w-4 h-4" />
                +{activeQuest.xpReward} XP
              </motion.span>
              <motion.span 
                className="flex items-center gap-1 text-accent"
                whileHover={{ scale: 1.1 }}
              >
                <Coins className="w-4 h-4" />
                +{activeQuest.goldReward}
              </motion.span>
            </motion.div>

            {/* Controls */}
            <div className="flex gap-2">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={activeQuest.isPaused ? resumeQuest : pauseQuest}
                >
                  {activeQuest.isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: canCompleteQuest() ? 1.02 : 1 }} whileTap={{ scale: canCompleteQuest() ? 0.98 : 1 }}>
                <Button
                  className={cn(
                    "w-full relative overflow-hidden",
                    canCompleteQuest() 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  )}
                  onClick={handleCompleteQuest}
                  disabled={!canCompleteQuest()}
                >
                  {canCompleteQuest() ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
            
            {/* Unlock Countdown Timer */}
            {!canCompleteQuest() && secondsUntilUnlock > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <Timer className="w-5 h-5 text-primary animate-pulse" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-primary/50"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Unlocks in</p>
                    <p className="text-xl font-mono font-bold text-primary">
                      {formatTime(secondsUntilUnlock)}
                    </p>
                  </div>
                  <div className="flex-1 max-w-[120px]">
                    <Progress 
                      value={activeQuest ? ((activeQuest.estimatedMinutes * 60 * 0.6 - secondsUntilUnlock) / (activeQuest.estimatedMinutes * 60 * 0.6)) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {canCompleteQuest() && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-center"
              >
                <p className="text-xs text-green-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Quest ready to complete!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar"
      >
        {categories.map((cat, index) => (
          <motion.button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-glow-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Custom Quests Section */}
      <AnimatePresence>
        {customQuests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <motion.span 
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Your Custom Quests
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quest List */}
      <motion.div 
        className="space-y-3"
        initial="hidden"
        animate="visible"
      >
        {filteredQuests.map((quest, index) => {
          const isCustom = quest.id.startsWith('custom-');
          const isCommunity = quest.id.startsWith('community-');
          return (
            <motion.div
              key={quest.id}
              custom={index}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ 
                y: -2, 
                boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.2)',
                transition: { duration: 0.2 }
              }}
              className={cn(
                'card-game p-4 cursor-pointer',
                isCustom && 'border-secondary/50',
                isCommunity && 'border-primary/50'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{quest.name}</h3>
                    {isCustom && (
                      <motion.span 
                        className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary flex items-center gap-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Sparkles className="w-2 h-2" />
                        Custom
                      </motion.span>
                    )}
                    {isCommunity && (
                      <motion.span 
                        className="text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary flex items-center gap-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Users className="w-2 h-2" />
                        Community
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{quest.description}</p>
                </div>
                <motion.span 
                  className={`badge-${quest.difficulty} text-xs px-2 py-1 rounded-full`}
                  whileHover={{ scale: 1.1 }}
                >
                  {quest.difficulty}
                </motion.span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {quest.estimatedMinutes}m
                </span>
                <motion.span 
                  className="flex items-center gap-1 text-primary"
                  whileHover={{ scale: 1.1 }}
                >
                  <Zap className="w-3 h-3" />
                  {quest.xpReward} XP
                </motion.span>
                <motion.span 
                  className="flex items-center gap-1 text-accent"
                  whileHover={{ scale: 1.1 }}
                >
                  <Coins className="w-3 h-3" />
                  {quest.goldReward}
                </motion.span>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={() => handleStartQuest(quest)}
                  disabled={!!activeQuest}
                  size="sm"
                  className="w-full relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  />
                  <Play className="w-4 h-4 mr-2" />
                  {activeQuest ? 'Quest Active' : 'Start Quest'}
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      <AnimatePresence>
        {filteredQuests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            </motion.div>
            <p className="text-muted-foreground mb-4">No quests in this category</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={() => setShowQuestBuilder(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quest
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Quest Builder Modal */}
      <CustomQuestBuilder
        isOpen={showQuestBuilder}
        onClose={() => setShowQuestBuilder(false)}
        onCreateQuest={handleCreateQuest}
      />

      {/* Developer Quest Builder Modal */}
      <AnimatePresence>
        {showDevQuestBuilder && (
          <DeveloperQuestBuilder
            onClose={() => setShowDevQuestBuilder(false)}
            onQuestCreated={refetchCommunityQuests}
          />
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AchievementPopup 
        achievementId={pendingAchievement} 
        onClose={clearPendingAchievement} 
      />
    </div>
  );
}
