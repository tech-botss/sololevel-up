-- Create daily login rewards table
CREATE TABLE public.daily_login_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  day_number INTEGER NOT NULL DEFAULT 1,
  reward_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL DEFAULT 0,
  cosmetic_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_login_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own login rewards" 
ON public.daily_login_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login rewards" 
ON public.daily_login_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add last login date to profiles for tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_spin_date DATE;

-- Create index for faster queries
CREATE INDEX idx_daily_login_rewards_user_id ON public.daily_login_rewards(user_id);
CREATE INDEX idx_daily_login_rewards_claimed_at ON public.daily_login_rewards(claimed_at);

-- Update daily_activities to track properly
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON public.daily_activities(user_id, date);