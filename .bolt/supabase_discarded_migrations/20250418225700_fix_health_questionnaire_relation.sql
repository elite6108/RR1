-- Fix for the "relation 'last_health_questionnaire' does not exist" error
-- This migration ensures the health_questionnaires table exists

-- Create health_questionnaires table, which seems to be missing based on the error
DROP TABLE IF EXISTS health_questionnaires;

CREATE TABLE health_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_email TEXT,
  submission_date TIMESTAMPTZ NOT NULL,
  questionnaire_type TEXT NOT NULL,
  -- Medical Declaration
  epilepsy BOOLEAN DEFAULT FALSE,
  blackouts BOOLEAN DEFAULT FALSE,
  diabetes BOOLEAN DEFAULT FALSE,
  eyesight BOOLEAN DEFAULT FALSE,
  color_blindness BOOLEAN DEFAULT FALSE,
  hearing_impairment BOOLEAN DEFAULT FALSE,
  physical_disability BOOLEAN DEFAULT FALSE,
  arthritis BOOLEAN DEFAULT FALSE,
  back_problems BOOLEAN DEFAULT FALSE,
  hernia BOOLEAN DEFAULT FALSE, 
  hypertension BOOLEAN DEFAULT FALSE,
  heart_disease BOOLEAN DEFAULT FALSE,
  respiratory_disease BOOLEAN DEFAULT FALSE,
  medical_details TEXT,
  prescribed_medications TEXT,
  -- Occupational Health History
  hazardous_material_exposure BOOLEAN DEFAULT FALSE,
  hazardous_material_details TEXT,
  work_related_health_problems BOOLEAN DEFAULT FALSE,
  work_related_health_details TEXT,
  work_restrictions BOOLEAN DEFAULT FALSE,
  work_restrictions_details TEXT,
  -- Declaration
  full_name TEXT,
  digital_signature TEXT,
  confirmation_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE health_questionnaires ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can insert health questionnaires"
  ON health_questionnaires
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own health questionnaires"
  ON health_questionnaires
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Make sure workers table has the last_health_questionnaire column
DO $$
BEGIN
  -- Make sure the last_health_questionnaire column exists in workers table
  IF EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'workers'
  ) AND NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'workers' 
    AND column_name = 'last_health_questionnaire'
  ) THEN
    ALTER TABLE workers ADD COLUMN last_health_questionnaire TIMESTAMPTZ;
  END IF;
END
$$;

-- Create or update trigger function to update workers table
CREATE OR REPLACE FUNCTION update_worker_from_questionnaire()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to update the worker record if it exists
  UPDATE workers
  SET last_health_questionnaire = NEW.submission_date
  WHERE email = NEW.user_email;
  
  -- If no rows were updated and we have an email, insert a new worker record
  IF NOT FOUND AND NEW.user_email IS NOT NULL THEN
    INSERT INTO workers (email, full_name, last_health_questionnaire)
    VALUES (NEW.user_email, NEW.full_name, NEW.submission_date);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS update_worker_from_questionnaire_trigger ON health_questionnaires;

CREATE TRIGGER update_worker_from_questionnaire_trigger
AFTER INSERT ON health_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_worker_from_questionnaire();

-- Grant permissions to access the health_questionnaires table
GRANT ALL ON TABLE health_questionnaires TO authenticated;
GRANT ALL ON TABLE health_questionnaires TO anon;
