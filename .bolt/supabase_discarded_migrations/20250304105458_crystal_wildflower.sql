-- Create sequence for policy numbers
CREATE SEQUENCE IF NOT EXISTS policy_number_seq START 1;

-- Add policy_number column to other_policy_files
ALTER TABLE other_policy_files 
  ADD COLUMN IF NOT EXISTS policy_number integer DEFAULT nextval('policy_number_seq');

-- Add unique constraint on policy_number
ALTER TABLE other_policy_files
  ADD CONSTRAINT other_policy_files_policy_number_key UNIQUE (policy_number);