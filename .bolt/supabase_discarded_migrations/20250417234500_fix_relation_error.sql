-- This migration fixes the "relation 'last_health_questionnaire' does not exist" error
-- by ensuring the workers table exists with the required columns

-- Create the workers table if it doesn't exist
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  last_short_questionnaire_date TIMESTAMPTZ,
  last_health_questionnaire TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health_checks table if it doesn't exist (for future use)
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  fit_to_work BOOLEAN DEFAULT TRUE,
  taking_medications BOOLEAN DEFAULT FALSE,
  wearing_correct_ppe BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a trigger to update the workers table when a health check is added
CREATE OR REPLACE FUNCTION update_worker_after_health_check()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the worker record if it exists
  UPDATE workers
  SET last_health_questionnaire = NEW.completed_at
  WHERE email = NEW.email;
  
  -- If no rows were updated, insert a new worker record
  IF NOT FOUND THEN
    INSERT INTO workers (email, last_health_questionnaire)
    VALUES (NEW.email, NEW.completed_at);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_worker_health_check_trigger ON health_checks;

-- Create the trigger
CREATE TRIGGER update_worker_health_check_trigger
AFTER INSERT ON health_checks
FOR EACH ROW
EXECUTE FUNCTION update_worker_after_health_check();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS workers_email_idx ON workers(email);
CREATE INDEX IF NOT EXISTS health_checks_email_idx ON health_checks(email);

-- Grant permissions
GRANT ALL ON TABLE workers TO authenticated;
GRANT ALL ON TABLE workers TO anon;
GRANT ALL ON TABLE health_checks TO authenticated;
GRANT ALL ON TABLE health_checks TO anon;
