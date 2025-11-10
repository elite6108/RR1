-- First let's check if the site_check_ins table exists and what structure it has
DO $$
DECLARE
  table_exists BOOLEAN;
  has_user_id BOOLEAN;
  has_email BOOLEAN;
BEGIN
  -- Check if table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'site_check_ins'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    -- Create the table if it doesn't exist
    CREATE TABLE public.site_check_ins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      site_id TEXT NOT NULL,
      check_in_time TIMESTAMPTZ DEFAULT NOW(),
      check_out_time TIMESTAMPTZ
    );
    
    -- Create indexes
    CREATE INDEX site_check_ins_user_id_idx ON public.site_check_ins(user_id);
    CREATE INDEX site_check_ins_site_id_idx ON public.site_check_ins(site_id);
  ELSE
    -- Check if user_id column exists
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'site_check_ins'
      AND column_name = 'user_id'
    ) INTO has_user_id;
    
    -- Check if email column exists
    SELECT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'site_check_ins'
      AND column_name = 'email'
    ) INTO has_email;
    
    -- Add user_id column if it doesn't exist
    IF NOT has_user_id THEN
      ALTER TABLE public.site_check_ins ADD COLUMN user_id UUID REFERENCES auth.users(id);
      CREATE INDEX site_check_ins_user_id_idx ON public.site_check_ins(user_id);
    END IF;
  END IF;
END
$$;

-- Make sure the table has RLS enabled
ALTER TABLE public.site_check_ins ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Site check-ins are viewable by all authenticated users" ON public.site_check_ins;
DROP POLICY IF EXISTS "Users can insert their own site check-ins" ON public.site_check_ins;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.site_check_ins;

-- Create a simple policy that allows all authenticated users to insert records
CREATE POLICY "Allow all authenticated users to insert site check-ins"
  ON public.site_check_ins
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
  
-- Create a policy for authenticated users to view all site check-ins
CREATE POLICY "Authenticated users can view all site check-ins"
  ON public.site_check_ins
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.site_check_ins TO authenticated;
