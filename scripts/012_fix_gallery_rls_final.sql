-- Drop all existing problematic RLS policies on gallery table
DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_select_public" ON public.gallery;

-- Disable RLS on gallery table completely
-- The gallery is public and admin checks are done in the application code
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
