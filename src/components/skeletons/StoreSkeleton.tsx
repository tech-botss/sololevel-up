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

export function StoreItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-game p-3 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Avatar/Item preview placeholder */}
      <div className="flex justify-center mb-3">
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>
      
      {/* Name placeholder */}
      <div className="flex justify-center mb-1">
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Rarity badge placeholder */}
      <div className="flex justify-center mt-1 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      
      {/* Price and button row */}
      <div className="flex items-center justify-between mt-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-7 w-12 rounded-md" />
      </div>
    </motion.div>
  );
}

export function StorePageSkeleton() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-4"
      >
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </motion.div>

      {/* Category tabs skeleton */}
      <motion.div 
        className="flex gap-2 overflow-x-auto pb-3 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
        ))}
      </motion.div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <StoreItemSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
