import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, MapPin, Sparkles } from 'lucide-react';
import { countries } from '@/data/locations';
import { z } from 'zod';

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed');

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Update states when country changes
  useEffect(() => {
    if (country) {
      const countryData = countries.find(l => l.name === country);
      const stateNames = countryData?.states.map(s => s.name) || [];
      setStates(stateNames.slice().sort((a, b) => a.localeCompare(b)));
      setState('');
      setCity('');
      setCities([]);
    }
  }, [country]);

  // Update cities when state changes
  useEffect(() => {
    if (country && state) {
      const countryData = countries.find(l => l.name === country);
      const stateData = countryData?.states.find(s => s.name === state);
      const cityNames = stateData?.cities || [];
      setCities(cityNames.slice().sort((a, b) => a.localeCompare(b)));
      setCity('');
    }
  }, [country, state]);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
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
  }, [username]);

  const handleSubmit = async () => {
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
      
      toast({ title: 'Profile Created!', description: 'Welcome to SoloRank, Hunter!' });
      navigate('/');
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Create Your Hunter Profile</h1>
          <p className="text-muted-foreground text-sm">Set up your identity before entering the ranks</p>
        </div>

        {/* Form Card */}
        <div className="card-game-glow p-6 space-y-5">
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
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="h-12 mb-3">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {[...countries].sort((a, b) => a.name.localeCompare(b.name)).map(loc => (
                  <SelectItem key={loc.code} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* State */}
            <Select value={state} onValueChange={setState} disabled={!country}>
              <SelectTrigger className="h-12 mb-3">
                <SelectValue placeholder="Select state/province" />
              </SelectTrigger>
              <SelectContent>
                {states.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* City */}
            <Select value={city} onValueChange={setCity} disabled={!state}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !username || !gender || !country || !state || !city || !usernameAvailable}
            className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold text-primary-foreground"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Enter the Ranks
                <Sparkles className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
