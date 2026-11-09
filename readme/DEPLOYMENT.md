# Cloud Deployment: Netlify + Render + Neon

> **Scope:** this guide covers the **development** cloud environment. Production will use Cloudflare Pages (frontend), Cloudflare R2 (media) and Neon. The production backend host is not decided yet, and the production guide is still to be written.

This guide deploys the website to three services:

- **Frontend** (Next.js 14) on **Netlify**
- **Backend** (NestJS) on **Render**
- **Database** (PostgreSQL) on **Neon**

Media files go to **AWS S3**. Local development with Docker, MinIO and Postgres keeps working unchanged.

```
Browser ──HTTPS──► Netlify (Next.js, middleware on Edge)
   │
   ├──HTTPS──► Render (NestJS API, /api/*) ──TLS──► Neon Postgres (pooled connection)
   ├──────────► AWS S3 bucket (images/videos, public read)
   └──────────► Razorpay Checkout, YouTube, Google Maps
```

Deploy in this order:

1. Neon
2. S3
3. Render
4. Netlify
5. Update `FRONTEND_URL` on Render
6. Smoke test

---

## 1. Neon database

### 1.1 Create the database
1. Sign in at https://console.neon.tech and create a project.
   - **Region:** pick **AWS Asia Pacific (Singapore)** so it is close to the Render Singapore region.
   - **Postgres version:** 16, to match local Docker.
2. Create a database `svs_db` and a role, for example `svs_app`. Don't use the owner role for the app if you can avoid it (see 1.6).
3. Open **Connect** and copy two connection strings:
   - **Pooled.** Turn on "Connection pooling". The host contains `-pooler`. This becomes `DATABASE_URL`.
   - **Direct.** Turn pooling off; the host has no `-pooler`. This becomes `DIRECT_URL`.
4. Append `connect_timeout=15` to both strings. Neon pauses its compute after inactivity, and the first connection waits a few seconds for it to wake up.

   ```
   DATABASE_URL="postgresql://svs_app:PASSWORD@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/svs_db?sslmode=require&connect_timeout=15"
   DIRECT_URL="postgresql://svs_app:PASSWORD@ep-xxx.ap-southeast-1.aws.neon.tech/svs_db?sslmode=require&connect_timeout=15"
   ```

Why two URLs:
- The app talks to Neon through its connection pooler (PgBouncer, transaction mode), which handles many short connections cheaply.
- Prisma **migrations** need a direct connection. `schema.prisma` therefore has `directUrl = env("DIRECT_URL")`. Locally both URLs point at Docker Postgres.

### 1.2 Apply the schema (manual)
Migrations are **not** run by Render. You apply them yourself, before deploying backend code that needs them. Pick one method and stick with it.

**Method A: Prisma CLI from your PC (recommended).** It records each migration in the `_prisma_migrations` table, so Prisma always knows what has been applied.

```bash
cd backend
# PowerShell: $env:DATABASE_URL="..."; $env:DIRECT_URL="..."
# Git Bash:
export DATABASE_URL="<neon pooled url>"
export DIRECT_URL="<neon direct url>"

npm run prisma:status    # what is pending?
npm run prisma:deploy    # = prisma migrate deploy (applies pending migrations only)
```

**Method B: SQL scripts in the Neon SQL Editor.**
For a new, empty database, run these scripts from `database/scripts/` in order, connected as the database **owner**:

| Order | Script | What it does |
|---|---|---|
| 1 | `v1.0_initial_db_setup.sql` | Tables, indexes and keys, and records Prisma migration `20260307163420_init` as applied |
| 2 | `v1.1_initial_data_setup.sql` | Website content: pages, deities, timings, poojas, announcements, gallery categories, events |
| 3 | `v1.3_initial_user_setup.sql` | The 3 admin users (**sensitive**) |

How they behave:
- Each script runs in one transaction, checks that the previous step was done, and refuses to run twice.
- For `v1.3`, replace `CHANGE_ME` in the SQL Editor only. Never commit a real password.
- With these scripts you can skip step 1.3 (seeding).

For later schema changes, run the matching `vX.Y_*.sql` script. If a script doesn't insert its own `_prisma_migrations` row, tell Prisma it was applied:

```bash
npx prisma migrate resolve --applied <timestamp>_<name>
```

Otherwise Prisma will try to re-apply the migration later and fail.

Never run `prisma migrate dev`, `prisma migrate reset` or `prisma db push` against Neon. They can drop data. Create new migrations locally with `npm run prisma:migrate -- --name <change>`, commit them, then apply them to Neon with Method A or B.

### 1.3 Seed initial data (once)
The seed creates three admin users. Against Neon it **requires** `SEED_ADMIN_PASSWORD` (at least 12 characters). The well-known local password `Admin@123` is refused in production.

```bash
cd backend
export DATABASE_URL="<neon pooled url>"
export DIRECT_URL="<neon direct url>"
export NODE_ENV=production
export SEED_ADMIN_PASSWORD="<strong unique password>"
npm run prisma:seed
```

- Users, pages, deities and timings are upserted, so running the seed again does not duplicate them.
- **Events are inserted every time**, so run the seed only once per database.
- Change each admin's password after first login, and store the seed password in a password manager.

### 1.4 Optional: copy existing local data
```bash
docker exec svs-postgres-dev pg_dump -U svs_user -d svs_db --data-only --no-owner > svs_data.sql
psql "<neon DIRECT url>" -f svs_data.sql
```
Apply the schema (1.2) first. Use the **direct** URL for `psql`. Delete `svs_data.sql` afterwards, because it contains donor data.

### 1.5 UAT vs production
- Use Neon **branches**: `main` for production, plus a `uat` branch made from it. Each branch has its own connection strings.
- Point the Render/Netlify UAT services at the `uat` branch.
- Apply migrations to `uat` first, test, then apply them to `main`.

### 1.6 Security, backups and limits
- **Least privilege:** the app role needs only read/write on the tables. Keep the owner role for migrations, i.e. use the owner in `DIRECT_URL` and the app role in `DATABASE_URL`, if you separate them.
- **Backups:** Neon keeps point-in-time restore history (the window depends on your plan). Before every manual migration, create a branch as a restore point.
- **Connections:** the pooled URL protects you from running out of connections. Keep one Render instance per database until you know your load.

### 1.7 Rollback
- **Migration failed half-way:** restore from the branch you created before migrating (Neon → Branches → Restore). Or fix the SQL and mark the migration with `prisma migrate resolve --rolled-back <name>`.
- **Whole switch failed:** point Render's `DATABASE_URL`/`DIRECT_URL` back to the previous database and redeploy. Nothing in the code depends on Neon specifically.

---

## 2. Media storage (AWS S3)
MinIO only exists locally, so production needs a real bucket.

1. Create an S3 bucket, e.g. `svs-devastanam-media` in `ap-south-1`. Keep "ACLs disabled (recommended)".
2. Allow public read of objects with a **bucket policy**: turn off "Block public access" for policies only, then add:
   ```json
   { "Version": "2012-10-17", "Statement": [{ "Effect": "Allow", "Principal": "*",
     "Action": "s3:GetObject", "Resource": "arn:aws:s3:::svs-devastanam-media/*" }] }
   ```
3. Create an IAM user for the backend with only `s3:PutObject`, `s3:GetObject` and `s3:DeleteObject` on that bucket. Its access keys go into Render.
4. Leave `AWS_S3_OBJECT_ACL` **empty** on Render. Sending an ACL to a bucket with ACLs disabled makes uploads fail.

---

## 3. Backend on Render

### 3.1 Create the service
**Option 1, Blueprint:** Render → New → Blueprint → select this repo. It reads `render.yaml` and asks for every `sync: false` value.

**Option 2, manual web service** with these settings:

| Setting | Value |
|---|---|
| Runtime | Node |
| Branch | `release/uat-test` (or your production branch) |
| Region | Singapore (cannot be changed later) |
| Root Directory | *(empty)*. The repo has one `package-lock.json` at the root, and Render hides files outside the root directory. |
| Build Command | `npm ci --include=dev && npm run prisma:generate --workspace=backend && npm run build --workspace=backend` |
| Start Command | `npm run start:prod --workspace=backend` |
| Health Check Path | `/api/health` |

Notes:
- **`--include=dev`:** the Nest CLI and Prisma CLI are devDependencies. Because `NODE_ENV=production` is set, npm would skip them and the build would fail.
- **Node version:** comes from `/.nvmrc` (Node 20).
- **Port:** Render sets `PORT` (default 10000) and the app reads it. Nest listens on all interfaces.
- **Free plan:** the service sleeps after inactivity, and the first request then takes up to about a minute. That can make a Razorpay payment verification time out. Use a paid instance for production.

### 3.2 Startup checks
The API refuses to start if:
- `DATABASE_URL` or `JWT_SECRET` is missing (any environment), or
- in production, `FRONTEND_URL`, `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET` is missing, or `JWT_SECRET` is shorter than 32 characters.

If a deploy fails at start, check the Render logs for `Missing required environment variables`.

---

## 4. Frontend on Netlify

1. Netlify → Add new site → Import from Git → select this repo.
2. **Site configuration → Build & deploy → Build settings:**

| Setting | Value |
|---|---|
| Base directory | *(empty = repo root)* |
| Package directory | `frontend` |
| Build command | from `frontend/netlify.toml`: `npm run build --workspace=frontend` |
| Publish directory | leave as auto-detected by the Next.js runtime (`frontend/.next`) |
| Branch to deploy | `release/uat-test` (or your production branch) |

3. Add the environment variables from section 5.2, **before** the first build. `NEXT_PUBLIC_*` values are compiled into the site, so changing one later needs a new deploy.
4. Deploy. Netlify applies its Next.js (OpenNext) adapter automatically. App Router pages run as functions and `middleware.ts` runs on Edge Functions, so the language cookie and the admin redirect keep working.

The Content-Security-Policy in `next.config.mjs` is built from `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_S3_BUCKET_URL` at build time. If the API URL is wrong or missing, the browser blocks API calls (look for CSP errors in the console).

---

## 5. Environment variables

These lists come from the code (`process.env` usages), not only the example files. Placeholder values only; never commit real values.

### 5.1 Render (backend)

| Name | Required? | Example | Secret? | Used in | Notes |
|---|---|---|---|---|---|
| `NODE_ENV` | Yes | `production` | No | `main.ts`, `env.validation.ts` | Turns off Swagger, enables strict checks |
| `PORT` | Set by Render | `10000` | No | `main.ts` | Don't set it yourself |
| `API_PREFIX` | No | `api` | No | `main.ts` | Default `api`; must match the health path |
| `DATABASE_URL` | **Yes** | `postgresql://…-pooler…/svs_db?sslmode=require&connect_timeout=15` | **Yes** | Prisma | Neon **pooled** URL |
| `DIRECT_URL` | **Yes** | `postgresql://…(no -pooler)…/svs_db?sslmode=require&connect_timeout=15` | **Yes** | `schema.prisma` | Neon **direct** URL, used by migrations |
| `JWT_SECRET` | **Yes** | *(generated, at least 32 chars)* | **Yes** | `auth.module.ts`, `jwt.strategy.ts` | The Blueprint generates it. Changing it logs everyone out |
| `JWT_EXPIRES_IN` | No | `7d` | No | `auth.module.ts` | |
| `FRONTEND_URL` | **Yes (prod)** | `https://www.srivenkatasai.org,https://svs-uat.netlify.app` | No | `main.ts` CORS | Comma-separated exact origins, no trailing `/`, no wildcards |
| `RAZORPAY_KEY_ID` | **Yes (prod)** | `rzp_test_…` | No | `donations.service.ts` | Test keys for UAT |
| `RAZORPAY_KEY_SECRET` | **Yes (prod)** | — | **Yes** | `donations.service.ts` | Never in the frontend |
| `AWS_REGION` | No | `ap-south-1` | No | `upload.service.ts` | |
| `AWS_S3_BUCKET` | For uploads | `svs-devastanam-media` | No | `upload.service.ts` | |
| `AWS_ACCESS_KEY_ID` | For uploads | — | **Yes** | `upload.service.ts` | IAM user limited to the bucket |
| `AWS_SECRET_ACCESS_KEY` | For uploads | — | **Yes** | `upload.service.ts` | |
| `AWS_S3_ENDPOINT` | No | *(empty for AWS)* | No | `upload.service.ts` | Only for MinIO/S3-compatible stores; enables path-style URLs |
| `AWS_S3_OBJECT_ACL` | No | *(empty)* | No | `upload.service.ts` | Empty for AWS (bucket policy); `public-read` for local MinIO |
| `THROTTLE_TTL` / `THROTTLE_LIMIT` | No | `60` / `100` | No | `app.module.ts` | Note: the throttler guard is not active yet (known gap) |
| `SEED_ADMIN_PASSWORD` | Seeding only | — | **Yes** | `seed.ts` | Set on your PC when seeding Neon; not needed on Render |

Documented in the past but **not read by the code:**
- `AWS_S3_FORCE_PATH_STYLE`: path-style is switched on automatically when `AWS_S3_ENDPOINT` is set.

### 5.2 Netlify (frontend)
All of these are public: they are compiled into JavaScript that every visitor can read. **Never** put `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, AWS keys or database URLs in a `NEXT_PUBLIC_*` variable.

| Name | Required? | Example | Used in | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | `https://svs-backend.onrender.com/api` | `lib/api.ts`, CSP in `next.config.mjs` | Must include `/api` |
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.srivenkatasai.org` | `app/layout.tsx`, `lib/constants.ts` | SEO/OpenGraph base URL |
| `NEXT_PUBLIC_S3_BUCKET_URL` | Yes | `https://svs-devastanam-media.s3.ap-south-1.amazonaws.com` | `lib/utils.ts`, CSP + `next/image` hosts | No trailing `/` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | For donations | `rzp_test_…` | `donate/page.tsx` | Public key ID only |
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` | For live page | `UCxxxxxxxx` | `live/page.tsx`, `LiveStreamSection.tsx` | Channel ID (starts with `UC`), not the `@handle` |
| `NEXT_PUBLIC_YOUTUBE_LIVE_STREAM_ID` | No | — | `live/page.tsx` | |
| `NODE_VERSION` | No | `20` | Netlify | Already set by `/.nvmrc`; only needed to override |

Listed in `frontend/.env.example` but **not used by the code yet:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_TEMPLE_MAPS_EMBED_URL`: the contact page uses a fixed Google Maps embed.
- `NEXT_PUBLIC_TEMPLE_NAME`, `NEXT_PUBLIC_TEMPLE_LOCATION`.
- `README.md` mentions `NEXT_PUBLIC_YOUTUBE_LIVE_VIDEO_ID`; the code uses `NEXT_PUBLIC_YOUTUBE_LIVE_STREAM_ID`.

Don't set `NODE_ENV=production` on Netlify. The build needs devDependencies (Tailwind, TypeScript, cross-env).

---

## 6. After the first deploys
1. Copy the Netlify site URL (and your custom domain, if you have one) into Render's `FRONTEND_URL` (comma-separated), then redeploy Render.
2. If the Render URL changed, update `NEXT_PUBLIC_API_URL` on Netlify and redeploy Netlify.

## 7. Smoke test

| Check | Expected |
|---|---|
| `https://<render>/api/health` | `{"status":"ok"}` |
| `https://<render>/api/deities` | JSON list (proves the Neon connection works) |
| `https://<render>/api/docs` | 404 (Swagger is off in production) |
| Netlify home page | Loads; no CSP errors in the browser console |
| Language switcher (EN/TE/HI/TA) | Text changes after reload |
| `/admin/dashboard` while logged out | Redirects to `/auth/login` |
| Images, video, YouTube embed, Google Map on `/contact` | Display (not blocked) |

**Known application gaps** (from `CLAUDE.md`; not caused by the deployment):
- **Admin login** and **donations** don't work end to end yet, because the frontend API client doesn't match the backend routes and response format. Expect these two checks to fail until that is fixed.
- **Uploads** have no admin UI wired up. Test them through `POST /api/upload` with a JWT.

## 8. Rollback
- **Netlify:** Deploys → pick the previous deploy → "Publish deploy" (instant).
- **Render:** Events → previous deploy → "Rollback".
- **Database:** see 1.7. Roll back code **before** rolling back a migration, so the running code never expects a schema that no longer exists.
