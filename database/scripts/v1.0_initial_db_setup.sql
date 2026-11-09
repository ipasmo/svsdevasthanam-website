-- =============================================================================
-- v1.0 – Initial database schema (tables only)
-- Sri Venkata Sai Devasthanam
-- =============================================================================
-- Run ORDER:  v1.0 (this) → v1.1_initial_data_setup.sql → v1.3_initial_user_setup.sql
--
-- Run ONCE on an EMPTY database (Neon SQL Editor connected as the database OWNER,
-- or psql with the DIRECT, non "-pooler" connection string). Postgres 16.
-- Runs in ONE transaction: any error rolls everything back.
--
--   Part 0  Safety guard: stops if the schema already exists.
--   Part 1  Schema: identical to Prisma migration 20260307163420_init
--           (backend/prisma/migrations/20260307163420_init/migration.sql).
--   Part 2  Prisma migration history: records 20260307163420_init as applied,
--           so `prisma migrate status/deploy` stays in sync later.
--
-- No data and no secrets in this file.
-- Source of truth stays schema.prisma + backend/prisma/migrations. If the schema
-- changes, add a new Prisma migration AND a new versioned script here; never edit
-- a script that has already been run.
-- =============================================================================

BEGIN;

-- ─── Part 0: Safety guard ────────────────────────────────────────────────────
DO $$
BEGIN
  IF to_regclass('public."User"') IS NOT NULL
     OR to_regclass('public."_prisma_migrations"') IS NOT NULL THEN
    RAISE EXCEPTION 'Schema already exists in this database. v1.0 must only run on an empty database.';
  END IF;
END $$;

-- ─── Part 1: Schema (Prisma migration 20260307163420_init) ───────────────────

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'CONTENT_EDITOR', 'FINANCE_ADMIN');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('ACTIVE', 'DISABLED', 'DRAFT', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PoojaType" AS ENUM ('DAILY', 'WEEKLY', 'SPECIAL');

-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('ALL', 'WEEKEND', 'WEEKDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CONTENT_EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "refreshToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PageStatus" NOT NULL DEFAULT 'ACTIVE',
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageTranslation" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameTe" TEXT,
    "nameHi" TEXT,
    "descriptionEn" TEXT NOT NULL,
    "descriptionTe" TEXT,
    "descriptionHi" TEXT,
    "significance" TEXT,
    "imageUrl" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rituals" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "categoryId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "description" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleTe" TEXT,
    "titleHi" TEXT,
    "descriptionEn" TEXT,
    "category" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleTe" TEXT,
    "titleHi" TEXT,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempleTiming" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "activityTe" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "dayType" "DayType" NOT NULL DEFAULT 'ALL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempleTiming_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pooja" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameTe" TEXT,
    "nameHi" TEXT,
    "descriptionEn" TEXT,
    "type" "PoojaType" NOT NULL DEFAULT 'DAILY',
    "timeEn" TEXT,
    "cost" DOUBLE PRECISION,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pooja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "panCard" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "purpose" TEXT NOT NULL,
    "message" TEXT,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "receiptSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_slug_idx" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PageTranslation_pageId_locale_key" ON "PageTranslation"("pageId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Deity_slug_key" ON "Deity"("slug");

-- CreateIndex
CREATE INDEX "Deity_slug_idx" ON "Deity"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_slug_key" ON "GalleryCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeId_key" ON "Video"("youtubeId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_razorpayOrderId_key" ON "Donation"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Donation_donorEmail_idx" ON "Donation"("donorEmail");

-- CreateIndex
CREATE INDEX "Donation_razorpayOrderId_idx" ON "Donation"("razorpayOrderId");

-- AddForeignKey
ALTER TABLE "PageTranslation" ADD CONSTRAINT "PageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GalleryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Part 2: Prisma migration history ────────────────────────────────────────
-- Same table Prisma creates itself. The checksum is the SHA-256 of
-- backend/prisma/migrations/20260307163420_init/migration.sql (LF line endings).
CREATE TABLE "_prisma_migrations" (
    "id"                    VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum"              VARCHAR(64) NOT NULL,
    "finished_at"           TIMESTAMPTZ,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        TIMESTAMPTZ,
    "started_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
);

INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
VALUES (gen_random_uuid()::text, '2fbe226aaa5126aad1eb69754a5e5db608a9a7458d309acee2e966e4f987f940',
        now(), '20260307163420_init', now(), 1);

COMMIT;

-- ─── Verify (optional, run after COMMIT) ─────────────────────────────────────
-- SELECT count(*) AS tables FROM pg_tables WHERE schemaname = 'public';      -- expected: 13
-- SELECT migration_name, finished_at FROM "_prisma_migrations";              -- expected: 20260307163420_init
