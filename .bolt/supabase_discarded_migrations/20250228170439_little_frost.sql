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
  ra_id text UNIQUE NOT NULL,
  name text NOT NULL,
  creation_date date NOT NULL DEFAULT CURRENT_DATE,
  location text NOT NULL,
  assessor text NOT NULL,
  ppe text[] NOT NULL DEFAULT '{}',
  guidelines text,
  working_methods jsonb NOT NULL DEFAULT '[]'::jsonb,
  hazards jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  review_date timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_ppe CHECK (array_length(ppe, 1) >= 0),
  CONSTRAINT valid_working_methods CHECK (jsonb_typeof(working_methods) = 'array'),
  CONSTRAINT valid_hazards CHECK (jsonb_typeof(hazards) = 'array')
);

-- Enable Row Level Security
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create function to generate sequential RA numbers
CREATE OR REPLACE FUNCTION generate_ra_number()
RETURNS text AS $$
DECLARE
  last_number integer;
  new_number text;
BEGIN
  -- Get the last number from existing RA numbers
  SELECT COALESCE(MAX(NULLIF(regexp_replace(ra_id, '^OPG-RA-', ''), '')), '000000')::integer
  INTO last_number
  FROM risk_assessments
  WHERE ra_id ~ '^OPG-RA-\d+$';

  -- Generate new number with OPG-RA- prefix
  new_number := 'OPG-RA-' || LPAD((last_number + 1)::text, 6, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate RA number
CREATE OR REPLACE FUNCTION set_ra_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ra_id := generate_ra_number();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_ra_number
  BEFORE INSERT ON risk_assessments
  FOR EACH ROW
  EXECUTE FUNCTION set_ra_number();

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_risk_assessments_updated_at
  BEFORE UPDATE ON risk_assessments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can access risk_assessments"
  ON risk_assessments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);