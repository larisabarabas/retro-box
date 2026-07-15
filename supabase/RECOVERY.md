# Database recovery — 2026-07-15

## What happened

The original Supabase project backing this app was stopped/paused and could not
be restored from the dashboard. A new project (`retro-box-db`) was created to
replace it.

A `pg_dumpall`-style cluster backup existed at
`supabase/db_cluster-02-12-2025@00-37-40.backup`, but on inspection it turned
out to be useless for recovery: it was taken right after initial project
setup, before the real schema existed. `public` only contained the empty
sample table `test_connection`, and `auth.users` had zero rows. It has since
been deleted — nothing in it was salvageable.

The `notes` / `syntheses` / `teams` schema had never been committed as
migrations; it only existed as ad hoc SQL run in the old project's Studio SQL
editor. It was reconstructed from design notes and cross-checked against
`database.types.ts` (which had been generated from the live DB and was the
only surviving source of truth for actual column names/types). This
confirmed `notes.category` and `syntheses.themes` were mentioned in early
design drafts but never actually deployed, and `retro_sessions` was a
"future" table that was never created.

## Root causes

1. **No migration history.** The schema lived only in the old project's
   database, not in version control. When the project became unreachable,
   the schema definition was lost with it.
2. **The one backup taken had no real data in it** — it predates the actual
   tables. A backup that's never refreshed after the schema it's meant to
   protect is created is not a backup.
3. **A stray duplicate `supabase/supabase/` directory** (an accidental
   second `supabase init` run from inside `supabase/`) shadowed the real
   project config. The Supabase CLI resolves the project root by looking for
   a `supabase` subfolder relative to the current working directory — so
   running CLI commands from `supabase/` found `supabase/supabase/config.toml`
   instead of `supabase/config.toml`. This caused an early `supabase db push`
   to silently report "Remote database is up to date" (true for the wrong,
   migration-less config root) while the real migration sat unapplied.
   Deleting the nested folder fixed it immediately.

## What was done

1. Created `retro-box-db` as the new Supabase project.
2. Updated `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `PROJECT_ID`) to point at it.
3. Reconstructed the schema as a tracked migration:
   `supabase/migrations/20260715120000_initial_schema.sql` — `teams`,
   `notes`, `syntheses`, RLS policies matching the app's actual
   authorization behavior (any authenticated user, no team-membership
   check — that's how the app worked before too), and a seed row for
   `NEXT_PUBLIC_DEFAULT_TEAM_ID`.
4. Deleted the stray `supabase/supabase/` directory.
5. Ran `supabase link --project-ref <ref>` and `supabase db push` from
   `supabase/` (confirmed via `supabase migration list` that Local and
   Remote versions matched).
6. Regenerated `database.types.ts` with
   `supabase gen types typescript --project-id <ref> --schema public`.
7. Deleted the old, data-less backup file.

## Checklist for next time

- [ ] Schema changes go through `supabase migrations new <name>` and get
      committed — never hand-edit the schema in Studio.
- [ ] Before assuming a `.backup` file is useful, check it actually contains
      the tables/rows you expect (`grep -n 'CREATE TABLE public\.' file` and
      check for `COPY ... FROM stdin` blocks with real rows, not just
      headers) — don't trust the filename or age alone.
- [ ] Only ever run `supabase` CLI commands from `supabase/` (the directory
      containing the tracked `config.toml`), and confirm the link with
      `cat supabase/.temp/project-ref` before pushing — if there's ever
      another `supabase/supabase/`-style nested folder, delete it before
      linking.
- [ ] After `supabase db push`, verify with `supabase migration list` that
      Local and Remote versions match, not just that the command exited
      without an error.
- [ ] Consider taking a fresh `supabase db dump` periodically once the app
      has real user data, so a future recovery has something to restore.
