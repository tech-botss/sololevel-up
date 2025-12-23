import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Phone, ArrowRight, Loader2, Shield, Eye, EyeOff, User, MapPin, AlertCircle, UserCircle } from 'lucide-react';
import { PhoneInput } from '@/components/PhoneInput';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { countries } from '@/data/locations';
import { SearchableSelect } from '@/components/SearchableSelect';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be less than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores');

type AuthTab = 'login' | 'register';
type LoginMethod = 'email' | 'phone';
type AuthStep = 'input' | 'otp' | 'forgot-password' | 'reset-sent';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [step, setStep] = useState<AuthStep>('input');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  
  // Register fields (includes profile)
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [regMethod, setRegMethod] = useState<LoginMethod>('email');
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');
  const [regOtp, setRegOtp] = useState('');
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

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

  // Social login handlers
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          toast({ 
            title: 'Google Login Not Configured', 
            description: 'Please configure Google OAuth in your backend settings first.',
            variant: 'destructive' 
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          toast({ 
            title: 'Facebook Login Not Configured', 
            description: 'Please configure Facebook OAuth in your backend settings first.',
            variant: 'destructive' 
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        if (error.message.includes('provider is not enabled')) {
          toast({ 
            title: 'Apple Login Not Configured', 
            description: 'Please configure Apple OAuth in your backend settings first.',
            variant: 'destructive' 
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Guest login (anonymous)
  const handleGuestLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      
      // Guest users always need to set up their profile
      toast({ title: 'Welcome, Guest!', description: 'Please set up your profile to continue' });
      navigate('/profile-setup');
    } catch (error: any) {
      toast({ title: 'Guest Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Email/Password login
  const handleEmailLogin = async () => {
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast({ title: 'Invalid email', description: emailResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) {
      toast({ title: 'Invalid password', description: passResult.error.errors[0].message, variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Check if profile is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, country, city')
        .eq('id', data.user?.id)
        .maybeSingle();
      
      if (!profile || !profile.username || profile.username.startsWith('hunter_') || !profile.country) {
        navigate('/profile-setup');
      } else {
        toast({ title: 'Welcome back!', description: 'Successfully logged in' });
        navigate('/');
      }
    } catch (error: any) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    const emailResult = emailSchema.safeParse(resetEmail);
    if (!emailResult.success) {
      toast({ title: 'Invalid email', description: emailResult.error.errors[0].message, variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) throw error;
      setStep('reset-sent');
      toast({ title: 'Email Sent!', description: 'Check your inbox for the reset link' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP login
  const handlePhoneOTP = async () => {
    if (!phone || !isValidPhoneNumber(phone)) {
      toast({ title: 'Invalid phone', description: 'Please enter a valid phone number with country code', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      toast({ title: 'OTP Sent!', description: 'Check your phone for the code' });
      setStep('otp');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Verify phone OTP for login
  const handleVerifyLoginOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter 6 digits', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      
      // Check profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, country, city')
        .eq('id', data.user?.id)
        .maybeSingle();
      
      if (!profile || !profile.username || profile.username.startsWith('hunter_') || !profile.country) {
        navigate('/profile-setup');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Register with email + profile
  const handleEmailRegister = async () => {
    // Validate all fields
    const emailResult = emailSchema.safeParse(regEmail);
    if (!emailResult.success) {
      toast({ title: 'Invalid email', description: emailResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    const passResult = passwordSchema.safeParse(regPassword);
    if (!passResult.success) {
      toast({ title: 'Invalid password', description: passResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    const userResult = usernameSchema.safeParse(username);
    if (!userResult.success) {
      toast({ title: 'Invalid username', description: userResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    if (!usernameAvailable) {
      toast({ title: 'Username taken', description: 'Choose a different username', variant: 'destructive' });
      return;
    }
    if (!gender || !country || !state || !city) {
      toast({ title: 'Missing fields', description: 'Please fill all profile fields', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username.toLowerCase(),
            gender,
            country,
            state,
            city,
          },
        },
      });
      
      if (error) throw error;
      
      // Update profile with the data
      if (data.user) {
        await supabase.from('profiles').update({
          username: username.toLowerCase(),
          gender,
          country,
          state,
          city,
        }).eq('id', data.user.id);
      }
      
      toast({ title: 'Account Created!', description: 'Welcome to SoloRank, Hunter!' });
      navigate('/');
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Register with phone + profile
  const handlePhoneRegister = async () => {
    if (!regPhone || !isValidPhoneNumber(regPhone)) {
      toast({ title: 'Invalid phone', description: 'Please enter a valid phone number with country code', variant: 'destructive' });
      return;
    }
    const userResult = usernameSchema.safeParse(username);
    if (!userResult.success) {
      toast({ title: 'Invalid username', description: userResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    if (!usernameAvailable) {
      toast({ title: 'Username taken', description: 'Choose a different username', variant: 'destructive' });
      return;
    }
    if (!gender || !country || !state || !city) {
      toast({ title: 'Missing fields', description: 'Please fill all profile fields', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ phone: regPhone });
      if (error) throw error;
      toast({ title: 'OTP Sent!', description: 'Check your phone for the code' });
      setRegStep('otp');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for registration
  const handleVerifyRegisterOTP = async () => {
    if (regOtp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter 6 digits', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        phone: regPhone,
        token: regOtp,
        type: 'sms',
      });
      if (error) throw error;
      
      // Update profile with registration data
      if (data.user) {
        await supabase.from('profiles').update({
          username: username.toLowerCase(),
          gender,
          country,
          state,
          city,
        }).eq('id', data.user.id);
      }
      
      toast({ title: 'Welcome, Hunter!', description: 'Account created successfully!' });
      navigate('/');
    } catch (error: any) {
      toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="font-display text-4xl font-bold gradient-text mb-1">SoloRank</h1>
          <p className="text-muted-foreground text-sm">Rise through the ranks</p>
        </div>

        {/* Auth Card */}
        <div className="card-game-glow p-5">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthTab)}>
            <TabsList className="grid w-full grid-cols-2 mb-5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login" className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="login-input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Social Login Buttons */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        className="w-full h-11 gap-3"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                      
                      <Button
                        onClick={handleFacebookLogin}
                        variant="outline"
                        className="w-full h-11 gap-3"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Continue with Facebook
                      </Button>
                      
                      <Button
                        onClick={handleAppleLogin}
                        variant="outline"
                        className="w-full h-11 gap-3"
                        disabled={loading}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Continue with Apple
                      </Button>
                    </div>

                    {/* Guest Login Option */}
                    <Button
                      onClick={handleGuestLogin}
                      variant="ghost"
                      className="w-full h-11 gap-3 border border-dashed border-border hover:bg-muted"
                      disabled={loading}
                    >
                      <UserCircle className="w-5 h-5" />
                      Continue as Guest
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    {/* Method Toggle */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          loginMethod === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                      <button
                        onClick={() => setLoginMethod('phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          loginMethod === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        Phone
                      </button>
                    </div>

                    {loginMethod === 'email' ? (
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-11"
                        />
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button
                          onClick={handleEmailLogin}
                          disabled={loading}
                          className="w-full h-11"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                        </Button>
                        <button
                          type="button"
                          onClick={() => { setStep('forgot-password'); setResetEmail(email); }}
                          className="w-full text-sm text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <PhoneInput
                          value={phone}
                          onChange={(value) => setPhone(value || '')}
                          placeholder="Phone number"
                        />
                        <Button
                          onClick={handlePhoneOTP}
                          disabled={loading}
                          className="w-full h-11"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ) : step === 'otp' ? (
                  <motion.div
                    key="login-otp"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="font-semibold text-foreground mb-1">Enter Code</h2>
                      <p className="text-xs text-muted-foreground">Sent to {phone}</p>
                    </div>

                    <div className="flex justify-center">
                      <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                        <InputOTPGroup>
                          {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      onClick={handleVerifyLoginOTP}
                      disabled={loading || otp.length !== 6}
                      className="w-full h-11"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                    </Button>
                    <button
                      onClick={() => { setStep('input'); setOtp(''); }}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Back
                    </button>
                  </motion.div>
                ) : step === 'forgot-password' ? (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="font-semibold text-foreground mb-1">Reset Password</h2>
                      <p className="text-xs text-muted-foreground">Enter your email to receive a reset link</p>
                    </div>

                    <Input
                      type="email"
                      placeholder="Email address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="h-11"
                    />

                    <Button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="w-full h-11"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                    </Button>
                    <button
                      onClick={() => setStep('input')}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Back to Login
                    </button>
                  </motion.div>
                ) : step === 'reset-sent' ? (
                  <motion.div
                    key="reset-sent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Mail className="w-7 h-7 text-green-500" />
                      </div>
                      <h2 className="font-semibold text-foreground mb-1">Check Your Email</h2>
                      <p className="text-xs text-muted-foreground">
                        We sent a password reset link to<br />
                        <span className="text-foreground font-medium">{resetEmail}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        Click the link in your email to reset your password. Check your spam folder if you don't see it.
                      </p>
                    </div>

                    <Button
                      onClick={() => setStep('input')}
                      variant="outline"
                      className="w-full h-11"
                    >
                      Back to Login
                    </Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <AnimatePresence mode="wait">
                {regStep === 'form' ? (
                  <motion.div
                    key="register-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
                  >
                    {/* Method Toggle */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRegMethod('email')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          regMethod === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </button>
                      <button
                        onClick={() => setRegMethod('phone')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          regMethod === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        Phone
                      </button>
                    </div>

                    {/* Credentials */}
                    {regMethod === 'email' ? (
                      <>
                        <Input
                          type="email"
                          placeholder="Email address"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="h-11"
                        />
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="h-11 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </>
                    ) : (
                      <PhoneInput
                        value={regPhone}
                        onChange={(value) => setRegPhone(value || '')}
                        placeholder="Phone number"
                      />
                    )}

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <User className="w-3 h-3" /> Profile Information
                      </p>
                      
                      {/* Username */}
                      <div className="relative mb-3">
                        <Input
                          placeholder="Hunter name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="h-11 pr-8"
                          maxLength={20}
                        />
                        {checkingUsername && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
                        {!checkingUsername && usernameAvailable === true && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>}
                        {!checkingUsername && usernameAvailable === false && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive text-sm">✗</span>}
                      </div>

                      {/* Gender */}
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="h-11 mb-3">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Location */}
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                      </p>
                      
                      <div className="mb-2">
                        <SearchableSelect
                          options={countryOptions}
                          value={country}
                          onValueChange={setCountry}
                          placeholder="Country"
                          searchPlaceholder="Search countries..."
                          className="h-11"
                        />
                      </div>

                      <div className="mb-2">
                        <SearchableSelect
                          options={stateOptions}
                          value={state}
                          onValueChange={setState}
                          placeholder="State/Province"
                          searchPlaceholder="Search states..."
                          disabled={!country}
                          className="h-11"
                        />
                      </div>

                      <SearchableSelect
                        options={cityOptions}
                        value={city}
                        onValueChange={setCity}
                        placeholder="City"
                        searchPlaceholder="Search cities..."
                        disabled={!state}
                        className="h-11"
                      />
                    </div>

                    <Button
                      onClick={regMethod === 'email' ? handleEmailRegister : handlePhoneRegister}
                      disabled={loading || !username || !gender || !country || !state || !city || !usernameAvailable}
                      className="w-full h-11 mt-3"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-otp"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-primary" />
                      </div>
                      <h2 className="font-semibold text-foreground mb-1">Verify Phone</h2>
                      <p className="text-xs text-muted-foreground">Enter code sent to {regPhone}</p>
                    </div>

                    <div className="flex justify-center">
                      <InputOTP value={regOtp} onChange={setRegOtp} maxLength={6}>
                        <InputOTPGroup>
                          {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      onClick={handleVerifyRegisterOTP}
                      disabled={loading || regOtp.length !== 6}
                      className="w-full h-11"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </Button>
                    <button
                      onClick={() => { setRegStep('form'); setRegOtp(''); }}
                      className="w-full text-sm text-muted-foreground hover:text-foreground"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
