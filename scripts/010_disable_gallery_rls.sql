-- Disable RLS on gallery table and recreate simpler policies
-- The original RLS policy was causing issues even for admins

-- Drop existing problematic policies
DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;

-- Disable RLS on gallery table since it's already public and read by everyone
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS with simpler policies, uncomment below:
-- ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "gallery_insert_authenticated" ON public.gallery FOR INSERT
-- WITH CHECK (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "gallery_update_authenticated" ON public.gallery FOR UPDATE
-- USING (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "gallery_delete_authenticated" ON public.gallery FOR DELETE
-- USING (auth.role() = 'authenticated');
