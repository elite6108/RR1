/*
  # Rename first aid arrangements column

  1. Changes
    - Rename firstaidarrangements column to first_aid_arrangements to follow SQL naming conventions
    - Add descriptive comment to the column
*/

-- Rename the column to use snake_case (SQL standard)
ALTER TABLE cpps 
RENAME COLUMN firstaidarrangements TO first_aid_arrangements;

-- Add column comment
COMMENT ON COLUMN cpps.first_aid_arrangements IS 'First aid and emergency arrangements information';