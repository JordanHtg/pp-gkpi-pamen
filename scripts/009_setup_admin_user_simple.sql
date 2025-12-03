-- This script helps you set up an admin user
-- IMPORTANT: Replace 'YOUR_ACTUAL_USER_ID' with the UUID from step 1 below

-- Step 1: Find your user ID (run this first)
-- SELECT id, email FROM auth.users LIMIT 5;

-- Step 2: Once you have your user ID, uncomment and run the UPDATE below
-- Replace 'YOUR_ACTUAL_USER_ID' with the UUID you found in step 1

-- UPDATE public.profiles SET is_admin = true WHERE id = 'YOUR_ACTUAL_USER_ID';

-- Step 3: Verify it worked (run this to check)
-- SELECT id, email, is_admin FROM public.profiles WHERE is_admin = true;

-- Example (if your user ID was 123e4567-e89b-12d3-a456-426614174000):
-- UPDATE public.profiles SET is_admin = true WHERE id = '123e4567-e89b-12d3-a456-426614174000';
