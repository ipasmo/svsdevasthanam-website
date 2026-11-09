-- =============================================================================
-- v1.2 – Initial admin users (SENSITIVE)
-- Sri Venkata Sai Devasthanam
-- =============================================================================
-- Run ORDER:  v1.0_initial_db_setup.sql → v1.1_initial_data_setup.sql → v1.2 (this)
--
-- Run ONCE, after v1.0, connected as the database OWNER (Neon SQL Editor or psql).
-- Runs in ONE transaction: any error rolls everything back.
--
-- BEFORE RUNNING: replace CHANGE_ME in Part 2 with a strong password (min 12 chars).
--   * Do NOT commit this file with a real password; edit it only in the SQL Editor.
--   * Neon keeps SQL Editor history, so change each admin password after first login.
--   * All three users start with the same password.
--
--   Part 0  Guards: v1.0 must have been run; none of these users may exist yet.
--   Part 1  pgcrypto extension (bcrypt hashing inside Postgres).
--   Part 2  Creates SUPER_ADMIN, CONTENT_EDITOR and FINANCE_ADMIN users.
--   Part 3  Records this script in "_prisma_migrations" as a "manual" row.
-- =============================================================================

BEGIN;

-- ─── Part 0: Guards ──────────────────────────────────────────────────────────
DO $$
DECLARE
  v_existing TEXT;
BEGIN
  IF to_regclass('public."User"') IS NULL THEN
    RAISE EXCEPTION 'Schema not found. Run v1.0_initial_db_setup.sql first.';
  END IF;

  SELECT string_agg("email", ', ') INTO v_existing FROM "User"
  WHERE "email" IN ('admin@srivenkatasai.org', 'editor@srivenkatasai.org', 'finance@srivenkatasai.org');
  IF v_existing IS NOT NULL THEN
    RAISE EXCEPTION 'User(s) already exist: %. v1.2 must only run once.', v_existing;
  END IF;
END $$;

-- ─── Part 1: pgcrypto ────────────────────────────────────────────────────────
-- gen_salt()/crypt() for bcrypt password hashes in Part 2.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Part 2: Admin users ─────────────────────────────────────────────────────
-- bcrypt hashes ($2a$, cost 10) made by pgcrypto; the backend's bcrypt.compare accepts them.
-- All three users get the same initial password: change it after first login.
DO $$
DECLARE
  v_password TEXT := 'CHANGE_ME';   -- <<< set a strong password (min 12 chars) before running
BEGIN
  IF v_password = 'CHANGE_ME' OR length(v_password) < 12 THEN
    RAISE EXCEPTION 'Set v_password in Part 2 to a strong password (min 12 chars). Nothing was created.';
  END IF;

  INSERT INTO "User" ("id", "name", "email", "password", "role", "isActive", "updatedAt")
  VALUES
    (gen_random_uuid()::text, 'Super Admin',    'admin@srivenkatasai.org',   crypt(v_password, gen_salt('bf', 10)), 'SUPER_ADMIN',    true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Content Editor', 'editor@srivenkatasai.org',  crypt(v_password, gen_salt('bf', 10)), 'CONTENT_EDITOR', true, CURRENT_TIMESTAMP),
    (gen_random_uuid()::text, 'Finance Admin',  'finance@srivenkatasai.org', crypt(v_password, gen_salt('bf', 10)), 'FINANCE_ADMIN',  true, CURRENT_TIMESTAMP);
END $$;

-- ─── Part 3: Record this manual script ───────────────────────────────────────
-- Audit trail only (no user data or passwords); Prisma ignores this row.
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count")
VALUES (gen_random_uuid()::text, 'manual', now(), 'v1.2_initial_user_setup.sql',
        'manual: database/scripts/v1.2_initial_user_setup.sql', now(), 1);

COMMIT;

-- ─── Verify (optional, run after COMMIT) ─────────────────────────────────────
-- SELECT "email", "role", "isActive", left("password", 7) AS hash_prefix FROM "User" ORDER BY "role";
-- Expected: 3 rows, hash_prefix = $2a$10$
