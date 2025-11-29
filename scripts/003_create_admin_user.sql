-- Create an admin user in Supabase Auth and mark as admin in profiles
-- You need to run this manually in Supabase SQL editor

-- First, create the admin user in auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role
) VALUES (
  gen_random_uuid(),
  'admin@pamen.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Admin PP GKPI PAMEN"}',
  now(),
  now(),
  'authenticated'
);

-- Then mark the user as admin in profiles
UPDATE public.profiles 
SET is_admin = true 
WHERE full_name = 'Admin PP GKPI PAMEN' OR email IN (SELECT email FROM auth.users WHERE email = 'admin@pamen.com');
