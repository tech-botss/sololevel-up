-- Create role enum
CREATE TYPE public.app_role AS ENUM ('developer', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create community_quests table for developer-added quests
CREATE TABLE public.community_quests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_minutes INTEGER NOT NULL,
    xp_reward INTEGER NOT NULL,
    gold_reward INTEGER NOT NULL,
    stat_str INTEGER DEFAULT 0,
    stat_int INTEGER DEFAULT 0,
    stat_end INTEGER DEFAULT 0,
    stat_wil INTEGER DEFAULT 0,
    stat_soc INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_quests ENABLE ROW LEVEL SECURITY;

-- Everyone can view active community quests
CREATE POLICY "Everyone can view active community quests"
ON public.community_quests
FOR SELECT
USING (is_active = true);

-- Only developers can insert community quests
CREATE POLICY "Developers can create community quests"
ON public.community_quests
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'developer'));

-- Only developers can update their own community quests
CREATE POLICY "Developers can update own community quests"
ON public.community_quests
FOR UPDATE
USING (public.has_role(auth.uid(), 'developer') AND auth.uid() = creator_id);

-- Only developers can delete their own community quests
CREATE POLICY "Developers can delete own community quests"
ON public.community_quests
FOR DELETE
USING (public.has_role(auth.uid(), 'developer') AND auth.uid() = creator_id);

-- Add trigger for updated_at
CREATE TRIGGER update_community_quests_updated_at
BEFORE UPDATE ON public.community_quests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();