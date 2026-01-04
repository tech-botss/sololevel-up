import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { useNavigate } from 'react-router-dom';
import { calculateXpForLevel } from '@/types/game';
import { predefinedQuests } from '@/data/quests';
import { Sparkles, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LevelUpPopup } from '@/components/LevelUpPopup';
import {
  HeroSection,
  QuickActions,
  FeaturedQuest,
  TodaySummary,
  QuestFeed,
  ActiveQuestCard,
} from '@/components/home';

export default function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    activeQuest,
    questsCompletedToday,
    fetchProfile,
    startQuest,
    updateQuestTimer,
    completeQuest,
    pauseQuest,
    resumeQuest,
  } = useGameStore();
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Timer logic
  useEffect(() => {
    if (!activeQuest || activeQuest.isPaused) return;

    const interval = setInterval(() => {
      updateQuestTimer(activeQuest.remainingSeconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeQuest, updateQuestTimer]);

  const handleComplete = async () => {
    const result = await completeQuest();
    if (result.xpEarned > 0) {
      setSessionXp((prev) => prev + result.xpEarned);
    }
    if (result.leveledUp) {
      setShowLevelUp(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Loading state
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-primary"
          animate={{ opacity: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
      </div>
    );
  }

  const xpToNext = calculateXpForLevel(profile.level + 1);
  const featuredQuest = predefinedQuests.find((q) => q.difficulty === 'medium') || predefinedQuests[0];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, hsl(189 100% 50% / 0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(265 70% 50% / 0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Header with Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 relative z-10"
      >
        <motion.h1
          className="font-display text-2xl font-bold text-primary tracking-[0.1em]"
          animate={{
            textShadow: [
              '0 0 10px hsl(189 100% 50% / 0.5)',
              '0 0 30px hsl(189 100% 50% / 0.8)',
              '0 0 10px hsl(189 100% 50% / 0.5)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          SOLORANK
        </motion.h1>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection
          username={profile.username}
          level={profile.level}
          currentXp={profile.current_xp}
          xpToNext={xpToNext}
          currentStreak={profile.current_streak}
          gold={profile.gold}
          achievementsCount={profile.total_quests_completed}
          avatarUrl={profile.avatar_url}
        />

        {/* Quick Actions */}
        <QuickActions />

        {/* Active Quest or Featured Quest */}
        <AnimatePresence mode="wait">
          {activeQuest ? (
            <ActiveQuestCard
              key="active"
              quest={activeQuest}
              onPause={pauseQuest}
              onResume={resumeQuest}
              onComplete={handleComplete}
            />
          ) : (
            <FeaturedQuest
              key="featured"
              quest={featuredQuest}
              onStartQuest={startQuest}
            />
          )}
        </AnimatePresence>

        {/* Today's Summary */}
        <TodaySummary
          questsCompleted={questsCompletedToday}
          totalDailyQuests={10}
          xpEarned={sessionXp}
          streak={profile.current_streak}
        />

        {/* Quest Feed */}
        <QuestFeed quests={predefinedQuests} onStartQuest={startQuest} />
      </div>

      {/* Level Up Popup */}
      <LevelUpPopup
        isOpen={showLevelUp}
        newLevel={profile.level}
        goldReward={profile.level * 100}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}
