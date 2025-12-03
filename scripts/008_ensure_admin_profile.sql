-- This script ensures that the current admin user is properly configured
-- Run this if you're getting RLS policy violations when trying to upload gallery images

-- First, let's check if there are any profiles with is_admin = true
SELECT id, email, is_admin FROM public.profiles ORDER BY created_at DESC LIMIT 1;

-- If needed, find your user and update them to admin status
-- Replace 'YOUR_EMAIL' with your actual email
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@pamen.com'
);

-- Verify the update worked
SELECT id, is_admin FROM public.profiles WHERE is_admin = true;
