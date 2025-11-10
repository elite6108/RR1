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

-- Create health_checks table if it doesn't exist
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  fit_to_work BOOLEAN DEFAULT TRUE,
  taking_medications BOOLEAN DEFAULT FALSE,
  wearing_correct_ppe BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES auth.users(email) ON DELETE CASCADE
);

-- Create a trigger to update the workers table when a health check is added
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

-- Create a function to check if a user has a valid health check
CREATE OR REPLACE FUNCTION has_valid_health_check(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  last_check_date TIMESTAMPTZ;
BEGIN
  -- Get the most recent health check date
  SELECT MAX(completed_at) INTO last_check_date
  FROM health_checks
  WHERE email = p_email;
  
  -- If no health check found or it's older than 6 months, return false
  IF last_check_date IS NULL OR last_check_date < (NOW() - INTERVAL '6 months') THEN
    RETURN FALSE;
  ELSE
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION has_valid_health_check TO authenticated;
GRANT EXECUTE ON FUNCTION has_valid_health_check TO anon;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS health_checks_email_idx ON health_checks(email);
CREATE INDEX IF NOT EXISTS workers_email_idx ON workers(email);
CREATE INDEX IF NOT EXISTS health_checks_completed_at_idx ON health_checks(completed_at);
