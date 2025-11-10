-- Drop existing tables and policies if they exist
DROP TABLE IF EXISTS hs_policy_files CASCADE;
DROP TABLE IF EXISTS other_policy_files CASCADE;

-- Create storage buckets for policies
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('hs-policies', 'hs-policies', true),
  ('other-policies', 'other-policies', true)
ON CONFLICT (id) DO NOTHING;

-- Create tables for policy files metadata
CREATE TABLE IF NOT EXISTS hs_policy_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  file_name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(file_name)
);

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
ALTER TABLE hs_policy_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE other_policy_files ENABLE ROW LEVEL SECURITY;

-- Create policies for hs_policy_files
CREATE POLICY "Authenticated users can access hs_policy_files"
  ON hs_policy_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for other_policy_files
CREATE POLICY "Authenticated users can access other_policy_files"
  ON other_policy_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_hs_policy_files_updated_at
  BEFORE UPDATE ON hs_policy_files
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_other_policy_files_updated_at
  BEFORE UPDATE ON other_policy_files
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Drop existing storage policies
DROP POLICY IF EXISTS "HS policies are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage hs-policies" ON storage.objects;
DROP POLICY IF EXISTS "Other policies are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage other-policies" ON storage.objects;

-- Create storage policies for hs-policies bucket
CREATE POLICY "HS policies are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'hs-policies');

CREATE POLICY "Authenticated users can manage hs-policies"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'hs-policies')
  WITH CHECK (bucket_id = 'hs-policies');

-- Create storage policies for other-policies bucket
CREATE POLICY "Other policies are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'other-policies');

CREATE POLICY "Authenticated users can manage other-policies"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'other-policies')
  WITH CHECK (bucket_id = 'other-policies');