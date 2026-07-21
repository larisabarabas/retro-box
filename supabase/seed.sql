-- Sample retro notes for local development.
-- Loaded automatically by `supabase db reset` (see supabase/config.toml [db.seed]).
-- Uses the default team seeded in the initial_schema migration
-- (id referenced by NEXT_PUBLIC_DEFAULT_TEAM_ID).

INSERT INTO notes (team_id, author_name, content, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Maria', 'Sometimes when performing UAT is really hard to find all the user scenarios.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Olivia', 'The frontend team did a really great job in finalizing the UI updates for the planning feature.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Olivia', 'Doing both design and UAT makes me loose a lot of focus.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Elena', 'There are many technical debts which are currently untracked.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Elena', 'We successfully delivered the new reporting feature for client X.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Petris', 'Backend team gets slower when some members are in the fire chief rotation.', '2026-02-10'),
  ('00000000-0000-0000-0000-000000000001', 'Robert', 'Deploy took 2 hours because of config issues which caused huge delays for client trainings.', '2026-02-10');
