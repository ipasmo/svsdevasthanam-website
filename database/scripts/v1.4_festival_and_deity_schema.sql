-- =============================================================================
-- v1.4 – Schema: Festival table + Deity short description
-- Sri Venkata Sai Devasthanam
-- =============================================================================
-- Run ORDER:  … v1.2_initial_user_setup.sql → v1.4 (this) → v1.5_website_content_data.sql
--
-- Run ONCE, connected as the database OWNER (Neon SQL Editor). Postgres 16.
-- Runs in ONE transaction: any error rolls everything back.
--
--   Part 0  Guards: v1.0 must have been run; this script must not have run yet.
--   Part 1  Schema: identical to Prisma migration
--           20261109120000_festivals_and_deity_short_description
--           (backend/prisma/migrations/20261109120000_festivals_and_deity_short_description/migration.sql).
--           - Deity: new optional column "shortDescriptionEn"
--           - New table "Festival" (recurring annual festivals; month and date optional)
--   Part 2  Records this script in "_prisma_migrations" as a "manual" row.
--
-- No data and no secrets in this file.
-- =============================================================================

BEGIN;

-- ─── Part 0: Guards ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF to_regclass('public."_prisma_migrations"') IS NULL THEN
    RAISE EXCEPTION 'Schema not found. Run v1.0_initial_db_setup.sql first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = 'v1.0_initial_db_setup.sql') THEN
    RAISE EXCEPTION 'v1.0_initial_db_setup.sql is not recorded. Run v1.0_initial_db_setup.sql first.';
  END IF;
  IF EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = 'v1.4_festival_and_deity_schema.sql')
     OR to_regclass('public."Festival"') IS NOT NULL THEN
    RAISE EXCEPTION 'v1.4 has already been applied to this database.';
  END IF;
END $$;

-- ─── Part 1: Schema (Prisma migration 20261109120000_festivals_and_deity_short_description) ───

-- AlterTable
ALTER TABLE "Deity" ADD COLUMN     "shortDescriptionEn" TEXT;

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameTe" TEXT,
    "nameHi" TEXT,
    "descriptionEn" TEXT,
    "month" TEXT,
    "date" TIMESTAMP(3),
    "icon" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Festival_slug_key" ON "Festival"("slug");

-- ─── Part 2: Record this manual script ───────────────────────────────────────
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count")
VALUES (gen_random_uuid()::text, 'manual', now(), 'v1.4_festival_and_deity_schema.sql',
        'manual: database/scripts/v1.4_festival_and_deity_schema.sql', now(), 1);

COMMIT;

-- ─── Verify (optional, run after COMMIT) ─────────────────────────────────────
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'Deity' AND column_name = 'shortDescriptionEn';  -- 1 row
-- SELECT count(*) FROM "Festival";                                                                                     -- 0
