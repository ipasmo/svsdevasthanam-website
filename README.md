# 🕉️ Sri Venkata Sai Devasthanam – Official Website v3

Production-ready temple website for **Sri Venkata Sai Devasthanam**, Yemmiganur, Kurnool District, Andhra Pradesh, India.

---

## ✨ Features

| Area | Details |
|------|---------|
| **Public Website** | 14 pages – Home, About, Deities (6), Poojas, Festivals, Gallery, Live, Annadanam, Timings, News, Contact, Donate |
| **Admin CMS** | Role-based dashboard to manage all content, gallery, timings, events, donations, users |
| **Multi-language** | English, Telugu (తెలుగు), Hindi (हिंदी) via next-intl |
| **Donations** | Razorpay integration with 80G tax receipt |
| **Media Storage** | AWS S3 for images/videos |
| **Page Visibility** | ACTIVE / DRAFT / DISABLED / SCHEDULED per page |
| **Docker** | Dev & prod docker-compose with Nginx reverse proxy |

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **TailwindCSS 3** with custom saffron/rust/golden/teal/offwhite palette
- **next-intl** · **Zustand** · **TanStack Query v5** · **Framer Motion**
- **React Hook Form** + **Zod** validation
- **Radix UI** components · **Lucide React** icons

### Backend
- **NestJS 10** (TypeScript)
- **Prisma 5** ORM + **PostgreSQL 16**
- **Passport-JWT** authentication
- **Razorpay** payments · **AWS SDK** S3

### DevOps
- **Docker** + **Docker Compose** (dev & prod)
- **Nginx** reverse proxy with SSL, rate limiting, gzip
- Multi-stage Dockerfiles for optimized images

---

## 📁 Monorepo Structure

```
srivenkatasai-website_v3/
├── frontend/               # Next.js 14 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/   # Public pages (14)
│   │   │   ├── (admin)/    # Admin CMS (9 pages)
│   │   │   └── auth/       # Login page
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, Footer, etc.
│   │   │   ├── home/       # Home section components
│   │   │   └── ui/         # Reusable UI
│   │   ├── lib/            # API client, utils, constants
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript interfaces
│   │   └── i18n/           # next-intl config
│   └── messages/           # en.json, te.json, hi.json
├── backend/                # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT auth
│   │   ├── users/          # Admin users CRUD
│   │   ├── pages/          # CMS pages
│   │   ├── deities/        # Temple deities
│   │   ├── gallery/        # Photo gallery
│   │   ├── events/         # Festivals & events
│   │   ├── announcements/  # Banner announcements
│   │   ├── timings/        # Temple schedule
│   │   ├── donations/      # Razorpay donations
│   │   ├── videos/         # YouTube videos
│   │   ├── upload/         # AWS S3 upload
│   │   └── prisma/         # Prisma service
│   └── prisma/
│       └── schema.prisma   # DB schema (11 models)
└── docker/
    ├── docker-compose.dev.yml
    ├── docker-compose.prod.yml
    └── nginx.conf
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)
- AWS S3 bucket
- Razorpay account (test keys for dev)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/srivenkatasai-website_v3.git
cd srivenkatasai-website_v3

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

### 2. Environment Variables

**Frontend** – copy `frontend/.env.example` → `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXX
NEXT_PUBLIC_S3_BUCKET_URL=http://localhost:9000/svs-devastanam-media
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=@srivenkatasai
NEXT_PUBLIC_YOUTUBE_LIVE_VIDEO_ID=dQw4w9WgXcQ
```

**Backend** – copy `backend/.env.example` → `backend/.env`:
```env
DATABASE_URL=postgresql://svs_user:svs_pass@localhost:5432/svs_db
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_XXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
AWS_ACCESS_KEY_ID=AKIAXXXXXXXX
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=svs-devastanam-media
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_FORCE_PATH_STYLE=true
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### 3. Start Docker Services

Start PostgreSQL and MinIO before running migrations or the backend.

```bash
cd docker
docker compose -f docker-compose.dev.yml stop postgres minio minio-init
docker compose -f docker-compose.dev.yml up postgres minio minio-init -d
docker compose -f docker-compose.dev.yml stop backend frontend

```

> MinIO auto-creates the `svs-devastanam-media` bucket as public on first start.

### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed initial data
npx ts-node src/prisma/seed.ts

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Generate PWA Icons

Run once to produce the 8 required PNG icons in `public/images/icons/`.

```bash
cd frontend
node generate-icons.mjs
```

### 6. Run the Application

```bash
# Terminal 1: Backend API (port 4000)
cd backend && npm run start:dev

# Terminal 2: Frontend (port 3000)
cd frontend && npm run dev
```

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Public website |
| http://localhost:3000/auth/login | Admin login |
| http://localhost:4000/api/docs | Swagger API docs |
| http://localhost:9001 | MinIO Console (`minioadmin` / `minioadmin`) |

---

### 7. Verify Local MinIO (S3) — Local Only

MinIO acts as an AWS S3-compatible object store for local development. Use any of the methods below to inspect it after the Docker services are running.

#### Web Console (easiest)

Open your browser and go to:

```
http://localhost:9001
```

| Credential | Value |
|---|---|
| Username | `minioadmin` |
| Password | `minioadmin` |

From there you can browse the `svs-devastanam-media` bucket, view/upload/delete objects, and check bucket policies.

#### S3 API Health Check

```
http://localhost:9000/minio/health/live
```

Returns HTTP 200 when MinIO is running and healthy.

#### MinIO Client (`mc`) via Docker

```bash
# List all buckets
docker exec svs-minio-dev mc alias set local http://localhost:9000 minioadmin minioadmin
docker exec svs-minio-dev mc ls local/

# List objects inside the media bucket
docker exec svs-minio-dev mc ls local/svs-devastanam-media/
```

#### Container Status & Logs

```bash
# Check the container is running
docker ps --filter name=svs-minio-dev

# Tail logs
docker logs svs-minio-dev
```

#### Quick Reference

| Setting | Value |
|---|---|
| S3 API | `http://localhost:9000` |
| Web Console | `http://localhost:9001` |
| Access Key | `minioadmin` |
| Secret Key | `minioadmin` |
| Bucket | `svs-devastanam-media` |

---

## 🐳 Docker Development

```bash
cd docker
docker compose -f docker-compose.dev.yml up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- PostgreSQL: localhost:5432
- **MinIO S3** API: http://localhost:9000
- **MinIO Console**: http://localhost:9001 (login: `minioadmin` / `minioadmin`)

> MinIO automatically creates the `svs-devastanam-media` bucket on first start and sets it to public read.  
> All uploaded media is served at `http://localhost:9000/svs-devastanam-media/<key>` — this value is already  
> injected as `NEXT_PUBLIC_S3_BUCKET_URL` by `docker-compose.dev.yml` so no manual `.env` change is needed.

---

## 🏛️ Deployment Architecture

### Application Architecture

```
                        ┌─────────────────────────────────────────┐
                        │              Cloudflare CDN              │
                        │   (DNS, DDoS protection, caching, WAF)   │
                        └──────────────────┬──────────────────────┘
                                           │ HTTPS :443
                        ┌──────────────────▼──────────────────────┐
                        │             Nginx (Reverse Proxy)        │
                        │   SSL termination · Rate limiting        │
                        │   Gzip · Static file serving             │
                        └────────┬─────────────────┬──────────────┘
                                 │                 │
               ┌─────────────────▼──┐   ┌──────────▼──────────────┐
               │  Next.js Frontend  │   │   NestJS Backend API     │
               │    (Port 3000)     │   │      (Port 4000)         │
               │  SSR · i18n · PWA  │   │  REST · Swagger · JWT    │
               └────────────────────┘   └──────┬──────────┬───────┘
                                               │          │
                              ┌────────────────▼──┐  ┌────▼──────────────┐
                              │  PostgreSQL 16     │  │   AWS S3 / MinIO  │
                              │  (Primary DB)      │  │  (Media Storage)  │
                              └────────────────────┘  └───────────────────┘
```

### Server Infrastructure

```
┌──────────────────────────────── Cloud Server (AWS EC2 / DigitalOcean Droplet) ──┐
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Docker Compose (prod)                           │   │
│  │                                                                         │   │
│  │   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌─────────────────┐ │   │
│  │   │   Nginx   │   │ Next.js   │   │  NestJS   │   │   PostgreSQL    │ │   │
│  │   │ :80 :443  │   │  :3000    │   │   :4000   │   │     :5432       │ │   │
│  │   └───────────┘   └───────────┘   └───────────┘   └─────────────────┘ │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Persistent volumes: postgres_data  /  ssl_certs                               │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Recommended Production Specs

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Server | 2 vCPU / 2 GB RAM | 4 vCPU / 8 GB RAM |
| Database | 10 GB SSD | 50 GB SSD |
| S3 / Media | 5 GB | Unlimited (pay-as-you-go) |
| SSL | Let's Encrypt (free) | Let's Encrypt / ACM |

---

## 🛠️ Production Deployment Tools

| Category | Tool | Purpose |
|----------|------|---------|
| **Container Runtime** | Docker 24+ | Package and run all services |
| **Orchestration** | Docker Compose (prod) | Multi-container management on single server |
| **Reverse Proxy** | Nginx | SSL termination, load balancing, gzip, rate limiting |
| **SSL Certificates** | Certbot + Let's Encrypt | Free auto-renewing HTTPS certificates |
| **DNS & CDN** | Cloudflare | DDoS protection, global CDN, WAF, caching |
| **Process Manager** | PM2 | Zero-downtime restarts, log management (if not using Docker) |
| **CI/CD** | GitHub Actions | Automated test → build → deploy pipeline |
| **Image Registry** | GitHub Container Registry (GHCR) or Docker Hub | Store versioned Docker images |
| **Secrets Management** | GitHub Secrets / AWS Secrets Manager / `.env` on server | Manage API keys and credentials |
| **DB Migrations** | Prisma Migrate | Safe, versioned schema changes on deploy |
| **DB Backups** | pg_dump + cron / AWS RDS snapshots | Scheduled automated backups |
| **Monitoring** | UptimeRobot (free) / Datadog | Uptime alerts and performance metrics |
| **Log Management** | Docker logs + Logrotate | Structured log rotation on server |
| **Media Storage** | AWS S3 (prod) / MinIO (dev) | Scalable object storage for images and videos |

### CI/CD Pipeline (GitHub Actions)

```
  Push to main
       │
       ▼
  ┌─────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐
  │  Lint & │────▶│   Unit   │────▶│ Docker Build │────▶│   Deploy    │
  │  Check  │     │  Tests   │     │  & Push to   │     │  to Server  │
  │         │     │          │     │    GHCR      │     │ (SSH + Pull)│
  └─────────┘     └──────────┘     └──────────────┘     └─────────────┘
```

### Deploy to Production

```bash
# On the server — initial setup (run once)
git clone https://github.com/your-org/srivenkatasai-website_v3.git /srv/svs
cd /srv/svs/docker

# Issue SSL certificate
certbot certonly --standalone -d srivenkatasai.org -d www.srivenkatasai.org

# Copy certs to Docker volume path
cp /etc/letsencrypt/live/srivenkatasai.org/fullchain.pem ssl/fullchain.pem
cp /etc/letsencrypt/live/srivenkatasai.org/privkey.pem   ssl/privkey.pem

# Set production env vars
cp ../frontend/.env.example ../frontend/.env.local   # fill in real values
cp ../backend/.env.example  ../backend/.env          # fill in real values

# Build and start all services
docker compose -f docker-compose.prod.yml up --build -d

# Run DB migrations
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

```bash
# Subsequent deploys (pull latest image and restart)
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --no-build
```

> **SSL renewal:** Certbot auto-renews certificates. Add a cron job:  
> `0 3 * * * certbot renew --quiet && docker compose -f /srv/svs/docker/docker-compose.prod.yml restart nginx`

---

## 🔑 Admin Access

Navigate to `/auth/login`. Create the first admin user via:

```bash
cd backend
npx ts-node src/prisma/seed.ts
```

### Default Seed Credentials

> ⚠️ Change these passwords immediately in any non-local environment.

| Name | Email | Password | Role |
|------|-------|----------|------|
| Super Admin | `admin@srivenkatasai.org` | `Admin@123` | SUPER_ADMIN |
| Content Editor | `editor@srivenkatasai.org` | `Admin@123` | CONTENT_EDITOR |
| Finance Admin | `finance@srivenkatasai.org` | `Admin@123` | FINANCE_ADMIN |

### Default Roles

| Role | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Full access to all modules |
| **CONTENT_EDITOR** | Pages, deities, gallery, events, announcements, timings |
| **FINANCE_ADMIN** | Donations view only |

### Swagger Authentication

1. Open `http://localhost:4000/api/docs`
2. Call `POST /api/auth/login` with your credentials — copy the returned `token`
3. Click the **Authorize 🔓** button at the top of the page
4. Enter `Bearer <token>` and click **Authorize**

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/auth/profile` | JWT | Get current user |
| GET | `/api/deities` | — | List all deities |
| GET | `/api/timings` | — | Temple timings |
| GET | `/api/events` | — | All events |
| GET | `/api/announcements` | — | Active announcements |
| GET | `/api/gallery` | — | Gallery images |
| POST | `/api/donations/order` | — | Create Razorpay order |
| POST | `/api/donations/verify` | — | Verify payment |
| POST | `/api/upload` | JWT | Upload to S3 |

Full Swagger docs at `/api/docs` (dev only).

---

## 🎨 Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Saffron | `#FB9C1B` | Primary CTAs, links |
| Rust | `#C83A00` | Headings, accents |
| Golden | `#FFCA32` | Highlights, dividers |
| Teal | `#11AD99` | Success, secondary |
| Off White | `#F7F6E5` | Page backgrounds |

---

## 📝 License

Private – Sri Venkata Sai Devasthanam Trust, Yemmiganur. All rights reserved.
