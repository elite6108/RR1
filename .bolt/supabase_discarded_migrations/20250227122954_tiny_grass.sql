-- Create tables for policy files metadata if they don't exist
CREATE TABLE IF NOT EXISTS other_policy_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(file_name)
);

-- Enable Row Level Security
ALTER TABLE other_policy_files ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to access other_policy_files
CREATE POLICY "Authenticated users can access other_policy_files"
  ON other_policy_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_other_policy_files_updated_at
  BEFORE UPDATE ON other_policy_files
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('other-policies', 'other-policies', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies for other-policies bucket
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