-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public access to other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update other-policies" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from other-policies" ON storage.objects;

-- Ensure storage bucket exists and is public
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('other-policies', 'other-policies', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating bucket: %', SQLERRM;
END $$;

-- Create the other_policy_files table if it doesn't exist
CREATE TABLE IF NOT EXISTS other_policy_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(file_name)
);

-- Enable RLS on the table
ALTER TABLE other_policy_files ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
DO $$
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can access other_policy_files" ON other_policy_files;
  CREATE POLICY "Authenticated users can access other_policy_files"
    ON other_policy_files
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating table policy: %', SQLERRM;
END $$;

-- Create trigger for updated_at
DO $$
BEGIN
  CREATE TRIGGER update_other_policy_files_updated_at
    BEFORE UPDATE ON other_policy_files
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
EXCEPTION
  WHEN DUPLICATE_OBJECT THEN
    NULL;
END $$;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies with error handling
DO $$
BEGIN
  -- Policy for public access
  CREATE POLICY "Public access to other-policies"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'other-policies');
EXCEPTION
  WHEN DUPLICATE_OBJECT THEN
    NULL;
END $$;

DO $$
BEGIN
  -- Policy for uploads
  CREATE POLICY "Authenticated users can upload to other-policies"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'other-policies');
EXCEPTION
  WHEN DUPLICATE_OBJECT THEN
    NULL;
END $$;

DO $$
BEGIN
  -- Policy for updates
  CREATE POLICY "Authenticated users can update other-policies"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'other-policies');
EXCEPTION
  WHEN DUPLICATE_OBJECT THEN
    NULL;
END $$;

DO $$
BEGIN
  -- Policy for deletions
  CREATE POLICY "Authenticated users can delete from other-policies"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'other-policies');
EXCEPTION
  WHEN DUPLICATE_OBJECT THEN
    NULL;
END $$;