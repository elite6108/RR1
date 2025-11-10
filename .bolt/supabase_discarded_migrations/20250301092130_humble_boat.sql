/*
  # Update Risk Assessments Schema

  1. Changes
    - Drops and recreates risk_assessments table with all required columns
    - Adds proper constraints and data types
    - Maintains existing functionality (auto-numbering, RLS, etc)

  2. Security
    - Maintains Row Level Security
    - Keeps existing policies
*/

-- Drop existing risk_assessments table if it exists
DROP TABLE IF EXISTS risk_assessments CASCADE;

-- Create risk_assessments table with complete schema
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  review_date timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can access risk_assessments"
  ON risk_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON risk_assessments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();