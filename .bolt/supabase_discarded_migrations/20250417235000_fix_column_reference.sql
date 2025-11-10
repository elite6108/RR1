-- This migration fixes the "relation 'last_health_questionnaire' does not exist" error
-- by ensuring the workers table exists with the correct column structure

-- Create the workers table if it doesn't exist
DO $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'workers'
  ) THEN
    -- Create the table
    CREATE TABLE public.workers (
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
    
    -- Create index
    CREATE INDEX IF NOT EXISTS workers_email_idx ON workers(email);
    
    -- Grant permissions
    GRANT ALL ON TABLE workers TO authenticated;
    GRANT ALL ON TABLE workers TO anon;
    
    RAISE NOTICE 'Created workers table';
  ELSE
    RAISE NOTICE 'Workers table already exists';
  END IF;
  
  -- Check if last_health_questionnaire column exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'workers' 
    AND column_name = 'last_health_questionnaire'
  ) THEN
    -- Add the column
    ALTER TABLE public.workers 
    ADD COLUMN last_health_questionnaire TIMESTAMPTZ;
    
    RAISE NOTICE 'Added last_health_questionnaire column';
  ELSE
    RAISE NOTICE 'last_health_questionnaire column already exists';
  END IF;
END
$$;
