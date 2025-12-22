import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lock, Sparkles, Crown, Sword, Shield, Wand2, Skull } from 'lucide-react';

interface AvatarPreviewProps {
  avatarId: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  gender?: 'male' | 'female' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLocked?: boolean;
  isEquipped?: boolean;
  showGlow?: boolean;
  onClick?: () => void;
}

// Avatar visual configurations - anime-style character representations
const avatarVisuals: Record<string, { icon: React.ReactNode; gradient: string; accent: string }> = {
  // Male avatars
  'avatar-male-warrior-basic': { 
    icon: <Sword className="w-full h-full" />, 
    gradient: 'from-stat-str/40 to-stat-str/20',
    accent: 'stat-str'
  },
  'avatar-male-mage-basic': { 
    icon: <Wand2 className="w-full h-full" />, 
    gradient: 'from-stat-int/40 to-stat-int/20',
    accent: 'stat-int'
  },
  'avatar-male-rogue-basic': { 
    icon: <span className="text-4xl">🗡️</span>, 
    gradient: 'from-secondary/40 to-secondary/20',
    accent: 'secondary'
  },
  'avatar-male-knight': { 
    icon: <Shield className="w-full h-full" />, 
    gradient: 'from-stat-end/40 to-stat-end/20',
    accent: 'stat-end'
  },
  'avatar-male-samurai': { 
    icon: <span className="text-4xl">⚔️</span>, 
    gradient: 'from-stat-str/50 to-primary/30',
    accent: 'stat-str'
  },
  'avatar-male-ninja': { 
    icon: <span className="text-4xl">🥷</span>, 
    gradient: 'from-secondary/50 to-muted/30',
    accent: 'secondary'
  },
  'avatar-male-cyber': { 
    icon: <span className="text-4xl">🤖</span>, 
    gradient: 'from-primary/50 to-stat-int/30',
    accent: 'primary'
  },
  'avatar-male-demon': { 
    icon: <Skull className="w-full h-full" />, 
    gradient: 'from-destructive/50 to-secondary/30',
    accent: 'destructive'
  },
  'avatar-male-hunter-elite': { 
    icon: <span className="text-4xl">🏹</span>, 
    gradient: 'from-stat-end/50 to-primary/30',
    accent: 'stat-end'
  },
  'avatar-male-shadow-knight': { 
    icon: <span className="text-4xl">⚔️</span>, 
    gradient: 'from-secondary/60 to-muted/20',
    accent: 'secondary'
  },
  'avatar-male-dragon-slayer': { 
    icon: <span className="text-4xl">🐉</span>, 
    gradient: 'from-accent/60 to-stat-str/30',
    accent: 'accent'
  },
  'avatar-male-monarch': { 
    icon: <Crown className="w-full h-full" />, 
    gradient: 'from-secondary/70 to-primary/40',
    accent: 'secondary'
  },
  
  // Female avatars
  'avatar-female-warrior-basic': { 
    icon: <Sword className="w-full h-full" />, 
    gradient: 'from-stat-str/40 to-stat-str/20',
    accent: 'stat-str'
  },
  'avatar-female-mage-basic': { 
    icon: <Wand2 className="w-full h-full" />, 
    gradient: 'from-stat-int/40 to-stat-int/20',
    accent: 'stat-int'
  },
  'avatar-female-rogue-basic': { 
    icon: <span className="text-4xl">🗡️</span>, 
    gradient: 'from-secondary/40 to-secondary/20',
    accent: 'secondary'
  },
  'avatar-female-valkyrie': { 
    icon: <span className="text-4xl">🪽</span>, 
    gradient: 'from-primary/50 to-stat-int/30',
    accent: 'primary'
  },
  'avatar-female-kunoichi': { 
    icon: <span className="text-4xl">🥷</span>, 
    gradient: 'from-secondary/50 to-muted/30',
    accent: 'secondary'
  },
  'avatar-female-sorceress': { 
    icon: <Sparkles className="w-full h-full" />, 
    gradient: 'from-secondary/60 to-stat-wil/30',
    accent: 'secondary'
  },
  'avatar-female-cyber': { 
    icon: <span className="text-4xl">🤖</span>, 
    gradient: 'from-primary/50 to-stat-int/30',
    accent: 'primary'
  },
  'avatar-female-phoenix': { 
    icon: <span className="text-4xl">🔥</span>, 
    gradient: 'from-accent/60 to-stat-str/30',
    accent: 'accent'
  },
  'avatar-female-hunter-elite': { 
    icon: <span className="text-4xl">🏹</span>, 
    gradient: 'from-stat-end/50 to-primary/30',
    accent: 'stat-end'
  },
  'avatar-female-shadow-priestess': { 
    icon: <span className="text-4xl">✨</span>, 
    gradient: 'from-secondary/60 to-muted/20',
    accent: 'secondary'
  },
  'avatar-female-dragon-tamer': { 
    icon: <span className="text-4xl">🐲</span>, 
    gradient: 'from-accent/60 to-stat-str/30',
    accent: 'accent'
  },
  'avatar-female-empress': { 
    icon: <Crown className="w-full h-full" />, 
    gradient: 'from-secondary/70 to-primary/40',
    accent: 'secondary'
  },
  
  // Neutral avatars
  'avatar-neutral-ghost': { 
    icon: <span className="text-4xl">👻</span>, 
    gradient: 'from-muted/60 to-secondary/30',
    accent: 'muted-foreground'
  },
  'avatar-neutral-robot': { 
    icon: <span className="text-4xl">🤖</span>, 
    gradient: 'from-primary/50 to-stat-int/30',
    accent: 'primary'
  },
  'avatar-neutral-beast': { 
    icon: <span className="text-4xl">🐺</span>, 
    gradient: 'from-secondary/60 to-stat-str/30',
    accent: 'secondary'
  },
  'avatar-neutral-ancient': { 
    icon: <span className="text-4xl">🗿</span>, 
    gradient: 'from-accent/70 to-secondary/40',
    accent: 'accent'
  },
};

const defaultVisual = { 
  icon: <span className="text-4xl">⚔️</span>, 
  gradient: 'from-primary/40 to-secondary/20',
  accent: 'primary'
};

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
};

const iconSizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
  xl: 'w-12 h-12',
};

export function AvatarPreview({
  avatarId,
  name,
  rarity,
  gender,
  size = 'md',
  isLocked = false,
  isEquipped = false,
  showGlow = false,
  onClick,
}: AvatarPreviewProps) {
  const visual = avatarVisuals[avatarId] || defaultVisual;
  
  const rarityStyles = {
    common: 'ring-muted-foreground/50',
    uncommon: 'ring-stat-end/50',
    rare: 'ring-stat-int/50',
    legendary: 'ring-accent/70',
  };

  const rarityGlow = {
    common: '',
    uncommon: 'shadow-[0_0_15px_hsl(var(--stat-end)/0.3)]',
    rare: 'shadow-[0_0_20px_hsl(var(--stat-int)/0.4)]',
    legendary: 'shadow-[0_0_25px_hsl(var(--accent)/0.5)]',
  };

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.05 }}
      whileTap={{ scale: isLocked ? 1 : 0.95 }}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'relative rounded-full cursor-pointer transition-all duration-300',
        sizeClasses[size],
        isLocked && 'opacity-50 grayscale cursor-not-allowed',
        isEquipped && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        showGlow && !isLocked && rarityGlow[rarity]
      )}
    >
      {/* Background gradient */}
      <div className={cn(
        'absolute inset-0 rounded-full bg-gradient-to-br',
        visual.gradient
      )} />
      
      {/* Rarity ring */}
      <div className={cn(
        'absolute inset-0 rounded-full ring-2',
        rarityStyles[rarity]
      )} />
      
      {/* Icon/Visual */}
      <div className={cn(
        'absolute inset-0 flex items-center justify-center',
        iconSizeClasses[size]
      )}>
        <div className={cn('flex items-center justify-center', iconSizeClasses[size])}>
          {visual.icon}
        </div>
      </div>
      
      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 rounded-full bg-background/60 flex items-center justify-center">
          <Lock className="w-1/3 h-1/3 text-muted-foreground" />
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
      
      {/* Legendary sparkle effect */}
      {rarity === 'legendary' && !isLocked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ 
            boxShadow: [
              '0 0 20px hsl(var(--accent)/0.3)',
              '0 0 30px hsl(var(--accent)/0.5)',
              '0 0 20px hsl(var(--accent)/0.3)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

// Cosmetic item preview for non-avatar items
interface CosmeticPreviewProps {
  category: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  size?: 'sm' | 'md' | 'lg';
}

const categoryIcons: Record<string, string> = {
  outfits: '👕',
  weapons: '⚔️',
  auras: '✨',
  name_colors: '🎨',
  frames: '🖼️',
};

export function CosmeticPreview({ category, name, rarity, size = 'md' }: CosmeticPreviewProps) {
  const sizeMap = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const rarityBg = {
    common: 'bg-muted',
    uncommon: 'bg-gradient-to-br from-stat-end/30 to-stat-end/10',
    rare: 'bg-gradient-to-br from-stat-int/30 to-stat-int/10',
    legendary: 'bg-gradient-to-br from-accent/40 to-accent/20',
  };

  return (
    <div className={cn(
      'rounded-lg flex items-center justify-center',
      sizeMap[size],
      rarityBg[rarity]
    )}>
      <span>{categoryIcons[category] || '📦'}</span>
    </div>
  );
}
