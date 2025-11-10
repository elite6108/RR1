-- Drop existing storage policies
DROP POLICY IF EXISTS "Storage objects are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage storage objects" ON storage.objects;

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('other-policies', 'other-policies', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create simplified storage policies
CREATE POLICY "Public access to other-policies"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'other-policies');

CREATE POLICY "Authenticated users can upload to other-policies"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'other-policies');

CREATE POLICY "Authenticated users can update other-policies"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'other-policies');

CREATE POLICY "Authenticated users can delete from other-policies"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'other-policies');