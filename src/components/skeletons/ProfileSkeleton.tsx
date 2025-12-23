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

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 relative overflow-hidden">
      {/* Background glow */}
      <motion.div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Header skeleton */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </motion.div>

      {/* Avatar card skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-game p-6 text-center mb-4 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="flex justify-center mb-4">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <div className="flex justify-center mb-2">
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex justify-center mb-2">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-center mt-2">
          <Skeleton className="h-3 w-32" />
        </div>
      </motion.div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="card-game p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-7 w-20 mb-1" />
            <Skeleton className="h-2.5 w-16" />
          </motion.div>
        ))}
      </div>

      {/* Character stats skeleton */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-game p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
        
        <div className="flex justify-center mb-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
        </div>
        
        {/* Radar chart placeholder */}
        <div className="flex justify-center">
          <Skeleton className="w-60 h-60 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
