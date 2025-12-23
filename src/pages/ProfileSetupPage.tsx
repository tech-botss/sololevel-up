import { useState, useEffect, useMemo } from 'react';
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
import { SearchableSelect } from '@/components/SearchableSelect';
import { z } from 'zod';
import { FloatingParticles, GlowOrb } from '@/components/animations';

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed');

const formFieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  }),
};

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
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

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
    setState('');
    setCity('');
  }, [country]);

  // Reset city when state changes
  useEffect(() => {
    setCity('');
  }, [state]);

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background effects */}
      <FloatingParticles count={30} color="mixed" size="sm" speed="slow" />
      <GlowOrb color="primary" position="top-left" size="lg" />
      <GlowOrb color="accent" position="bottom-right" size="md" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.3), transparent)',
              }}
            />
            <Sparkles className="w-10 h-10 text-primary-foreground relative z-10" />
          </motion.div>
          <motion.h1 
            className="font-display text-2xl font-bold text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create Your Hunter Profile
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Set up your identity before entering the ranks
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="card-game-glow p-6 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ boxShadow: '0 0 50px hsl(var(--primary) / 0.3)' }}
        >
          {/* Username */}
          <motion.div
            custom={0}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <User className="w-4 h-4" />
              Hunter Name
            </label>
            <div className="relative">
              <Input
                placeholder="Choose a unique username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 pr-10 transition-all focus:ring-2 focus:ring-primary/50"
                maxLength={20}
              />
              {checkingUsername && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {!checkingUsername && usernameAvailable === true && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                >
                  ✓
                </motion.span>
              )}
              {!checkingUsername && usernameAvailable === false && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive animate-shake"
                >
                  ✗
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div
            custom={1}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-12 transition-all focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Location */}
          <motion.div
            custom={2}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
          >
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
            <motion.div 
              className="mb-3"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: country ? 1 : 0.5 }}
            >
              <SearchableSelect
                options={stateOptions}
                value={state}
                onValueChange={setState}
                placeholder="Select state/province"
                searchPlaceholder="Search states..."
                disabled={!country}
                className="h-12"
              />
            </motion.div>

            {/* City */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: state ? 1 : 0.5 }}
            >
              <SearchableSelect
                options={cityOptions}
                value={city}
                onValueChange={setCity}
                placeholder="Select city"
                searchPlaceholder="Search cities..."
                disabled={!state}
                className="h-12"
              />
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            custom={3}
            variants={formFieldVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={loading || !username || !gender || !country || !state || !city || !usernameAvailable}
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold text-primary-foreground relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Enter the Ranks
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
