-- Add type and content columns to other_policy_files table
ALTER TABLE other_policy_files
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'uploaded',
  ADD COLUMN IF NOT EXISTS content text;

-- Add check constraint for type
ALTER TABLE other_policy_files
  ADD CONSTRAINT other_policy_files_type_check 
  CHECK (type IN ('uploaded', 'created'));