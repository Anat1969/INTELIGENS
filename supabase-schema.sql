-- Create synthesized_intelligences table
CREATE TABLE IF NOT EXISTS synthesized_intelligences (
  id BIGSERIAL PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  source_ids TEXT[] NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  essence TEXT NOT NULL,
  power TEXT NOT NULL,
  roles TEXT[] NOT NULL,
  quote TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'synthesized',
  times_found INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on source_key for faster lookups
CREATE INDEX IF NOT EXISTS idx_source_key ON synthesized_intelligences(source_key);

-- Create function to increment times_found
CREATE OR REPLACE FUNCTION increment_times_found(key TEXT)
RETURNS void AS $$
BEGIN
  UPDATE synthesized_intelligences
  SET times_found = times_found + 1,
      updated_at = NOW()
  WHERE source_key = key;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_synthesized_intelligences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS synthesized_intelligences_updated_at_trigger ON synthesized_intelligences;
CREATE TRIGGER synthesized_intelligences_updated_at_trigger
BEFORE UPDATE ON synthesized_intelligences
FOR EACH ROW
EXECUTE FUNCTION update_synthesized_intelligences_updated_at();

-- Grant permissions for authenticated users
GRANT SELECT, INSERT, UPDATE ON synthesized_intelligences TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_times_found(TEXT) TO anon, authenticated;
