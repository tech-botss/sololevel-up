import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Save, User, MapPin } from 'lucide-react';
import { countries } from '@/data/locations';
import { SearchableSelect } from '@/components/SearchableSelect';
import { z } from 'zod';

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed');

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, fetchProfile } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [originalUsername, setOriginalUsername] = useState('');

  // Load profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setOriginalUsername(profile.username);
      setGender(profile.gender || '');
      setCountry(profile.country || '');
      setState(profile.state || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  // Get sorted country options
  const countryOptions = useMemo(() => {
    return [...countries]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(c => ({ value: c.name, label: c.name }));
  }, []);

  // Get sorted state options based on selected country
  const stateOptions = useMemo(() => {
    if (!country) return [];
    const countryData = countries.find(l => l.name === country);
    return (countryData?.states || [])
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(s => ({ value: s.name, label: s.name }));
  }, [country]);

  // Get sorted city options based on selected state
  const cityOptions = useMemo(() => {
    if (!country || !state) return [];
    const countryData = countries.find(l => l.name === country);
    const stateData = countryData?.states.find(s => s.name === state);
    return (stateData?.cities || [])
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .map(c => ({ value: c, label: c }));
  }, [country, state]);

  // Reset state and city when country changes
  useEffect(() => {
    if (country && profile?.country !== country) {
      setState('');
      setCity('');
    }
  }, [country, profile?.country]);

  // Reset city when state changes
  useEffect(() => {
    if (state && profile?.state !== state) {
      setCity('');
    }
  }, [state, profile?.state]);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      // If username is the same as original, it's available
      if (username.toLowerCase() === originalUsername.toLowerCase()) {
        setUsernameAvailable(true);
        return;
      }

      if (username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      const result = usernameSchema.safeParse(username);
      if (!result.success) {
        setUsernameAvailable(null);
        return;
      }
      
      setCheckingUsername(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();
      
      setCheckingUsername(false);
      setUsernameAvailable(!data && !error);
    };

    const debounce = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounce);
  }, [username, originalUsername]);

  const handleSave = async () => {
    // Validate
    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      toast({ title: 'Invalid Username', description: usernameResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    
    if (!gender) {
      toast({ title: 'Missing Field', description: 'Please select your gender', variant: 'destructive' });
      return;
    }
    
    if (!country || !state || !city) {
      toast({ title: 'Missing Location', description: 'Please select your country, state, and city', variant: 'destructive' });
      return;
    }
    
    if (!usernameAvailable) {
      toast({ title: 'Username Taken', description: 'Please choose a different username', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.toLowerCase(),
          gender,
          country,
          state,
          city,
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Refresh profile
      if (user) {
        await fetchProfile(user.id);
      }
      
      toast({ title: 'Profile Updated!', description: 'Your changes have been saved' });
      navigate('/profile');
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl font-bold text-foreground"
        >
          Edit Profile
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-game p-6 space-y-5"
      >
        {/* Username */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <User className="w-4 h-4" />
            Hunter Name
          </label>
          <div className="relative">
            <Input
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 pr-10"
              maxLength={20}
            />
            {checkingUsername && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
            {!checkingUsername && usernameAvailable === true && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">✓</span>
            )}
            {!checkingUsername && usernameAvailable === false && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">✗</span>
            )}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          
          {/* Country */}
          <div className="mb-3">
            <SearchableSelect
              options={countryOptions}
              value={country}
              onValueChange={setCountry}
              placeholder="Select country"
              searchPlaceholder="Search countries..."
              className="h-12"
            />
          </div>

          {/* State */}
          <div className="mb-3">
            <SearchableSelect
              options={stateOptions}
              value={state}
              onValueChange={setState}
              placeholder="Select state/province"
              searchPlaceholder="Search states..."
              disabled={!country}
              className="h-12"
            />
          </div>

          {/* City */}
          <div>
            <SearchableSelect
              options={cityOptions}
              value={city}
              onValueChange={setCity}
              placeholder="Select city"
              searchPlaceholder="Search cities..."
              disabled={!state}
              className="h-12"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={loading || !username || !gender || !country || !state || !city || !usernameAvailable}
          className="w-full h-12"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
