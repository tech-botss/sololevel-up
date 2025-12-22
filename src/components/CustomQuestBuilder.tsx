import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Zap, Coins, Plus, Minus, Calendar, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { QuestCategory, Quest, calculateQuestXpByTime } from '@/types/game';

interface CustomQuestBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuest: (quest: Quest) => void;
}

const categories: { id: QuestCategory; label: string; icon: string; color: string }[] = [
  { id: 'study', label: 'Study', icon: '📚', color: 'badge-study' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: 'badge-fitness' },
  { id: 'coding', label: 'Coding', icon: '💻', color: 'badge-coding' },
  { id: 'money', label: 'Money', icon: '💰', color: 'badge-money' },
  { id: 'social', label: 'Social', icon: '🤝', color: 'badge-social' },
];

const timePresets = [15, 30, 45, 60, 90, 120];

export function CustomQuestBuilder({ isOpen, onClose, onCreateQuest }: CustomQuestBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('study');
  const [minutes, setMinutes] = useState(30);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Calculate rewards based on time
  const xpReward = calculateQuestXpByTime(minutes);
  const goldReward = Math.floor(xpReward * 0.5);

  // Calculate stat boosts based on category
  const getStatBoosts = () => {
    switch (category) {
      case 'study': return { int: 2 };
      case 'fitness': return { str: 1, end: 1 };
      case 'coding': return { int: 1, wil: 1 };
      case 'money': return { int: 1 };
      case 'social': return { soc: 2 };
      default: return {};
    }
  };

  // Get difficulty based on time
  const getDifficulty = () => {
    if (minutes <= 30) return 'easy';
    if (minutes <= 60) return 'medium';
    return 'hard';
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const quest: Quest = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `Custom ${category} quest`,
      category,
      difficulty: getDifficulty(),
      estimatedMinutes: minutes,
      xpReward,
      goldReward,
      statBoosts: getStatBoosts(),
    };

    onCreateQuest(quest);
    onClose();
    
    // Reset form
    setName('');
    setDescription('');
    setCategory('study');
    setMinutes(30);
    setScheduledDate('');
    setScheduledTime('');
  };

  const adjustMinutes = (delta: number) => {
    setMinutes(prev => Math.max(5, Math.min(240, prev + delta)));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Create Quest</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Quest Name */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Quest Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter quest name..."
                className="bg-muted border-border"
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Description (optional)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you accomplish?"
                className="bg-muted border-border resize-none h-20"
                maxLength={100}
              />
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                      category === cat.id
                        ? 'bg-primary text-primary-foreground shadow-glow-primary'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Duration */}
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Duration (minutes)
              </label>
              
              {/* Time presets */}
              <div className="flex flex-wrap gap-2 mb-3">
                {timePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setMinutes(preset)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-all',
                      minutes === preset
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {preset}m
                  </button>
                ))}
              </div>

              {/* Custom time adjuster */}
              <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-xl">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustMinutes(-5)}
                  className="rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="text-center">
                  <span className="font-display text-3xl font-bold text-primary">{minutes}</span>
                  <span className="text-muted-foreground ml-1">min</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustMinutes(5)}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Schedule (optional) */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule (optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={today}
                  className="bg-muted border-border"
                />
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              {scheduledDate && scheduledTime && (
                <p className="text-xs text-muted-foreground mt-2">
                  Scheduled for {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                </p>
              )}
            </div>

            {/* Rewards Preview */}
            <div className="mb-6 p-4 bg-muted/50 rounded-xl">
              <h3 className="text-sm font-semibold text-foreground mb-3">Rewards Preview</h3>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-primary">
                    <Zap className="w-5 h-5" />
                    <span className="font-display text-xl font-bold">{xpReward}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-accent">
                    <Coins className="w-5 h-5" />
                    <span className="font-display text-xl font-bold">{goldReward}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Gold</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-secondary">
                    <Clock className="w-5 h-5" />
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full capitalize',
                      `badge-${getDifficulty()}`
                    )}>
                      {getDifficulty()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Difficulty</span>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="w-full h-12 font-display text-lg"
              size="lg"
            >
              Create Quest
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
