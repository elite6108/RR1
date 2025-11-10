-- Drop the problematic function that references the workers table
DROP FUNCTION IF EXISTS record_health_check(TEXT);
DROP FUNCTION IF EXISTS update_worker_health_check(TEXT, UUID);

-- Ensure the health_checks table has all required columns
ALTER TABLE health_checks ADD COLUMN IF NOT EXISTS taking_medications BOOLEAN DEFAULT FALSE;
ALTER TABLE health_checks ADD COLUMN IF NOT EXISTS wearing_correct_ppe BOOLEAN DEFAULT TRUE;

-- Create a simpler function to check if a user has completed a health check
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
