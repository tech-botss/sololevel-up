import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Settings, Calendar, BarChart3 } from 'lucide-react';
import { QuestTimerBubble } from './QuestTimerBubble';
import { ActivityCalendar } from './ActivityCalendar';
import { ActivityStats } from './ActivityStats';
import { TimerSettings } from './TimerSettings';
import { useTimerSettings } from '@/hooks/useTimerSettings';
import { useActivityCalendar } from '@/hooks/useActivityCalendar';
import { useGameStore } from '@/stores/gameStore';
import { TimerState } from '@/types/timer';

type TabType = 'calendar' | 'stats' | 'settings';

export function StreaksPage() {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const { settings, saveSettings, updateSetting, resetToDefaults, isLoaded: settingsLoaded } = useTimerSettings();
  const { calendar, restoreStreak, canRestoreStreak, isLoaded: calendarLoaded } = useActivityCalendar();
  const activeQuest = useGameStore((state) => state.activeQuest);

  // Convert active quest to timer state
  const timerState: TimerState = useMemo(() => {
    if (!activeQuest) {
      return {
        questId: null,
        questName: '',
        timeRemaining: 0,
        deadline: null,
        isActive: false,
      };
    }

    const deadline = new Date(activeQuest.startedAt.getTime() + activeQuest.estimatedMinutes * 60 * 1000);
    
    return {
      questId: activeQuest.id,
      questName: activeQuest.name,
      timeRemaining: activeQuest.remainingSeconds,
      deadline: deadline.toISOString(),
      isActive: !activeQuest.isPaused,
    };
  }, [activeQuest]);

  const handleSaveSettings = () => {
    return saveSettings(settings);
  };

  if (!settingsLoaded || !calendarLoaded) {
    return (
      <div className="min-h-screen bg-potblack flex items-center justify-center">
        <div className="animate-pulse text-gray-light font-sans">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-potblack safe-area-inset">
      {/* Floating Timer - only show when there's an active quest */}
      {activeQuest && <QuestTimerBubble settings={settings} timer={timerState} />}

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="font-display text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 md:w-6 md:h-6 text-emerald" />
            Streaks & Activity
          </h1>
          <p className="text-xs md:text-sm text-gray-light mt-1 font-sans">
            Track your progress and maintain your streak
          </p>
        </motion.div>

        {/* Tab Navigation - Mobile Optimized */}
        <div className="sticky top-0 z-40 bg-potblack-light border-b-2 border-emerald/20 mb-4 -mx-4 px-4">
          <div className="flex gap-1 py-2 overflow-x-auto scrollbar-hide">
            <TabButton
              active={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
              icon={<Calendar className="w-4 h-4" />}
              label="Calendar"
            />
            <TabButton
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Stats"
            />
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
              icon={<Settings className="w-4 h-4" />}
              label="Settings"
            />
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ActivityCalendar
                calendar={calendar}
                onRestoreStreak={restoreStreak}
                canRestoreStreak={canRestoreStreak}
              />
            </motion.div>
          )}
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ActivityStats calendar={calendar} />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TimerSettings
                settings={settings}
                onUpdateSetting={updateSetting}
                onSave={handleSaveSettings}
                onReset={resetToDefaults}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-3 font-display text-xs md:text-sm transition-all duration-200
        border-b-[3px] -mb-[2px] whitespace-nowrap flex-shrink-0
        ${active
          ? 'text-white border-emerald font-semibold'
          : 'text-gray-light border-transparent hover:text-white hover:border-pheromone'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}