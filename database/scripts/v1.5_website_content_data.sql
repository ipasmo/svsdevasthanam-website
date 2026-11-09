-- =============================================================================
-- v1.5 – Data: align database content with the website (prompt.md spec)
-- Sri Venkata Sai Devasthanam
-- =============================================================================
-- Run ORDER:  … v1.4_festival_and_deity_schema.sql → v1.5 (this)
--
-- Run ONCE, connected as the database OWNER (Neon SQL Editor).
-- Runs in ONE transaction: any error rolls everything back.
--
-- Why: v1.1 loaded generic sample data from seed.ts. The website
-- (frontend/src/lib/constants.ts and the Festivals page) follows the build spec
-- in prompt.md. This script makes the database match the website, so pages can
-- read from the API without changing what visitors see or the deity page URLs.
--
--   Part 0  Guards: v1.1 and v1.4 must have been run; this script must not have run.
--   Part 1  Deletes exactly the sample rows v1.1 inserted (deities, timings, poojas,
--           2 outdated sample events). Stops if the counts differ (someone edited them).
--   Part 2  Inserts website data: 6 deities, 12 timings, 8 poojas, 12 festivals.
--   Part 3  Records this script in "_prisma_migrations" as a "manual" row.
--
-- Translations: Telugu/Hindi deity names are new; other Telugu names are reused from
-- v1.1 where the item matches. Everything else is NULL (site falls back to English).
-- Please have the temple review: names, timings, seva prices, festival months.
-- Not touched: pages, announcements, gallery categories, users.
-- =============================================================================

BEGIN;

-- ─── Part 0: Guards ──────────────────────────────────────────────────────────
DO $$
BEGIN
  IF to_regclass('public."_prisma_migrations"') IS NULL THEN
    RAISE EXCEPTION 'Schema not found. Run v1.0_initial_db_setup.sql first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = 'v1.1_initial_data_setup.sql') THEN
    RAISE EXCEPTION 'v1.1_initial_data_setup.sql is not recorded. Run it first.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = 'v1.4_festival_and_deity_schema.sql') THEN
    RAISE EXCEPTION 'v1.4_festival_and_deity_schema.sql is not recorded. Run it first.';
  END IF;
  IF EXISTS (SELECT 1 FROM "_prisma_migrations" WHERE migration_name = 'v1.5_website_content_data.sql') THEN
    RAISE EXCEPTION 'v1.5 has already been applied to this database.';
  END IF;
  IF EXISTS (SELECT 1 FROM "Festival") THEN
    RAISE EXCEPTION 'Festival table is not empty. v1.5 expects the state right after v1.4.';
  END IF;
END $$;

-- ─── Part 1: Remove v1.1 sample rows (exact matches only) ────────────────────
DO $$
DECLARE
  v_deleted BIGINT;
BEGIN
  DELETE FROM "Deity" WHERE "slug" IN
    ('sri-venkata-sai', 'lord-ganesha', 'goddess-lakshmi', 'lord-shiva', 'goddess-saraswati', 'lord-hanuman');
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 6 THEN
    RAISE EXCEPTION 'Expected to remove 6 sample deities, found %. Data was changed after v1.1; review manually.', v_deleted;
  END IF;

  DELETE FROM "TempleTiming" WHERE "activity" IN
    ('Suprabhatam & Abhishekam', 'Morning Darshan', 'Afternoon Break', 'Evening Darshan',
     'Ekanta Seva & Closing', 'Extended Morning Darshan');
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 6 THEN
    RAISE EXCEPTION 'Expected to remove 6 sample timings, found %. Data was changed after v1.1; review manually.', v_deleted;
  END IF;

  DELETE FROM "Pooja" WHERE "nameEn" IN
    ('Suprabhatam', 'Thomala Seva', 'Archana', 'Nivedana', 'Haarathi', 'Ekanta Seva',
     'Abhishekam', 'Sahasra Namaarchana', 'Kalyanam');
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 9 THEN
    RAISE EXCEPTION 'Expected to remove 9 sample poojas, found %. Data was changed after v1.1; review manually.', v_deleted;
  END IF;

  -- Outdated sample events (dates already passed); festivals now live in "Festival".
  DELETE FROM "Event" WHERE ("titleEn", "startDate") IN
    (('Brahmotsavam 2026', '2026-05-10'::timestamp), ('Ugadi Celebrations', '2026-03-30'::timestamp));
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  IF v_deleted <> 2 THEN
    RAISE EXCEPTION 'Expected to remove 2 sample events, found %. Data was changed after v1.1; review manually.', v_deleted;
  END IF;
END $$;

-- ─── Part 2: Website data ────────────────────────────────────────────────────

-- Deities (slugs match the website URLs /deities/<slug>)
INSERT INTO "Deity" ("id", "slug", "nameEn", "nameTe", "nameHi", "shortDescriptionEn", "descriptionEn",
                     "significance", "rituals", "imageUrl", "orderIndex", "updatedAt")
SELECT gen_random_uuid()::text, slug, name_en, name_te, name_hi, short_en, description_en,
       significance, rituals::jsonb, image_url, order_index, CURRENT_TIMESTAMP
FROM (VALUES
  ('vigneshwara', 'Sri Vigneshwara Swamy', 'శ్రీ విఘ్నేశ్వర స్వామి', 'श्री विघ्नेश्वर स्वामी',
   'Lord of Beginnings, Remover of Obstacles',
   'Sri Vigneshwara Swamy (Lord Ganesha) is the son of Lord Shiva and Goddess Parvati. He is worshipped as the god of beginnings, the remover of obstacles, and the patron of arts, sciences, and intellect. Before any important undertaking, devotees seek his blessings.',
   'Worshipped first before any religious ceremony or auspicious beginning. His presence ensures the removal of all hurdles and obstacles.',
   '["Modak offering", "Durva grass archana", "Ganesh Chaturthi celebrations", "Monday special poojas"]',
   '/images/deities/vigneshwara.jpg', 1),
  ('hanuman', 'Lord Sri Hanuman', 'శ్రీ హనుమంతుడు', 'श्री हनुमान',
   'Devoted Servant of Lord Rama, Symbol of Strength',
   'Lord Hanuman is the epitome of devotion, strength, and selfless service. He is the greatest devotee of Lord Rama and is believed to be ever-present wherever the name of Rama is chanted. He bestows courage, physical strength, and spiritual wisdom.',
   'Protector from evil spirits and negative energies. Grants strength, courage, and unwavering devotion.',
   '["Tuesday and Saturday special poojas", "Hanuman Chalisa recitation", "Sundara Kanda parayanam"]',
   '/images/deities/hanuman.jpg', 2),
  ('sai-baba', 'Sai Baba', 'సాయి బాబా', 'साईं बाबा',
   'Universal Saint, Embodiment of Love and Unity',
   'Shirdi Sai Baba was a spiritual master and saint revered by both Hindus and Muslims. His teachings centered on love, forgiveness, helping others, charity, contentment, inner peace, and devotion to God and guru. He is known for his message ''Sabka Malik Ek'' (One God for All).',
   'Transcends religious boundaries, embraced by all. Known for healing the sick and fulfilling devotees'' wishes.',
   '["Thursday special pooja with Udi (sacred ash)", "Sai Satcharitra parayanam", "Sai Aradhana celebrations"]',
   '/images/deities/sai-baba.jpg', 3),
  ('venkateshwara', 'Lord Sri Venkateshwara Swamy', 'శ్రీ వేంకటేశ్వర స్వామి', 'श्री वेंकटेश्वर स्वामी',
   'Lord of Seven Hills, Provider of Blessings',
   'Lord Sri Venkateshwara Swamy, also known as Balaji or Srinivasa, is a form of Lord Vishnu. He is the presiding deity of the Tirumala Venkateswara Temple and is one of the most widely worshipped deities in India. He is believed to fulfill the wishes of his devotees.',
   'Grants material and spiritual prosperity. The main deity of this temple, representing divine grace and compassion.',
   '["Daily Suprabhatam", "Archana with Tulasi", "Saturdays special seva", "Brahmotsavam celebrations"]',
   '/images/deities/venkateshwara.jpg', 4),
  ('shiva', 'Lord Shiva', 'శ్రీ శివుడు', 'श्री शिव',
   'The Auspicious One, Destroyer and Transformer',
   'Lord Shiva is one of the principal deities of Hinduism — the Supreme Being in Shaivism. He is the Destroyer within the Trimurti, the three aspects of the divine in Hinduism. Shiva is also worshipped as the patron deity of yoga, meditation, and the arts.',
   'Represents destruction of evil and transformation. Worshipped for liberation (moksha), peace, and spiritual awakening.',
   '["Monday special abhishekam", "Maha Shivaratri celebrations", "Pradosha pooja", "Rudrabhishekam"]',
   '/images/deities/shiva.jpg', 5),
  ('nava-graha', 'Nava Graha', 'నవగ్రహాలు', 'नवग्रह',
   'Nine Celestial Planets, Cosmic Influences',
   'Nava Graha refers to the nine celestial bodies in Hindu astrology — Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu, and Ketu. They are said to influence every aspect of human life.',
   'Worshipping Nava Graha neutralizes negative planetary influences and enhances positive ones in one''s horoscope.',
   '["Nava Graha homa", "Saturday Shani pooja", "Sunday Surya namaskar", "Rahu-Ketu shanti puja"]',
   '/images/deities/nava-graha.jpg', 6)
) AS d (slug, name_en, name_te, name_hi, short_en, description_en, significance, rituals, image_url, order_index);

-- Temple timings (website shows "5:30 - 7:00 AM"; stored as start/end)
INSERT INTO "TempleTiming" ("id", "activity", "activityTe", "startTime", "endTime", "dayType", "sortOrder", "updatedAt")
SELECT gen_random_uuid()::text, activity, activity_te, start_time, end_time, day_type::"DayType", sort_order, CURRENT_TIMESTAMP
FROM (VALUES
  ('Temple Opens',                    NULL,                     '05:30 AM', NULL,       'ALL',      1),
  ('Suprabhatam & Abhishekam',        'సుప్రభాతం & అభిషేకం',   '05:30 AM', '07:00 AM', 'ALL',      2),
  ('Morning Darshan',                 'ఉదయం దర్శనం',           '07:00 AM', '12:00 PM', 'ALL',      3),
  ('Noon Naivedyam',                  NULL,                     '12:00 PM', NULL,       'ALL',      4),
  ('Annadanam (Lunch Prasadam)',      NULL,                     '12:30 PM', '01:30 PM', 'ALL',      5),
  ('Afternoon Break (Temple Closed)', 'మధ్యాహ్నం విరామం',       '01:30 PM', '04:00 PM', 'ALL',      6),
  ('Evening Darshan Opens',           NULL,                     '04:00 PM', NULL,       'ALL',      7),
  ('Sandhya Archana',                 NULL,                     '06:00 PM', NULL,       'ALL',      8),
  ('Evening Naivedyam',               NULL,                     '07:30 PM', NULL,       'ALL',      9),
  ('Ekanta Seva (Closing Prayers)',   NULL,                     '08:00 PM', NULL,       'ALL',      10),
  ('Temple Closes',                   NULL,                     '08:30 PM', NULL,       'ALL',      11),
  ('Extended Darshan',                NULL,                     '04:00 PM', '10:00 PM', 'WEEKEND',  12)
) AS t (activity, activity_te, start_time, end_time, day_type, sort_order);

-- Poojas & sevas (cost in INR)
INSERT INTO "Pooja" ("id", "nameEn", "nameTe", "descriptionEn", "type", "timeEn", "notes", "cost", "sortOrder", "updatedAt")
SELECT gen_random_uuid()::text, name_en, name_te, description_en, pooja_type::"PoojaType", time_en, notes, cost, sort_order, CURRENT_TIMESTAMP
FROM (VALUES
  ('Suprabhatam', 'సుప్రభాతం', 'Morning awakening prayer offering to the Lord',
   'DAILY', '5:30 AM', 'Daily, begins the day''s worship', NULL::double precision, 1),
  ('Abhishekam', 'అభిషేకం', 'Ritual bathing of the deity with sacred substances including milk, honey, yoghurt, and rosewater',
   'DAILY', '6:00 AM', 'Daily ritual with 16 sacred items', NULL, 2),
  ('Naivedyam', NULL, 'Offering of prasadam (sacred food) to the deities',
   'DAILY', '8:00 AM & 12:00 PM & 7:00 PM', 'Three times daily', NULL, 3),
  ('Maha Archana', NULL, 'Complete archana with 108 names of the deity',
   'DAILY', '9:00 AM', 'Book in advance', 116, 4),
  ('Sahasranama Archana', 'సహస్ర నామార్చన', 'Archana with 1008 names of the Lord',
   'SPECIAL', 'On Request', 'Special seva, advance booking required', 501, 5),
  ('Kalyanam (Celestial Wedding)', 'కళ్యాణం', 'Ritual depicting the divine wedding of the Lord',
   'WEEKLY', 'Sunday 10:00 AM', 'Weekly special seva', 1116, 6),
  ('Annadanam', NULL, 'Community meal offering blessed by the temple',
   'DAILY', '12:30 PM', 'Sponsorship available, contact temple office', 5000, 7),
  ('Maha Rudrabhishekam', NULL, 'Grand abhishekam with Rudra mantras for Lord Shiva',
   'SPECIAL', 'On Request', 'Special occasion seva, 3 hours duration', 2116, 8)
) AS p (name_en, name_te, description_en, pooja_type, time_en, notes, cost, sort_order);

-- Festivals (recurring; month is approximate, exact date left empty – set per year if needed)
INSERT INTO "Festival" ("id", "slug", "nameEn", "nameTe", "nameHi", "descriptionEn", "month", "icon",
                        "isHighlighted", "orderIndex", "updatedAt")
SELECT gen_random_uuid()::text, slug, name_en, name_te, name_hi, description_en, month, icon,
       is_highlighted, order_index, CURRENT_TIMESTAMP
FROM (VALUES
  ('brahmotsavam', 'Brahmotsavam', 'బ్రహ్మోత్సవం', 'ब्रह्मोत्सव',
   'The grandest annual festival of Sri Venkata Sai Devasthanam, celebrated over 9 days with special poojas, processions, cultural programs, and mass annadanam.',
   'March / April', '🎺', true, 1),
  ('rama-navami', 'Rama Navami', NULL, NULL,
   'Birth anniversary of Lord Rama celebrated with special poojas, Ramayana parayanam, and cultural programs.',
   'March / April', '🏹', false, 2),
  ('hanuman-jayanti', 'Hanuman Jayanti', NULL, NULL,
   'Birthday of Lord Hanuman celebrated with Sundara Kanda parayanam, special abhishekam, and devotional songs.',
   'April', '🙏', false, 3),
  ('sai-baba-aradhana', 'Sai Baba Aradhana', NULL, NULL,
   'The divine mahanirvana day of Shirdi Sai Baba observed with special poojas, bhajans, and Sai Satcharitra parayanam.',
   'October', '⭐', true, 4),
  ('maha-shivaratri', 'Maha Shivaratri', NULL, NULL,
   'The great night of Lord Shiva celebrated with all-night vigil, rudrabhishekam, and special poojas.',
   'February / March', '🌙', false, 5),
  ('guru-purnima', 'Guru Purnima', NULL, NULL,
   'Day of gratitude to all gurus, observed with special poojas, discourses, and devotees seeking blessings.',
   'July', '✨', false, 6),
  ('ganesh-chaturthi', 'Ganesh Chaturthi', NULL, NULL,
   '10-day celebration of Lord Ganesha with daily poojas, cultural programs, and grand immersion on the final day.',
   'August / September', '🐘', false, 7),
  ('navaratri', 'Navaratri', NULL, NULL,
   'Nine auspicious nights dedicated to Goddess Durga, Lakshmi, and Saraswati with special daily poojas.',
   'September / October', '🌺', false, 8),
  ('deepavali', 'Deepavali', NULL, NULL,
   'Festival of lights celebrated with special temple illumination, fireworks, and midnight lakshmi pooja.',
   'October / November', '🪔', false, 9),
  ('vaikunta-ekadashi', 'Vaikunta Ekadashi', NULL, NULL,
   'Sacred ekadashi dedicated to Lord Vishnu with special midnight darshan and door of liberation open for devotees.',
   'December / January', '🚪', false, 10),
  ('ugadi', 'Ugadi', 'ఉగాది', NULL,
   'Telugu New Year celebrated with special poojas, panchangam reading, and community celebrations.',
   'March / April', '🌟', false, 11),
  ('karthika-masa', 'Karthika Masa', NULL, NULL,
   'Holy month dedicated to Lord Shiva and Vishnu, with daily diya lighting, special poojas throughout the month.',
   'November', '🕯️', false, 12)
) AS f (slug, name_en, name_te, name_hi, description_en, month, icon, is_highlighted, order_index);

-- ─── Part 3: Record this manual script ───────────────────────────────────────
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "started_at", "applied_steps_count")
VALUES (gen_random_uuid()::text, 'manual', now(), 'v1.5_website_content_data.sql',
        'manual: database/scripts/v1.5_website_content_data.sql', now(), 1);

COMMIT;

-- ─── Verify (optional, run after COMMIT) ─────────────────────────────────────
-- SELECT 'deities' t, count(*) FROM "Deity" UNION ALL SELECT 'timings', count(*) FROM "TempleTiming"
-- UNION ALL SELECT 'poojas', count(*) FROM "Pooja" UNION ALL SELECT 'festivals', count(*) FROM "Festival"
-- UNION ALL SELECT 'events', count(*) FROM "Event";
-- Expected: 6, 12, 8, 12, 0
-- SELECT "slug", "nameEn", "nameTe" FROM "Deity" ORDER BY "orderIndex";
