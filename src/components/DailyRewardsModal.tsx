import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Coins, Zap, Sparkles, Star, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  loginStreak: number;
  onRewardClaimed: (reward: { type: string; amount: number; cosmetic?: string }) => void;
}

const DAILY_REWARDS = [
  { day: 1, type: 'gold', amount: 100, icon: Coins, color: 'text-accent' },
  { day: 2, type: 'xp', amount: 150, icon: Zap, color: 'text-primary' },
  { day: 3, type: 'gold', amount: 200, icon: Coins, color: 'text-accent' },
  { day: 4, type: 'xp', amount: 250, icon: Zap, color: 'text-primary' },
  { day: 5, type: 'gold', amount: 350, icon: Coins, color: 'text-accent' },
  { day: 6, type: 'xp', amount: 400, icon: Zap, color: 'text-primary' },
  { day: 7, type: 'special', amount: 500, icon: Star, color: 'text-yellow-400' },
];

const SPIN_REWARDS = [
  { type: 'gold', amount: 50, label: '50 Gold', color: 'hsl(155 100% 50%)', probability: 25 },
  { type: 'xp', amount: 100, label: '100 XP', color: 'hsl(190 100% 50%)', probability: 25 },
  { type: 'gold', amount: 150, label: '150 Gold', color: 'hsl(155 100% 50%)', probability: 15 },
  { type: 'xp', amount: 250, label: '250 XP', color: 'hsl(190 100% 50%)', probability: 15 },
  { type: 'gold', amount: 300, label: '300 Gold', color: 'hsl(45 100% 60%)', probability: 10 },
  { type: 'xp', amount: 500, label: '500 XP', color: 'hsl(265 70% 60%)', probability: 7 },
  { type: 'gold', amount: 1000, label: '1000 Gold', color: 'hsl(45 100% 50%)', probability: 2 },
  { type: 'cosmetic', amount: 0, label: 'Rare Item!', color: 'hsl(340 80% 55%)', probability: 1, cosmeticId: 'aura-shadow' },
];

export function DailyRewardsModal({ 
  isOpen, 
  onClose, 
  userId, 
  loginStreak,
  onRewardClaimed 
}: DailyRewardsModalProps) {
  const [showWheel, setShowWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [spinClaimed, setSpinClaimed] = useState(false);
  const [selectedReward, setSelectedReward] = useState<typeof SPIN_REWARDS[0] | null>(null);

  const currentDay = ((loginStreak - 1) % 7) + 1;
  const todayReward = DAILY_REWARDS[currentDay - 1];

  useEffect(() => {
    if (isOpen && userId) {
      checkClaimedStatus();
    }
  }, [isOpen, userId]);

  const checkClaimedStatus = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: loginReward } = await supabase
      .from('daily_login_rewards')
      .select('id')
      .eq('user_id', userId)
      .gte('claimed_at', today)
      .limit(1);
    
    setDailyClaimed((loginReward?.length || 0) > 0);
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('last_spin_date')
      .eq('id', userId)
      .single();
    
    setSpinClaimed(profile?.last_spin_date === today);
  };

  const claimDailyReward = async () => {
    if (dailyClaimed) return;
    
    try {
      // Insert reward record
      await supabase.from('daily_login_rewards').insert({
        user_id: userId,
        day_number: currentDay,
        reward_type: todayReward.type,
        reward_amount: todayReward.amount,
      });

      // Update profile
      const updates: Record<string, unknown> = {
        last_login_date: new Date().toISOString().split('T')[0],
      };
      
      if (todayReward.type === 'gold') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('gold, total_gold_earned')
          .eq('id', userId)
          .single();
        
        if (profile) {
          updates.gold = profile.gold + todayReward.amount;
          updates.total_gold_earned = profile.total_gold_earned + todayReward.amount;
        }
      } else if (todayReward.type === 'xp') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_xp, current_xp')
          .eq('id', userId)
          .single();
        
        if (profile) {
          updates.total_xp = profile.total_xp + todayReward.amount;
          updates.current_xp = profile.current_xp + todayReward.amount;
        }
      }
      
      await supabase.from('profiles').update(updates).eq('id', userId);
      
      setDailyClaimed(true);
      onRewardClaimed({ type: todayReward.type, amount: todayReward.amount });
      toast.success(`Day ${currentDay} Reward Claimed! +${todayReward.amount} ${todayReward.type.toUpperCase()}`);
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    }
  };

  const spinWheel = async () => {
    if (isSpinning || spinClaimed) return;
    
    setIsSpinning(true);
    
    // Calculate reward based on probability
    const random = Math.random() * 100;
    let cumulative = 0;
    let reward = SPIN_REWARDS[0];
    
    for (const r of SPIN_REWARDS) {
      cumulative += r.probability;
      if (random <= cumulative) {
        reward = r;
        break;
      }
    }
    
    setSelectedReward(reward);
    
    // Calculate rotation to land on the selected reward
    const rewardIndex = SPIN_REWARDS.indexOf(reward);
    const segmentAngle = 360 / SPIN_REWARDS.length;
    const targetAngle = 360 - (rewardIndex * segmentAngle) - (segmentAngle / 2);
    const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
    const finalRotation = spins * 360 + targetAngle;
    
    setRotation(finalRotation);
    
    // Wait for spin to complete
    setTimeout(async () => {
      setIsSpinning(false);
      
      try {
        const today = new Date().toISOString().split('T')[0];
        const updates: Record<string, unknown> = { last_spin_date: today };
        
        if (reward.type === 'gold') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('gold, total_gold_earned')
            .eq('id', userId)
            .single();
          
          if (profile) {
            updates.gold = profile.gold + reward.amount;
            updates.total_gold_earned = profile.total_gold_earned + reward.amount;
          }
        } else if (reward.type === 'xp') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_xp, current_xp')
            .eq('id', userId)
            .single();
          
          if (profile) {
            updates.total_xp = profile.total_xp + reward.amount;
            updates.current_xp = profile.current_xp + reward.amount;
          }
        } else if (reward.type === 'cosmetic' && reward.cosmeticId) {
          await supabase.from('user_cosmetics').insert({
            user_id: userId,
            cosmetic_id: reward.cosmeticId,
          });
        }
        
        await supabase.from('profiles').update(updates).eq('id', userId);
        
        setSpinClaimed(true);
        onRewardClaimed({ 
          type: reward.type, 
          amount: reward.amount, 
          cosmetic: reward.cosmeticId 
        });
        
        toast.success(`Spin Reward: ${reward.label}!`);
      } catch (error) {
        console.error('Error saving spin reward:', error);
      }
    }, 4000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/30 max-w-md p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Daily Rewards</DialogTitle>
        </VisuallyHidden>
        
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-primary/20 to-transparent">
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(190_100%_50%/0.2),transparent_70%)]"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="text-center relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-2"
            >
              <Gift className="w-12 h-12 text-primary" style={{ filter: 'drop-shadow(0 0 20px hsl(190 100% 50%))' }} />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground">Daily Rewards</h2>
            <p className="text-sm text-muted-foreground">Day {loginStreak} Login Streak</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showWheel ? (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 pt-2"
            >
              {/* Weekly Progress */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {DAILY_REWARDS.map((reward, i) => {
                  const Icon = reward.icon;
                  const isToday = i + 1 === currentDay;
                  const isPast = i + 1 < currentDay;
                  
                  return (
                    <motion.div
                      key={i}
                      className={`
                        relative p-2 rounded-lg text-center
                        ${isToday ? 'bg-primary/20 border border-primary/50 ring-2 ring-primary/30' : ''}
                        ${isPast ? 'bg-muted/50 opacity-50' : ''}
                        ${!isToday && !isPast ? 'bg-muted/30' : ''}
                      `}
                      animate={isToday ? { 
                        boxShadow: ['0 0 10px hsl(190 100% 50% / 0.2)', '0 0 20px hsl(190 100% 50% / 0.4)', '0 0 10px hsl(190 100% 50% / 0.2)']
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-[10px] text-muted-foreground">D{i + 1}</span>
                      <Icon className={`w-4 h-4 mx-auto ${reward.color}`} />
                      {isPast && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                          <span className="text-primary text-lg">✓</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Today's Reward */}
              <motion.div
                className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-4"
                animate={{ 
                  boxShadow: ['0 0 20px hsl(190 100% 50% / 0.1)', '0 0 40px hsl(190 100% 50% / 0.2)', '0 0 20px hsl(190 100% 50% / 0.1)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {todayReward && <todayReward.icon className={`w-8 h-8 ${todayReward.color}`} />}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Today's Reward</p>
                    <p className="font-display text-xl font-bold text-foreground">
                      +{todayReward?.amount} {todayReward?.type.toUpperCase()}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={claimDailyReward}
                  disabled={dailyClaimed}
                >
                  {dailyClaimed ? 'Claimed!' : 'Claim Reward'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowWheel(true)}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Spin
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 pt-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWheel(false)}
                className="mb-4"
              >
                ← Back
              </Button>

              {/* Spin Wheel */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-primary" 
                    style={{ filter: 'drop-shadow(0 0 10px hsl(190 100% 50%))' }} />
                </div>

                {/* Wheel */}
                <motion.div
                  className="w-full h-full rounded-full relative overflow-hidden border-4 border-primary/50"
                  style={{ 
                    background: 'conic-gradient(from 0deg, ' + 
                      SPIN_REWARDS.map((r, i) => `${r.color} ${i * (100/8)}% ${(i+1) * (100/8)}%`).join(', ') + ')',
                    boxShadow: '0 0 30px hsl(190 100% 50% / 0.3), inset 0 0 20px rgba(0,0,0,0.5)'
                  }}
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {SPIN_REWARDS.map((reward, i) => {
                    const angle = (i * 360 / 8) + (180 / 8);
                    return (
                      <div
                        key={i}
                        className="absolute text-[10px] font-bold text-white drop-shadow-lg"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `rotate(${angle}deg) translateY(-80px) rotate(-${angle}deg)`,
                        }}
                      >
                        {reward.label}
                      </div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-background border-4 border-primary/50 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Result Display */}
              <AnimatePresence>
                {selectedReward && !isSpinning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4 p-4 rounded-xl bg-primary/10 border border-primary/30"
                  >
                    <p className="text-sm text-muted-foreground">You Won:</p>
                    <p className="font-display text-2xl font-bold text-primary">{selectedReward.label}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                className="w-full"
                onClick={spinWheel}
                disabled={isSpinning || spinClaimed}
              >
                {spinClaimed ? 'Come Back Tomorrow!' : isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}