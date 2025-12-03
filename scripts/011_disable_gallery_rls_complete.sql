-- Disable RLS on gallery table completely
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS, use this simpler approach
-- DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
-- DROP POLICY IF EXISTS "gallery_select_public" ON public.gallery;
-- DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
-- DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;

-- ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Allow all for authenticated" ON public.gallery FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow select all" ON public.gallery FOR SELECT
-- TO public
-- USING (true);

-- CREATE POLICY "Allow delete for authenticated" ON public.gallery FOR DELETE
-- TO authenticated
-- USING (true);
