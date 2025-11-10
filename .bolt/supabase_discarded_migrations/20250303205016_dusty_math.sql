-- Create other_policy_files table for storing metadata
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