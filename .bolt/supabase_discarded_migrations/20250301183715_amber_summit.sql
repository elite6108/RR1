/*
  # Update RAMS table schema

  1. New Columns
    - description (text)
    - sequence (text)
    - stability (text)
    - special_permits (text)
    - workers (text)
    - tools_equipment (text)
    - plant_equipment (text)
    - lighting (text)
    - deliveries (text)
    - services (text)
    - access_equipment (text)
    - hazardous_equipment (text)
    - welfare_first_aid (text)
    - nearest_hospital (text)
    - ppe (text[])
*/

-- Add new columns to RAMS table
ALTER TABLE rams
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS sequence text,
  ADD COLUMN IF NOT EXISTS stability text,
  ADD COLUMN IF NOT EXISTS special_permits text,
  ADD COLUMN IF NOT EXISTS workers text,
  ADD COLUMN IF NOT EXISTS tools_equipment text,
  ADD COLUMN IF NOT EXISTS plant_equipment text,
  ADD COLUMN IF NOT EXISTS lighting text,
  ADD COLUMN IF NOT EXISTS deliveries text,
  ADD COLUMN IF NOT EXISTS services text,
  ADD COLUMN IF NOT EXISTS access_equipment text,
  ADD COLUMN IF NOT EXISTS hazardous_equipment text,
  ADD COLUMN IF NOT EXISTS welfare_first_aid text,
  ADD COLUMN IF NOT EXISTS nearest_hospital text,
  ADD COLUMN IF NOT EXISTS ppe text[] NOT NULL DEFAULT '{}'::text[];