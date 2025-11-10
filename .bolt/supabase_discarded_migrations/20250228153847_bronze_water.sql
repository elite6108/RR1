-- Add presenter and attendees columns to toolbox_talks table
DO $$ 
BEGIN
  -- Add columns if they don't exist
  ALTER TABLE toolbox_talks
    ADD COLUMN IF NOT EXISTS presenter text NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS attendees jsonb NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS pdf_file text;

  -- Remove default values after adding columns
  ALTER TABLE toolbox_talks
    ALTER COLUMN presenter DROP DEFAULT;

  -- Create storage bucket if it doesn't exist
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('toolbox-talks', 'toolbox-talks', true)
  ON CONFLICT (id) DO NOTHING;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Toolbox talks PDFs are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload toolbox talks PDFs" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own toolbox talks PDFs" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own toolbox talks PDFs" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Toolbox talks PDFs are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'toolbox-talks');

  CREATE POLICY "Users can upload toolbox talks PDFs"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'toolbox-talks');

  CREATE POLICY "Users can update their own toolbox talks PDFs"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'toolbox-talks');

  CREATE POLICY "Users can delete their own toolbox talks PDFs"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'toolbox-talks');

EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but allow migration to continue
    RAISE NOTICE 'Error in migration: %', SQLERRM;
END $$;