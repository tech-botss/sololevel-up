import { motion } from 'framer-motion';
import { Star, Play, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Quest } from '@/types/game';

interface FeaturedQuestProps {
  quest: Quest;
  onStartQuest: (quest: Quest) => void;
}

export function FeaturedQuest({ quest, onStartQuest }: FeaturedQuestProps) {
  const navigate = useNavigate();
  const difficultyStars = quest.difficulty === 'easy' ? 2 : quest.difficulty === 'medium' ? 3 : 4;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="mb-6"
    >
      <h3 className="font-display text-lg text-foreground mb-3">Featured Quest</h3>
      <motion.div
        className="p-4 rounded-xl border-2 border-emerald bg-potblack-surface relative overflow-hidden"
        animate={{
          boxShadow: [
            '0 0 20px rgba(53, 212, 117, 0.2)',
            '0 0 30px rgba(53, 212, 117, 0.3)',
            '0 0 20px rgba(53, 212, 117, 0.2)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-4 relative">
          {/* Quest Image */}
          <div className="w-full md:w-[100px] h-[80px] md:h-[100px] rounded-lg border-2 border-emerald bg-potblack flex items-center justify-center overflow-hidden">
            <Zap className="w-10 h-10 text-emerald" />
          </div>

          {/* Quest Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-lg text-foreground">{quest.name}</h4>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple/20 text-purple border border-purple/30 uppercase">
                {quest.category}
              </span>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < difficultyStars ? 'text-gold fill-gold' : 'text-gray-dark'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-light capitalize">{quest.difficulty} Difficulty</span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-light line-clamp-2">{quest.description}</p>

            {/* Rewards */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gold font-medium">+{quest.xpReward} XP</span>
              <span className="text-emerald font-medium">+{quest.goldReward} Gold</span>
              <span className="text-gray-light flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {quest.estimatedMinutes} min
              </span>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => {
                onStartQuest(quest);
                navigate('/');
              }}
              className="w-full md:w-auto mt-2 bg-emerald text-potblack font-display font-bold hover:bg-emerald/90"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Quest Now
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
