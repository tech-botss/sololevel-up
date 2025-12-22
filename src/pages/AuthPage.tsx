import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, Phone, ArrowRight, Loader2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email');
const phoneSchema = z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number');

type AuthMode = 'email' | 'phone';
type AuthStep = 'input' | 'otp';

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('email');
  const [step, setStep] = useState<AuthStep>('input');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      
      if (mode === 'email') {
        const result = emailSchema.safeParse(email);
        if (!result.success) {
          toast({ title: 'Invalid email', description: result.error.errors[0].message, variant: 'destructive' });
          return;
        }
        
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        toast({ title: 'OTP Sent!', description: 'Check your email for the verification code' });
        setStep('otp');
      } else {
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
          toast({ title: 'Invalid phone', description: result.error.errors[0].message, variant: 'destructive' });
          return;
        }
        
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        toast({ title: 'OTP Sent!', description: 'Check your phone for the verification code' });
        setStep('otp');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter a 6-digit code', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      
      let result;
      if (mode === 'email') {
        result = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
      } else {
        result = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: 'sms',
        });
      }
      
      if (result.error) throw result.error;
      
      // Check if profile setup is complete
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, country, city')
        .eq('id', result.data.user?.id)
        .maybeSingle();
      
      // If profile is incomplete, go to setup page
      if (!profile || !profile.username || profile.username.startsWith('hunter_') || !profile.country || !profile.city) {
        toast({ title: 'Almost there!', description: 'Complete your profile to enter the ranks' });
        navigate('/profile-setup');
      } else {
        toast({ title: 'Welcome back, Hunter!', description: 'You have successfully logged in' });
        navigate('/');
      }
    } catch (error: any) {
      console.error('Verify error:', error);
      toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
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
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">SoloRank</h1>
          <p className="text-muted-foreground">Rise through the ranks</p>
        </motion.div>

        {/* Auth Card */}
        <div className="card-game-glow p-6">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setMode('email')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                      mode === 'email' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <button
                    onClick={() => setMode('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                      mode === 'phone' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    Phone
                  </button>
                </div>

                {/* Input */}
                <div className="mb-6">
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {mode === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  {mode === 'email' ? (
                    <Input
                      type="email"
                      placeholder="hunter@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                    />
                  ) : (
                    <Input
                      type="tel"
                      placeholder="+1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12"
                    />
                  )}
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 font-semibold"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-semibold text-lg text-foreground mb-1">Enter Verification Code</h2>
                  <p className="text-sm text-muted-foreground">
                    Sent to {mode === 'email' ? email : phone}
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  className="w-full h-12 bg-primary hover:bg-primary/90 font-semibold mb-3"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Verify & Enter'
                  )}
                </Button>

                <button
                  onClick={() => { setStep('input'); setOtp(''); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
