-- Add category column to signage_artwork
ALTER TABLE signage_artwork
ADD COLUMN IF NOT EXISTS category text NOT NULL CHECK (
  category IN ('mandatory', 'safe_condition', 'fire_protection', 'prohibition', 'warning')
);