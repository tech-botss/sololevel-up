import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { mockUsers } from '@/data/mockUsers';
import { UserPlus, MessageCircle, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FriendsPage() {
  const { user, acceptFriendRequest, rejectFriendRequest, removeFriend } = useGameStore();
  
  const friends = mockUsers.filter(u => user.friends.includes(u.id));

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Friends</h1>
        <Button size="sm" variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </motion.div>

      {/* Friend Requests */}
      {user.friendRequests.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">Requests</h2>
          {user.friendRequests.map((request) => (
            <div key={request.fromUserId} className="card-game p-3 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-bold">{request.fromUsername.slice(0, 2)}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{request.fromUsername}</p>
              </div>
              <Button size="sm" onClick={() => acceptFriendRequest(request.fromUserId)}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => rejectFriendRequest(request.fromUserId)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Friends List */}
      <div className="space-y-2">
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-game p-4 flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">{friend.username.slice(0, 2)}</span>
              </div>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                friend.isOnline ? 'bg-status-online' : 'bg-status-offline'
              )} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{friend.username}</p>
              <p className="text-xs text-muted-foreground">Level {friend.level} • {friend.activeTitle}</p>
            </div>
            <Button size="sm" variant="ghost">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
