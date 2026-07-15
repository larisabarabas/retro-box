-- Recreates the schema that existed on the old (now-inaccessible) Supabase project.
-- Reconstructed from database.types.ts (generated from the live DB) plus original
-- design notes. Excludes columns/tables that were never actually deployed:
-- notes.category, syntheses.themes, and the retro_sessions table.

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slack_team_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_slack_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sprint_number INTEGER DEFAULT 1,
  source TEXT DEFAULT 'web'
);

CREATE INDEX notes_team_id_idx ON notes(team_id);

-- Syntheses
CREATE TABLE syntheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  sprint_number INTEGER NOT NULL,
  raw_output TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX syntheses_team_id_idx ON syntheses(team_id);

-- Row Level Security
-- Matches the app's current (pre-migration) authorization model: every
-- notes/syntheses request goes through the anon-key server client and is
-- gated only by "is a user logged in" (app/api/notes, app/api/synthesize
-- check auth.getUser() but do not check team membership). teams is never
-- queried by app code directly. These policies reproduce that behavior
-- exactly rather than introducing new access control.

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE syntheses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read teams"
  ON teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read notes"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read syntheses"
  ON syntheses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert syntheses"
  ON syntheses FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed the default team referenced by NEXT_PUBLIC_DEFAULT_TEAM_ID
INSERT INTO teams (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Team');
