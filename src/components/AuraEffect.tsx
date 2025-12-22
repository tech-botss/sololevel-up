import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AuraType = 'none' | 'basic' | 'blue' | 'shadow' | 'monarch' | 'electric' | 'golden';

interface AuraEffectProps {
  type: AuraType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const auraConfigs: Record<AuraType, { 
  colors: string[]; 
  animation: string;
  blur: string;
  opacity: number;
  layers: number;
}> = {
  none: { colors: [], animation: '', blur: '', opacity: 0, layers: 0 },
  basic: {
    colors: ['hsl(189, 94%, 53%)', 'hsl(189, 94%, 43%)'],
    animation: 'aura-pulse',
    blur: 'blur-lg',
    opacity: 0.4,
    layers: 2,
  },
  blue: {
    colors: ['hsl(217, 91%, 60%)', 'hsl(189, 94%, 53%)', 'hsl(230, 80%, 65%)'],
    animation: 'aura-flame',
    blur: 'blur-xl',
    opacity: 0.5,
    layers: 3,
  },
  shadow: {
    colors: ['hsl(263, 70%, 30%)', 'hsl(263, 70%, 50%)', 'hsl(280, 60%, 40%)'],
    animation: 'aura-shadow',
    blur: 'blur-2xl',
    opacity: 0.6,
    layers: 4,
  },
  monarch: {
    colors: ['hsl(263, 70%, 50%)', 'hsl(189, 94%, 53%)', 'hsl(280, 80%, 60%)', 'hsl(220, 90%, 55%)'],
    animation: 'aura-monarch',
    blur: 'blur-2xl',
    opacity: 0.7,
    layers: 5,
  },
  electric: {
    colors: ['hsl(50, 100%, 60%)', 'hsl(45, 100%, 50%)', 'hsl(200, 100%, 60%)'],
    animation: 'aura-electric',
    blur: 'blur-xl',
    opacity: 0.55,
    layers: 3,
  },
  golden: {
    colors: ['hsl(43, 74%, 49%)', 'hsl(38, 92%, 60%)', 'hsl(50, 100%, 70%)'],
    animation: 'aura-golden',
    blur: 'blur-2xl',
    opacity: 0.6,
    layers: 4,
  },
};

const sizeClasses = {
  sm: 'scale-100',
  md: 'scale-110',
  lg: 'scale-125',
  xl: 'scale-150',
};

export function AuraEffect({ type, size = 'md', children, className }: AuraEffectProps) {
  const config = auraConfigs[type];

  if (type === 'none' || config.layers === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Aura layers */}
      {Array.from({ length: config.layers }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'absolute inset-0 rounded-full',
            config.blur,
            sizeClasses[size]
          )}
          style={{
            background: `radial-gradient(circle, ${config.colors[index % config.colors.length]} 0%, transparent 70%)`,
            opacity: config.opacity - (index * 0.1),
          }}
          animate={{
            scale: [1, 1.1 + (index * 0.05), 1],
            opacity: [config.opacity - (index * 0.1), config.opacity - (index * 0.05), config.opacity - (index * 0.1)],
            rotate: type === 'monarch' ? [0, 360] : [0, index % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 2 + (index * 0.5),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        />
      ))}

      {/* Electric sparks for electric aura */}
      {type === 'electric' && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute w-1 h-1 rounded-full bg-yellow-300"
              style={{
                left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 45}%`,
                top: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 45}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                delay: i * 0.15,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </>
      )}

      {/* Shadow tendrils for shadow aura */}
      {type === 'shadow' && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`tendril-${i}`}
              className="absolute w-2 h-8 rounded-full"
              style={{
                background: 'linear-gradient(to top, hsl(263, 70%, 50%), transparent)',
                left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 35}%`,
                top: `${50 + Math.sin((i * 45 * Math.PI) / 180) * 35}%`,
                transformOrigin: 'bottom center',
                rotate: `${i * 45}deg`,
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}

      {/* Monarch particles */}
      {type === 'monarch' && (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: i % 2 === 0 ? 'hsl(263, 70%, 60%)' : 'hsl(189, 94%, 53%)',
                boxShadow: `0 0 6px ${i % 2 === 0 ? 'hsl(263, 70%, 60%)' : 'hsl(189, 94%, 53%)'}`,
              }}
              animate={{
                x: [0, Math.cos((i * 30 * Math.PI) / 180) * 60, 0],
                y: [0, Math.sin((i * 30 * Math.PI) / 180) * 60, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.15,
              }}
            />
          ))}
        </>
      )}

      {/* Golden light rays */}
      {type === 'golden' && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`ray-${i}`}
              className="absolute w-0.5 h-16 origin-bottom"
              style={{
                background: 'linear-gradient(to top, hsl(43, 74%, 49%), hsl(43, 74%, 70%), transparent)',
                left: '50%',
                bottom: '50%',
                rotate: `${i * 45}deg`,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Aura preview for store
export function AuraPreview({ 
  auraId, 
  size = 'md' 
}: { 
  auraId: string; 
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const auraType = getAuraTypeFromId(auraId);
  
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  return (
    <AuraEffect type={auraType} size={size}>
      <div className={cn(
        sizeMap[size],
        'rounded-full bg-gradient-to-br from-muted to-card flex items-center justify-center'
      )}>
        <span className="text-2xl">✨</span>
      </div>
    </AuraEffect>
  );
}

export function getAuraTypeFromId(auraId: string): AuraType {
  if (auraId.includes('basic')) return 'basic';
  if (auraId.includes('blue') || auraId.includes('azure')) return 'blue';
  if (auraId.includes('shadow')) return 'shadow';
  if (auraId.includes('monarch')) return 'monarch';
  if (auraId.includes('electric') || auraId.includes('lightning')) return 'electric';
  if (auraId.includes('golden') || auraId.includes('gold')) return 'golden';
  return 'none';
}
