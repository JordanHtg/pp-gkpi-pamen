-- Disable RLS on gallery table completely
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies on gallery table
DROP POLICY IF EXISTS "gallery_select_public" ON public.gallery;
DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;
