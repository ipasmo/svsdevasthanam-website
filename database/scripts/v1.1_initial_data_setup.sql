-- =============================================================================
-- v1.1 – Initial data (website content)
-- Sri Venkata Sai Devasthanam
-- =============================================================================
-- Run ORDER:  v1.0_initial_db_setup.sql → v1.1 (this) → v1.3_initial_user_setup.sql
--
-- Run ONCE, after v1.0, connected as the database OWNER (Neon SQL Editor or psql).
-- Runs in ONE transaction: any error rolls everything back.
-- Content mirrors backend/src/prisma/seed.ts (used for local development).
--
--   Part 0  Guards: v1.0 must have been run, and the content tables must be empty
--           (several tables have no unique key, so a second run would duplicate rows).
--   Part 1  Inserts: pages (+ English translations), deities, temple timings,
--           poojas, announcements, gallery categories, events.
--   Part 2  Updates / deletes: none in this version.
--
-- No secrets in this file. Later content changes go in a new versioned script.
-- =============================================================================

BEGIN;

-- ─── Part 0: Guards ──────────────────────────────────────────────────────────
DO $$
DECLARE
  v_table TEXT;
  v_count BIGINT;
BEGIN
  -- Two separate IFs: Postgres plans a whole condition at once, so the EXISTS
  -- query would fail with a raw error if the table is missing.
  IF to_regclass('public."_prisma_migrations"') IS NULL THEN
    RAISE EXCEPTION 'Schema not found. Run v1.0_initial_db_setup.sql first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = '20260307163420_init') THEN
    RAISE EXCEPTION 'Migration 20260307163420_init not recorded. Run v1.0_initial_db_setup.sql first.';
  END IF;

  FOREACH v_table IN ARRAY ARRAY['Page', 'PageTranslation', 'Deity', 'TempleTiming', 'Pooja',
                                 'Announcement', 'GalleryCategory', 'Event'] LOOP
    EXECUTE format('SELECT count(*) FROM %I', v_table) INTO v_count;
    IF v_count > 0 THEN
      RAISE EXCEPTION 'Table "%" already has % row(s). v1.1 must only run once, on empty content tables.', v_table, v_count;
    END IF;
  END LOOP;
END $$;

-- ─── Part 1: Inserts ─────────────────────────────────────────────────────────

-- Pages (+ English translation each)
WITH page_data (slug, title, content) AS (
  VALUES
    ('home',      'Home',            'Welcome to Sri Venkata Sai Devasthanam.'),
    ('about',     'About',           'Sri Venkata Sai Devasthanam is located in Yemmiganur, Kurnool District, Andhra Pradesh.'),
    ('poojas',    'Poojas & Sevas',  'Daily poojas and special sevas performed at the temple.'),
    ('festivals', 'Festivals',       'Annual festivals and celebrations at the temple.'),
    ('gallery',   'Gallery',         'Photo gallery of the temple and events.'),
    ('live',      'Live Darshan',    'Watch live darshan from the temple.'),
    ('annadanam', 'Annadanam',       'Free food service for devotees and pilgrims.'),
    ('timings',   'Temple Timings',  'Daily temple opening and closing timings.'),
    ('news',      'News & Updates',  'Latest news and announcements from the temple.'),
    ('contact',   'Contact Us',      'Get in touch with the temple administration.'),
    ('donate',    'Donate',          'Support the temple through donations.')
),
inserted_pages AS (
  INSERT INTO "Page" ("id", "slug", "status", "updatedAt")
  SELECT gen_random_uuid()::text, slug, 'ACTIVE', CURRENT_TIMESTAMP FROM page_data
  RETURNING "id", "slug"
)
INSERT INTO "PageTranslation" ("id", "pageId", "locale", "title", "content", "updatedAt")
SELECT gen_random_uuid()::text, p."id", 'en', d.title, d.content, CURRENT_TIMESTAMP
FROM inserted_pages p JOIN page_data d ON d.slug = p."slug";

-- Deities
INSERT INTO "Deity" ("id", "slug", "nameEn", "nameTe", "nameHi", "descriptionEn", "significance", "orderIndex", "updatedAt")
SELECT gen_random_uuid()::text, slug, name_en, name_te, name_hi, description_en, significance, order_index, CURRENT_TIMESTAMP
FROM (VALUES
  ('sri-venkata-sai',   'Sri Venkata Sai',   'శ్రీ వేంకట సాయి',      'श्री वेंकट साई',
   'The presiding deity of the temple, Sri Venkata Sai is revered by millions of devotees.',
   'Fulfills the wishes of devotees and blesses them with prosperity and peace.', 1),
  ('lord-ganesha',      'Lord Ganesha',      'శ్రీ గణేష',            'श्री गणेश',
   'The remover of obstacles, worshipped before beginning any auspicious activity.',
   'Bestows wisdom, prosperity and removes all obstacles from the path of devotees.', 2),
  ('goddess-lakshmi',   'Goddess Lakshmi',   'శ్రీ లక్ష్మీ దేవి',     'श्री लक्ष्मी देवी',
   'The goddess of wealth and prosperity, the divine consort of Lord Vishnu.',
   'Blesses devotees with wealth, fortune, health and prosperity.', 3),
  ('lord-shiva',        'Lord Shiva',        'శ్రీ శివుడు',           'श्री शिव',
   'The supreme deity of the Shaivite tradition, the destroyer and transformer.',
   'Grants liberation, destroys evil and blesses devotees with spiritual growth.', 4),
  ('goddess-saraswati', 'Goddess Saraswati', 'శ్రీ సరస్వతి దేవి',     'श्री सरस्वती',
   'The goddess of knowledge, wisdom, arts and learning.',
   'Bestows intellect, knowledge and artistic abilities on her devotees.', 5),
  ('lord-hanuman',      'Lord Hanuman',      'శ్రీ హనుమంతుడు',        'श्री हनुमान',
   'The mighty devotee of Lord Rama, the symbol of strength and devotion.',
   'Protects devotees from evil, grants strength, courage and devotion.', 6)
) AS d (slug, name_en, name_te, name_hi, description_en, significance, order_index);

-- Temple timings
INSERT INTO "TempleTiming" ("id", "activity", "activityTe", "startTime", "endTime", "dayType", "sortOrder", "updatedAt")
SELECT gen_random_uuid()::text, activity, activity_te, start_time, end_time, day_type::"DayType", sort_order, CURRENT_TIMESTAMP
FROM (VALUES
  ('Suprabhatam & Abhishekam', 'సుప్రభాతం & అభిషేకం',         '05:00 AM', '06:30 AM', 'ALL',     1),
  ('Morning Darshan',          'ఉదయం దర్శనం',                 '06:30 AM', '12:00 PM', 'ALL',     2),
  ('Afternoon Break',          'మధ్యాహ్నం విరామం',             '12:00 PM', '04:00 PM', 'ALL',     3),
  ('Evening Darshan',          'సాయంకాలం దర్శనం',             '04:00 PM', '08:30 PM', 'ALL',     4),
  ('Ekanta Seva & Closing',    'ఏకాంత సేవ & మూసివేత',          '08:30 PM', '09:00 PM', 'ALL',     5),
  ('Extended Morning Darshan', 'పొడిగించిన ఉదయం దర్శనం',       '06:00 AM', '12:00 PM', 'WEEKEND', 6)
) AS t (activity, activity_te, start_time, end_time, day_type, sort_order);

-- Poojas
INSERT INTO "Pooja" ("id", "nameEn", "nameTe", "type", "timeEn", "cost", "sortOrder", "updatedAt")
SELECT gen_random_uuid()::text, name_en, name_te, pooja_type::"PoojaType", time_en, cost, sort_order, CURRENT_TIMESTAMP
FROM (VALUES
  ('Suprabhatam',         'సుప్రభాతం',        'DAILY',   '05:00 AM',             NULL::double precision, 1),
  ('Thomala Seva',        'తోమాల సేవ',        'DAILY',   '06:00 AM',             500,  2),
  ('Archana',             'అర్చన',            'DAILY',   '07:00 AM',             50,   3),
  ('Nivedana',            'నివేదన',           'DAILY',   '12:00 PM',             NULL, 4),
  ('Haarathi',            'హారతి',            'DAILY',   '06:00 PM',             NULL, 5),
  ('Ekanta Seva',         'ఏకాంత సేవ',        'DAILY',   '08:30 PM',             NULL, 6),
  ('Abhishekam',          'అభిషేకం',          'WEEKLY',  '06:00 AM (Saturdays)', 1000, 7),
  ('Sahasra Namaarchana', 'సహస్ర నామార్చన',    'SPECIAL', 'By Appointment',       2500, 8),
  ('Kalyanam',            'కళ్యాణం',          'SPECIAL', 'By Appointment',       5000, 9)
) AS p (name_en, name_te, pooja_type, time_en, cost, sort_order);

-- Announcements
INSERT INTO "Announcement" ("id", "titleEn", "titleTe", "titleHi", "isImportant", "isActive", "expiresAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Brahmotsavam 2026 – Registration Open',
   'బ్రహ్మోత్సవం 2026 – నమోదు ప్రారంభమైంది', 'ब्रह्मोत्सव 2026 – पंजीकरण खुला है',
   true, true, '2026-06-30', CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Online Archana & Seva Booking Now Available',
   'ఆన్‌లైన్ అర్చన & సేవ బుకింగ్ ఇప్పుడు అందుబాటులో ఉంది', NULL,
   false, true, NULL, CURRENT_TIMESTAMP);

-- Gallery categories
INSERT INTO "GalleryCategory" ("id", "slug", "label")
VALUES
  (gen_random_uuid()::text, 'temple',    'Temple'),
  (gen_random_uuid()::text, 'festivals', 'Festivals'),
  (gen_random_uuid()::text, 'seva',      'Seva & Poojas');

-- Events
INSERT INTO "Event" ("id", "titleEn", "titleTe", "titleHi", "descriptionEn", "category", "startDate", "endDate", "isActive", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Brahmotsavam 2026', 'బ్రహ్మోత్సవం 2026', 'ब्रह्मोत्सव 2026',
   'The grand annual Brahmotsavam festival celebrated with great devotion over 9 days.',
   'Festival', '2026-05-10', '2026-05-18', true, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'Ugadi Celebrations', 'ఉగాది వేడుకలు', NULL,
   NULL, 'Festival', '2026-03-30', NULL, true, CURRENT_TIMESTAMP);

-- ─── Part 2: Updates / deletes ───────────────────────────────────────────────
-- None in v1.1.

COMMIT;

-- ─── Verify (optional, run after COMMIT) ─────────────────────────────────────
-- SELECT 'pages' t, count(*) FROM "Page" UNION ALL SELECT 'translations', count(*) FROM "PageTranslation"
-- UNION ALL SELECT 'deities', count(*) FROM "Deity" UNION ALL SELECT 'timings', count(*) FROM "TempleTiming"
-- UNION ALL SELECT 'poojas', count(*) FROM "Pooja" UNION ALL SELECT 'announcements', count(*) FROM "Announcement"
-- UNION ALL SELECT 'gallery categories', count(*) FROM "GalleryCategory" UNION ALL SELECT 'events', count(*) FROM "Event";
-- Expected: 11, 11, 6, 6, 9, 2, 3, 2
