# 🕉️ Sri Venkata Sai Devasthanam — Build Reference

## Project Info
- **Temple:** Sri Venkata Sai Devasthanam, Yemmiganur, Kurnool, Andhra Pradesh
- **Domain:** www.srivenkatasai.org
- **Stack:** Next.js 14 · NestJS · PostgreSQL · Prisma · TailwindCSS · AWS S3/MinIO

---

## 1. Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript, TailwindCSS |
| Backend | NestJS, Node.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Role Based Access Control |
| Media | AWS S3 (MinIO for local dev) |
| Deployment | Docker |

---

## 2. Color Palette & Typography

```
Saffron:       #FB9C1B  → Primary
Rust Red:      #C83A00  → Secondary
Golden Yellow: #FFCA32  → Accent
Spring Teal:   #11AD99
Off White:     #F7F6E5  → Background
```

| Usage | Font |
|-------|------|
| Headings | Cinzel |
| Section headings | Playfair Display |
| Body | Noto Sans |
| Navigation | Poppins |

---

## 3. Public Pages

| Page | Key Sections |
|------|-------------|
| Home | Hero, Welcome, Deities, Gallery, Festivals, Live Stream, Timings, Donate CTA |
| About | History, Founders, Architecture, Timeline |
| Deities | Sri Vigneshwara, Hanuman, Sai Baba, Venkateshwara, Shiva, Nava Graha |
| Poojas & Sevas | Daily, Weekly, Special |
| Festivals | Rama Navami, Guru Purnima, Sai Baba Aradhana, Mahashivaratri |
| Gallery | Photos + Videos, categories, zoom, lazy load |
| Live | YouTube embed, past streams |
| Annadanam | Program info + donation option |
| Timings | Daily schedule |
| News | Announcements |
| Contact | Address, Maps, form |
| Donate | Razorpay integration |

---

## 4. Admin CMS

**Roles:** Super Admin · Content Editor · Finance Admin

**Features:** Pages · Deities · Gallery · Videos · Events · Announcements · Timings · Donations · Users

**Page Status Types:** `ACTIVE` · `DISABLED` · `DRAFT` · `SCHEDULED`

---

## 5. Multi-Language Support

| Code | Language |
|------|----------|
| `en` | English |
| `te` | Telugu |
| `hi` | Hindi |

- Library: `next-intl`
- Locale stored in cookie (no URL prefix)
- Switcher in header

---

## 6. Database Models

```
Users · Pages · PageTranslations · Deities · Events
GalleryCategories · GalleryImages · Videos · TempleTimings · Donations · Announcements
```

---

## 7. API Endpoints

```
POST   /auth/login
POST   /auth/logout
GET    /pages               GET    /pages/:slug
POST   /admin/pages         PUT    /admin/pages/:id        DELETE /admin/pages/:id
GET    /deities             POST   /admin/deities
GET    /gallery             POST   /admin/gallery
GET    /events              POST   /admin/events
GET    /announcements       POST   /admin/announcements
POST   /donations
```

---

## 8. Folder Structure

```
srivenkatasai-website_v3/
├── frontend/
│   ├── public/
│   │   ├── manifest.json
│   │   └── images/icons/         # 8 PWA icons (generate-icons.mjs)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   ├── middleware.ts
│   │   │   ├── (public)/         # All public pages
│   │   │   ├── (admin)/          # Admin CMS pages
│   │   │   └── auth/login/
│   │   ├── components/
│   │   │   ├── layout/           # Navbar, Footer, LanguageSwitcher, AnnouncementBanner
│   │   │   ├── home/             # HeroBanner, WelcomeSection, DeityPreview, etc.
│   │   │   └── ui/               # Button, Card, Badge, Modal, LoadingSpinner
│   │   ├── lib/
│   │   │   ├── constants.ts
│   │   │   ├── utils.ts
│   │   │   └── api.ts
│   │   ├── types/index.ts
│   │   ├── store/authStore.ts
│   │   └── i18n/
│   │       ├── request.ts
│   │       └── messages/         # en.json, te.json, hi.json
│   ├── __tests__/
│   │   ├── unit/                 # utils, api, authStore
│   │   └── components/           # Button, LanguageSwitcher, Navbar
│   ├── __mocks__/
│   ├── jest.config.js
│   ├── jest.setup.ts
│   ├── generate-icons.mjs
│   └── .env.local
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── prisma/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── pages/
│   │   ├── deities/
│   │   ├── gallery/
│   │   ├── events/
│   │   ├── announcements/
│   │   ├── timings/
│   │   ├── donations/
│   │   ├── videos/
│   │   └── upload/
│   ├── test/
│   │   ├── unit/                 # auth, deities, announcements, donations, pages
│   │   └── controllers/          # deities controller
│   ├── prisma/schema.prisma
│   └── .env
└── docker/
    ├── docker-compose.dev.yml
    ├── docker-compose.prod.yml
    └── nginx.conf
```

---

## 9. Environment Variables

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_S3_BUCKET_URL=http://localhost:9000/svs-devastanam-media
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=@srivenkatasai
NEXT_PUBLIC_YOUTUBE_LIVE_STREAM_ID=live_stream_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_TEMPLE_MAPS_EMBED_URL=https://maps.google.com/maps?q=Yemmiganur+Kurnool
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
NEXT_PUBLIC_TEMPLE_NAME=Sri Venkata Sai Devasthanam
NEXT_PUBLIC_TEMPLE_LOCATION=Yemmiganur, Kurnool, Andhra Pradesh
```

**`backend/.env`**
```env
DATABASE_URL=postgresql://svs_user:svs_pass@localhost:5432/svs_db
JWT_SECRET=svs_jwt_secret_change_in_production_min_32_chars
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=ap-south-1
AWS_S3_BUCKET=svs-devastanam-media
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_FORCE_PATH_STYLE=true
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## 10. Run Commands

```bash
# 1. Start PostgreSQL + MinIO
cd docker && docker compose -f docker-compose.dev.yml up postgres minio minio-init -d

# 2. Backend
cd backend && npm install
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev

# 3. Frontend
cd frontend && npm install
node generate-icons.mjs        # run once to generate PWA icons
npm run dev
```

**Service URLs**

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000/api |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| MinIO Console | http://localhost:9001 |

MinIO login: `minioadmin` / `minioadmin`

---

## 11. Testing

```bash
# Frontend
cd frontend
npm test                    # watch mode
npm run test:coverage       # coverage report

# Backend
cd backend
npm test
npm run test:coverage
```

| Suite | Files |
|-------|-------|
| Frontend unit | `utils`, `api`, `authStore` |
| Frontend components | `Button`, `LanguageSwitcher`, `Navbar` |
| Backend unit | `auth`, `deities`, `announcements`, `donations`, `pages` |
| Backend controllers | `deities` |

> **VS Code crash on coverage:** Run coverage from the terminal, not the VS Code
> Test UI. Add `NODE_OPTIONS=--max-old-space-size=4096` to the npm script and use
> `coverageProvider: 'babel'` in `jest.config.js`.

---

## 12. Errors & Fixes Log

| # | Error | Fix |
|---|-------|-----|
| 1 | `helmet()` not callable (TS2349) | `import helmet from 'helmet'` + `esModuleInterop: true` in tsconfig |
| 2 | `Cannot find module 'razorpay'` | `npm install razorpay` · use `require()` · remove `@types/razorpay` |
| 3 | `DATABASE_URL` env var not found | Create `backend/.env` with all required vars |
| 4 | 404 on `localhost:3000/en` | Switch to cookie-based locale, set `localePrefix: 'never'` in middleware |
| 5 | LanguageSwitcher "Return not allowed" | Rewrote component — previous edit duplicated JSX return blocks |
| 6 | `nav.poojassevas` missing translation | Add `i18nKey` to `NavItem` type · populate in `NAV_ITEMS` · use in Navbar |
| 7 | Navbar missing imports | Remove `DonateButton`, `Globe`, `LANGUAGES` orphan imports |
| 8 | Donate page wrong API methods | `createOrder` → `create` · `verifyPayment` → `verify` · fix field names |
| 9 | Login double `.data` unwrap | `response.data.user` → `response.user` (API client already unwraps) |
| 10 | Admin: `deity.icon` undefined | Replace with static `🕉️` emoji |
| 11 | Admin: `cat.label` undefined | `cat.label` → `cat.name` |
| 12 | Admin: `t.startTime`/`t.endTime` undefined | Replace with single `t.time` field |
| 13 | Unused `Image` import warnings | Remove `import Image from 'next/image'` in HeroBanner & GalleryPreview |
| 14 | `manifest.json` 404 | Create `frontend/public/manifest.json` |
| 15 | PWA icons 404 | Run `node generate-icons.mjs` to generate 8 saffron PNG icons |
| 16 | No local S3 storage | Add MinIO service to `docker-compose.dev.yml` · configure path-style in upload service |
