-- This migration ensures the workers table exists and has the correct structure
-- It also adds a trigger to update the workers table when a health check is completed

-- First, ensure the workers table exists
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

-- Create health_checks table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  fit_to_work BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a function to update the workers table when a health check is completed
CREATE OR REPLACE FUNCTION update_worker_health_check()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to update the worker record if it exists
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
EXECUTE FUNCTION update_worker_health_check();

-- Create a function to check if a user has completed a health check
CREATE OR REPLACE FUNCTION has_completed_health_check(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workers
    WHERE email = p_email
    AND last_health_questionnaire IS NOT NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT ALL ON TABLE workers TO authenticated;
GRANT ALL ON TABLE workers TO anon;
GRANT ALL ON TABLE health_checks TO authenticated;
GRANT ALL ON TABLE health_checks TO anon;
GRANT EXECUTE ON FUNCTION update_worker_health_check TO authenticated;
GRANT EXECUTE ON FUNCTION update_worker_health_check TO anon;
GRANT EXECUTE ON FUNCTION has_completed_health_check TO authenticated;
GRANT EXECUTE ON FUNCTION has_completed_health_check TO anon;
