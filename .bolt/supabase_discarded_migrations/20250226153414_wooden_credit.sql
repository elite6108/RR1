-- Create storage bucket for toolbox talks PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('toolbox-talks', 'toolbox-talks', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can access toolbox talks PDFs" ON storage.objects;

-- Create storage policies for toolbox talks PDFs
CREATE POLICY "Authenticated users can access toolbox talks PDFs"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'toolbox-talks')
  WITH CHECK (bucket_id = 'toolbox-talks');