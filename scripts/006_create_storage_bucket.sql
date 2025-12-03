-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery');

-- Allow public read access to gallery images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'gallery');

-- Allow authenticated users to delete their images
CREATE POLICY "Allow delete for authenticated" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery');
