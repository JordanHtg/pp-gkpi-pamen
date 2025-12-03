-- Drop existing restrictive policies and replace with working ones
DROP POLICY IF EXISTS "gallery_insert_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_update_admin" ON public.gallery;
DROP POLICY IF EXISTS "gallery_delete_admin" ON public.gallery;

-- Allow admins to insert gallery items
CREATE POLICY "gallery_insert_admin"
  ON public.gallery FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Allow admins to update gallery items
CREATE POLICY "gallery_update_admin"
  ON public.gallery FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Allow admins to delete gallery items
CREATE POLICY "gallery_delete_admin"
  ON public.gallery FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE is_admin = true
    )
  );

-- Also add a policy to allow uploaders to delete their own items
CREATE POLICY "gallery_delete_own"
  ON public.gallery FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);
