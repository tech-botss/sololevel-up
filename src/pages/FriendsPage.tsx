import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Friend {
  id: string;
  username: string;
  level: number;
  active_title?: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id)
        .then(async ({ data }) => {
          if (data && data.length > 0) {
            const friendIds = data.map(f => f.friend_id);
            const { data: profiles } = await supabase
              .from('profiles')
              .select('id, username, level, active_title')
              .in('id', friendIds);
            if (profiles) setFriends(profiles);
          }
        });
    }
  }, [user]);

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

      {friends.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No friends yet. Add some hunters!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-game p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">{friend.username.slice(0, 2)}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{friend.username}</p>
                <p className="text-xs text-muted-foreground">Level {friend.level} • {friend.active_title || 'Hunter'}</p>
              </div>
              <Button size="sm" variant="ghost">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
