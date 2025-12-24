import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Search, X, Check, Clock, UserMinus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  username: string;
  level: number;
  active_title?: string;
}

interface SearchResult {
  id: string;
  username: string;
  level: number;
}

interface FriendRequest {
  id: string;
  from_user_id: string;
  from_username?: string;
  created_at: string;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // Fetch friends
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
      fetchSentRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', user.id);
    
    if (data && data.length > 0) {
      const friendIds = data.map(f => f.friend_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, level, active_title')
        .in('id', friendIds);
      if (profiles) setFriends(profiles);
    } else {
      setFriends([]);
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('friend_requests')
      .select('id, from_user_id, created_at')
      .eq('to_user_id', user.id);
    
    if (data && data.length > 0) {
      // Fetch usernames for the requests
      const fromUserIds = data.map(r => r.from_user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', fromUserIds);
      
      const requestsWithNames = data.map(req => ({
        ...req,
        from_username: profiles?.find(p => p.id === req.from_user_id)?.username || 'Unknown'
      }));
      setPendingRequests(requestsWithNames);
    } else {
      setPendingRequests([]);
    }
  };

  const fetchSentRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('friend_requests')
      .select('to_user_id')
      .eq('from_user_id', user.id);
    
    if (data) {
      setSentRequests(data.map(r => r.to_user_id));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, level')
      .ilike('username', `%${searchQuery}%`)
      .neq('id', user.id)
      .limit(10);
    
    if (error) {
      toast({ title: 'Search failed', variant: 'destructive' });
    } else {
      // Filter out existing friends
      const friendIds = friends.map(f => f.id);
      const filtered = data?.filter(p => !friendIds.includes(p.id)) || [];
      setSearchResults(filtered);
    }
    setSearching(false);
  };

  const sendFriendRequest = async (toUserId: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId
      });
    
    if (error) {
      if (error.code === '23505') {
        toast({ title: 'Request already sent', variant: 'destructive' });
      } else {
        toast({ title: 'Failed to send request', variant: 'destructive' });
      }
    } else {
      toast({ title: 'Friend request sent!' });
      setSentRequests(prev => [...prev, toUserId]);
    }
  };

  const acceptRequest = async (request: FriendRequest) => {
    if (!user) return;
    
    // Use database function to handle friend acceptance (bypasses RLS for bidirectional insert)
    const { data, error } = await supabase.rpc('accept_friend_request', {
      request_id: request.id
    });
    
    if (error || !data) {
      toast({ title: 'Failed to accept request', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Friend added!' });
    fetchFriends();
    fetchPendingRequests();
  };

  const declineRequest = async (requestId: string) => {
    await supabase
      .from('friend_requests')
      .delete()
      .eq('id', requestId);
    
    toast({ title: 'Request declined' });
    fetchPendingRequests();
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;
    
    // Remove both directions
    await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);
    
    toast({ title: 'Friend removed' });
    fetchFriends();
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">Friends</h1>
        <Button size="sm" variant="outline" onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </motion.div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="card-game p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                    <span className="font-bold text-sm text-primary-foreground">
                      {request.from_username?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{request.from_username}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => declineRequest(request.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptRequest(request)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Friends List */}
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
              <div 
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                onClick={() => navigate(`/friends/${friend.id}`)}
              >
                <span className="font-bold text-primary-foreground">{friend.username.slice(0, 2).toUpperCase()}</span>
              </div>
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/friends/${friend.id}`)}
              >
                <p className="font-semibold text-foreground hover:text-primary transition-colors">{friend.username}</p>
                <p className="text-xs text-muted-foreground">Level {friend.level} • {friend.active_title || 'Hunter'}</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => navigate(`/friends/${friend.id}`)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => removeFriend(friend.id)}
              >
                <UserMinus className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Friend Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              onClick={() => setShowAddModal(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] w-full max-w-md mx-auto bg-card border-t border-border rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold text-foreground">Add Friend</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-muted">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Search Input */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username..."
                  className="bg-muted border-border"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Results */}
              <div className="space-y-2">
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-center text-muted-foreground py-4">No users found</p>
                )}
                {searchResults.map((result) => {
                  const hasSentRequest = sentRequests.includes(result.id);
                  return (
                    <div
                      key={result.id}
                      className="card-game p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="font-bold text-sm text-primary-foreground">
                            {result.username.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{result.username}</p>
                          <p className="text-xs text-muted-foreground">Level {result.level}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={hasSentRequest ? 'secondary' : 'default'}
                        disabled={hasSentRequest}
                        onClick={() => sendFriendRequest(result.id)}
                      >
                        {hasSentRequest ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Sent
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
