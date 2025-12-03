-- Add location and last_seen fields to track user information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone;

-- Update RLS policy to allow profiles to update their own last_seen
CREATE POLICY "profiles_update_last_seen"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
