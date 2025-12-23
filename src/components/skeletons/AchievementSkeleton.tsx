import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={cn('bg-muted rounded-md', className)}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function AchievementCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-game p-4 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Icon placeholder */}
      <div className="flex justify-center mb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      
      {/* Name placeholder */}
      <div className="flex justify-center mb-2">
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Description placeholder */}
      <div className="space-y-1 mb-2">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-3/4 mx-auto" />
      </div>
      
      {/* Rarity badge placeholder */}
      <div className="flex justify-center mb-2">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      
      {/* Progress bar placeholder */}
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <Skeleton className="h-2 w-12" />
          <Skeleton className="h-2 w-8" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </motion.div>
  );
}

export function AchievementsPageSkeleton() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-1/4 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </motion.div>

      {/* Progress bar skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex justify-between mb-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </motion.div>

      {/* Category filter skeleton */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full flex-shrink-0" />
        ))}
      </motion.div>

      {/* Status filter skeleton */}
      <motion.div 
        className="flex gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </motion.div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
          >
            <AchievementCardSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
