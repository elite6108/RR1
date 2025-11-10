-- First, ensure the uuid-ossp extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if workers table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'workers') THEN
        CREATE TABLE workers (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            phone TEXT,
            company TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            last_short_questionnaire_date TIMESTAMPTZ,
            last_health_questionnaire TIMESTAMPTZ
        );
        
        -- Create an index on email for faster lookups
        CREATE INDEX IF NOT EXISTS workers_email_idx ON workers(email);
    ELSE
        -- Add missing columns to workers table for health questionnaire tracking
        BEGIN
            ALTER TABLE workers ADD COLUMN IF NOT EXISTS last_short_questionnaire_date TIMESTAMPTZ;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
        
        BEGIN
            ALTER TABLE workers ADD COLUMN IF NOT EXISTS last_health_questionnaire TIMESTAMPTZ;
        EXCEPTION WHEN duplicate_column THEN
            -- Column already exists, do nothing
        END;
    END IF;
END
$$;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS update_worker_health_check(TEXT, UUID);

-- Create a function to update worker health check status
CREATE FUNCTION update_worker_health_check(
  p_email TEXT,
  p_questionnaire_id UUID DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  worker_id UUID;
  current_date TIMESTAMPTZ := NOW();
  result JSON;
BEGIN
  -- First check if the worker exists
  SELECT id INTO worker_id FROM workers WHERE email = p_email;
  
  IF worker_id IS NULL THEN
    -- If worker doesn't exist, create a new record
    BEGIN
      INSERT INTO workers (email, last_short_questionnaire_date, last_health_questionnaire)
      VALUES (p_email, current_date, current_date)
      RETURNING id INTO worker_id;
      
      result := json_build_object(
        'success', true,
        'message', 'Created new worker record with health check',
        'worker_id', worker_id
      );
    EXCEPTION WHEN OTHERS THEN
      -- Handle any errors during insert
      result := json_build_object(
        'success', false,
        'message', 'Error creating worker record: ' || SQLERRM
      );
      RETURN result;
    END;
  ELSE
    -- Update existing worker
    BEGIN
      UPDATE workers
      SET 
        last_short_questionnaire_date = current_date,
        last_health_questionnaire = current_date
      WHERE email = p_email;
      
      result := json_build_object(
        'success', true,
        'message', 'Updated existing worker health check',
        'worker_id', worker_id
      );
    EXCEPTION WHEN OTHERS THEN
      -- Handle any errors during update
      result := json_build_object(
        'success', false,
        'message', 'Error updating worker record: ' || SQLERRM
      );
      RETURN result;
    END;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION update_worker_health_check TO authenticated;
GRANT EXECUTE ON FUNCTION update_worker_health_check TO anon;
