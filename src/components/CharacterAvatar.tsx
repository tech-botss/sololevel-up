import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Sparkles, User } from 'lucide-react';
import { Character, CharacterTier, TIER_GLOW, TIER_NAMES, isTierUnlocked } from '@/types/character';

interface CharacterAvatarProps {
  character: Character;
  tier?: CharacterTier;
  playerLevel?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLocked?: boolean;
  isEquipped?: boolean;
  showGlow?: boolean;
  showTierBadge?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-12 h-16',
  md: 'w-16 h-22',
  lg: 'w-20 h-28',
  xl: 'w-28 h-40',
  '2xl': 'w-36 h-52',
};

const imageSizeClasses = {
  sm: 'w-12 h-16',
  md: 'w-16 h-22',
  lg: 'w-20 h-28',
  xl: 'w-28 h-40',
  '2xl': 'w-36 h-52',
};

// Fallback gradient colors based on archetype
const archetypeGradients: Record<string, string> = {
  balanced: 'from-primary/40 to-primary/20',
  athletic: 'from-cyan-500/40 to-cyan-600/20',
  intellectual: 'from-purple-500/40 to-purple-600/20',
  adventurer: 'from-green-600/40 to-green-700/20',
  monk: 'from-gray-400/40 to-gray-500/20',
  paladin: 'from-slate-300/40 to-slate-400/20',
  berserker: 'from-red-600/40 to-red-700/20',
  shadow: 'from-purple-900/50 to-gray-900/30',
  tech: 'from-cyan-400/40 to-blue-600/20',
  dragon: 'from-indigo-600/40 to-purple-700/20',
};

// Glow styles for each tier
const tierGlowStyles: Record<CharacterTier, string> = {
  0: '', // No glow for beginner
  5: 'shadow-[0_0_15px_hsl(var(--primary)/0.3)]', // Subtle cyan glow
  9: 'shadow-[0_0_30px_hsl(var(--primary)/0.5),0_0_60px_hsl(var(--primary)/0.3)]', // Intense cyan glow
};

export function CharacterAvatar({
  character,
  tier = 0,
  playerLevel = 1,
  size = 'md',
  isLocked = false,
  isEquipped = false,
  showGlow = false,
  showTierBadge = false,
  onClick,
}: CharacterAvatarProps) {
  // Get the appropriate tier image or fallback
  const tierKey = `tier${tier}` as keyof typeof character.images;
  const imageUrl = character.images[tierKey];
  const hasImage = !!imageUrl;
  
  // Check if this tier is unlocked for the player
  const tierUnlocked = isTierUnlocked(playerLevel, tier);
  const effectivelyLocked = isLocked || !tierUnlocked;
  
  // Get gradient for fallback display
  const gradient = archetypeGradients[character.archetype] || archetypeGradients.balanced;
  
  // Get glow style based on tier
  const glowStyle = showGlow && !effectivelyLocked ? tierGlowStyles[tier] : '';
  
  return (
    <motion.div
      whileHover={{ scale: effectivelyLocked ? 1 : 1.05 }}
      whileTap={{ scale: effectivelyLocked ? 1 : 0.95 }}
      onClick={!effectivelyLocked ? onClick : undefined}
      className={cn(
        'relative rounded-lg cursor-pointer transition-all duration-300 overflow-hidden',
        sizeClasses[size],
        effectivelyLocked && 'opacity-50 grayscale cursor-not-allowed',
        isEquipped && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        glowStyle
      )}
    >
      {/* Background / Image */}
      {hasImage ? (
        <img
          src={imageUrl}
          alt={`${character.name} - ${TIER_NAMES[tier]}`}
          className={cn(
            'w-full h-full object-cover rounded-lg',
            imageSizeClasses[size]
          )}
        />
      ) : (
        // Fallback gradient with icon
        <div className={cn(
          'w-full h-full rounded-lg bg-gradient-to-br flex flex-col items-center justify-center',
          gradient
        )}>
          <User className="w-1/3 h-1/3 text-foreground/70" />
          <span className="text-[10px] text-foreground/60 mt-1 font-medium">
            {character.name.slice(0, 6)}
          </span>
        </div>
      )}
      
      {/* Tier glow overlay for higher tiers */}
      {tier >= 5 && !effectivelyLocked && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: tier === 9 
              ? [
                  'inset 0 0 20px hsl(var(--primary)/0.2)',
                  'inset 0 0 40px hsl(var(--primary)/0.4)',
                  'inset 0 0 20px hsl(var(--primary)/0.2)'
                ]
              : [
                  'inset 0 0 10px hsl(var(--primary)/0.1)',
                  'inset 0 0 20px hsl(var(--primary)/0.2)',
                  'inset 0 0 10px hsl(var(--primary)/0.1)'
                ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Locked overlay */}
      {effectivelyLocked && (
        <div className="absolute inset-0 rounded-lg bg-background/60 flex items-center justify-center">
          <Lock className="w-1/4 h-1/4 text-muted-foreground" />
        </div>
      )}
      
      {/* Equipped indicator */}
      {isEquipped && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <span className="text-[10px]">✓</span>
        </motion.div>
      )}
      
      {/* Tier badge */}
      {showTierBadge && (
        <div className={cn(
          'absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold',
          tier === 0 && 'bg-gray-600/80 text-gray-200',
          tier === 5 && 'bg-primary/80 text-primary-foreground',
          tier === 9 && 'bg-gradient-to-r from-primary to-purple-500 text-white'
        )}>
          T{tier}
        </div>
      )}
      
      {/* Elite sparkle effect */}
      {tier === 9 && !effectivelyLocked && (
        <motion.div
          className="absolute top-1 right-1"
          animate={{ 
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3 text-primary" />
        </motion.div>
      )}
    </motion.div>
  );
}

// Tier selector component
interface TierSelectorProps {
  character: Character;
  currentTier: CharacterTier;
  playerLevel: number;
  onSelectTier: (tier: CharacterTier) => void;
}

export function TierSelector({
  character,
  currentTier,
  playerLevel,
  onSelectTier,
}: TierSelectorProps) {
  const tiers: CharacterTier[] = [0, 5, 9];
  
  return (
    <div className="flex gap-2 justify-center">
      {tiers.map((tier) => {
        const unlocked = isTierUnlocked(playerLevel, tier);
        const isActive = currentTier === tier;
        
        return (
          <motion.button
            key={tier}
            onClick={() => unlocked && onSelectTier(tier)}
            whileHover={unlocked ? { scale: 1.1 } : undefined}
            whileTap={unlocked ? { scale: 0.95 } : undefined}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
              isActive && 'bg-primary text-primary-foreground shadow-glow-primary',
              !isActive && unlocked && 'bg-muted text-muted-foreground hover:bg-muted/80',
              !unlocked && 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
            )}
            disabled={!unlocked}
          >
            <div className="flex items-center gap-1">
              {!unlocked && <Lock className="w-3 h-3" />}
              <span>{TIER_NAMES[tier]}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// Character card for shop/selection
interface CharacterCardProps {
  character: Character;
  playerLevel: number;
  isOwned: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function CharacterCard({
  character,
  playerLevel,
  isOwned,
  isSelected,
  onSelect,
}: CharacterCardProps) {
  const isLocked = character.unlockType === 'level' && 
    character.unlockLevel && 
    playerLevel < character.unlockLevel;
  
  const highestUnlockedTier = isTierUnlocked(playerLevel, 9) ? 9 : 
                              isTierUnlocked(playerLevel, 5) ? 5 : 0;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={!isLocked ? onSelect : undefined}
      className={cn(
        'card-game p-3 cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary',
        isLocked && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex justify-center mb-2">
        <CharacterAvatar
          character={character}
          tier={highestUnlockedTier}
          playerLevel={playerLevel}
          size="lg"
          isLocked={isLocked}
          isEquipped={isSelected}
          showGlow={isOwned}
          showTierBadge
        />
      </div>
      
      <h3 className="font-display text-sm font-bold text-center text-foreground">
        {character.name}
      </h3>
      
      <p className="text-[10px] text-muted-foreground text-center capitalize">
        {character.archetype}
      </p>
      
      <div className="flex justify-center mt-2">
        {isLocked ? (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Lv.{character.unlockLevel}
          </span>
        ) : character.price ? (
          <span className="text-xs text-primary font-semibold">
            {character.price} Gold
          </span>
        ) : (
          <span className="text-xs text-green-500 font-semibold">
            Free
          </span>
        )}
      </div>
    </motion.div>
  );
}
