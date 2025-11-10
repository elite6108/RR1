-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  policy_id text NOT NULL,
  name text NOT NULL,
  created_by text NOT NULL,
  content text NOT NULL,
  upload_date date NOT NULL DEFAULT CURRENT_DATE,
  review_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(policy_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can access policies"
  ON policies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();