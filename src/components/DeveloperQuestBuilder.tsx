import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Code, Zap, Coins, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuestCategory, QuestDifficulty } from '@/types/game';

interface DeveloperQuestBuilderProps {
  onClose: () => void;
  onQuestCreated: () => void;
}

export function DeveloperQuestBuilder({ onClose, onQuestCreated }: DeveloperQuestBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'study' as QuestCategory,
    difficulty: 'medium' as QuestDifficulty,
    estimatedMinutes: 30,
    xpReward: 100,
    goldReward: 50,
    stat_str: 0,
    stat_int: 0,
    stat_end: 0,
    stat_wil: 0,
    stat_soc: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in');
        return;
      }

      const { error } = await supabase.from('community_quests').insert({
        creator_id: user.id,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        estimated_minutes: formData.estimatedMinutes,
        xp_reward: formData.xpReward,
        gold_reward: formData.goldReward,
        stat_str: formData.stat_str,
        stat_int: formData.stat_int,
        stat_end: formData.stat_end,
        stat_wil: formData.stat_wil,
        stat_soc: formData.stat_soc,
      });

      if (error) throw error;

      toast.success('Community quest created successfully!');
      onQuestCreated();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create quest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-xl font-bold text-foreground">
                Add Community Quest
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Quest Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Complete 50 Push-ups"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the quest..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as QuestCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study">📚 Study</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="coding">💻 Coding</SelectItem>
                    <SelectItem value="money">💰 Money</SelectItem>
                    <SelectItem value="social">👥 Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, difficulty: v as QuestDifficulty }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Minutes
                </Label>
                <Input
                  type="number"
                  min={5}
                  max={240}
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 30 }))}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-primary" /> XP
                </Label>
                <Input
                  type="number"
                  min={10}
                  max={1000}
                  value={formData.xpReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, xpReward: parseInt(e.target.value) || 100 }))}
                />
              </div>
              <div>
                <Label className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-accent" /> Gold
                </Label>
                <Input
                  type="number"
                  min={5}
                  max={500}
                  value={formData.goldReward}
                  onChange={(e) => setFormData(prev => ({ ...prev, goldReward: parseInt(e.target.value) || 50 }))}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Stat Boosts</Label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { key: 'stat_str', label: 'STR' },
                  { key: 'stat_int', label: 'INT' },
                  { key: 'stat_end', label: 'END' },
                  { key: 'stat_wil', label: 'WIL' },
                  { key: 'stat_soc', label: 'SOC' },
                ].map(stat => (
                  <div key={stat.key}>
                    <Label className="text-xs text-center block">{stat.label}</Label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={formData[stat.key as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [stat.key]: parseInt(e.target.value) || 0 }))}
                      className="text-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Add Community Quest'}
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
