# Financing in Canada

> **Helping Canadian Businesses Finance Their Growth**

A premium, enterprise-grade equipment financing platform for the Canadian market. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL — featuring a polished public marketing site, an equipment marketplace, a blog CMS, and a secure admin dashboard.

---

## ✨ Features

### Public Website
- **Homepage** — Animated hero, financing categories, why-choose-us, how-it-works, featured listings, testimonials, blog preview, and a lead capture form.
- **Equipment Marketplace** — Filter by category, province, price range, and condition; full-text search; pagination; detail pages with image gallery, specs, and per-listing inquiry forms.
- **Blog** — Featured article, category filters, search, pagination, Markdown article rendering, related posts, and share buttons.
- **About / Contact / Apply** — Corporate profile, contact info + map + form, and a dedicated financing application.
- **SEO** — Dynamic metadata, Open Graph & Twitter cards, JSON-LD structured data (Organization, Product, BlogPosting), `sitemap.xml`, `robots.txt`, canonical URLs, and a web manifest.
- **Premium UI** — Framer Motion animations, animated stat counters, glassmorphism, dark/light mode, fully responsive.

### Admin Dashboard (`/secure-admin`)
- **Overview** — Stat cards + Recharts visualizations (leads/contacts over time, top listings by views), recent leads.
- **Equipment Management** — Create / edit / delete, image upload, specifications builder, publish/unpublish, featured toggle, SEO fields.
- **Blog CMS** — Markdown editor, cover image, tags, categories, scheduled publishing, SEO fields.
- **Lead Management** — Status workflow (New → Contacted → Archived), delete, **CSV export**.
- **Contact Messages** — View and triage all contact submissions.
- **Settings** — Company info, social links, and email/SMTP configuration (Super Admin only).

### Platform
- **Auth** — NextAuth (credentials) with JWT sessions and role-based access (`SUPER_ADMIN`, `ADMIN`).
- **Email** — Nodemailer notifications to admin + auto-reply to leads on every submission.
- **Security** — Middleware-protected admin routes, RBAC, Zod validation, honeypot + in-memory rate limiting, secure file uploads, hardened HTTP headers.

---

## 🛠 Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC)                 |
| Language     | TypeScript                                   |
| Styling      | Tailwind CSS + shadcn/ui (Radix primitives)  |
| Animations   | Framer Motion                                |
| Database     | PostgreSQL + Prisma ORM                       |
| Auth         | NextAuth.js                                   |
| Email        | Nodemailer                                    |
| Charts       | Recharts                                      |
| Validation   | Zod + React Hook Form                         |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ (tested on 24.x)
- A PostgreSQL database (local or hosted — Neon, Supabase, RDS, etc.)

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Copy the example file and fill in your values:
```bash
cp .env.example .env
```
At minimum, set `DATABASE_URL` and `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`).

### 4. Set up the database
```bash
npm run db:push      # push the Prisma schema to your database
npm run db:seed      # seed categories, listings, blog posts, testimonials & an admin user
```

### 5. Run the dev server
```bash
npm run dev
```
Visit **http://localhost:3000**. The admin dashboard lives at **http://localhost:3000/secure-admin**.

**Default admin credentials** (from seed / `.env`):
- Email: `admin@financingincanada.com`
- Password: `Admin123!Change`

> ⚠️ Change these before deploying to production.

---

## 📦 Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the development server             |
| `npm run build`     | Generate Prisma client + production build|
| `npm run start`     | Start the production server              |
| `npm run lint`      | Run ESLint                               |
| `npm run typecheck` | Run the TypeScript compiler (no emit)    |
| `npm run db:push`   | Push schema to the database              |
| `npm run db:seed`   | Seed demo data                           |
| `npm run db:studio` | Open Prisma Studio                       |

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── (public)/            # Marketing site (Navbar + Footer layout)
│   │   ├── page.tsx         # Homepage
│   │   ├── equipment/       # Listings + detail
│   │   ├── blog/            # Blog list + detail
│   │   ├── about|contact|apply|privacy|terms/
│   ├── secure-admin/
│   │   ├── login/           # Auth page (no chrome)
│   │   └── (dashboard)/     # Protected admin (sidebar layout)
│   ├── api/                 # Public + admin route handlers
│   ├── sitemap.ts | robots.ts | manifest.ts
│   └── layout.tsx           # Root layout, fonts, providers, JSON-LD
├── components/
│   ├── ui/                  # shadcn primitives
│   ├── site/                # Public site components
│   ├── home/                # Homepage sections
│   ├── admin/               # Dashboard components
│   └── forms/               # Lead + contact forms
├── lib/                     # prisma, auth, email, queries, validations, utils, seo
├── hooks/                   # use-toast
└── types/                   # next-auth augmentation
prisma/
├── schema.prisma            # Data model
└── seed.ts                  # Demo data + admin user
```

---

## 🚢 Deploy to Vercel (minimal external dependencies)

The **only** external service this app requires is a **PostgreSQL database**.
Image uploads are stored in Postgres and served from `/api/uploads/[id]`, so
**no S3, Cloudinary, or Blob storage is needed**. Rate-limiting is in-memory
(no Redis). SMTP is optional and only used for email notifications.

**Steps:**

1. **Create a Postgres database.** On Vercel, add **Neon** from the Storage tab
   (or use Supabase). Copy the connection string.
2. **Import the repo** into Vercel — it auto-detects Next.js. No `vercel.json` needed.
3. **Set environment variables** (from `.env.example`) in Vercel → Settings → Environment Variables:
   - `DATABASE_URL` — your Neon/Supabase connection string
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` — your `https://<app>.vercel.app` URL
   - `SMTP_*`, `EMAIL_FROM`, `ADMIN_EMAIL` — optional (for lead emails)
   - `SEED_ADMIN_*` — for the first admin user
4. **Deploy.** The `build` script runs `prisma generate` automatically.
5. **Initialize the database** once (from your machine, pointed at the prod `DATABASE_URL`):
   ```bash
   npx prisma db push      # create tables
   npm run db:seed         # categories, demo content, admin user
   ```

> **Why DB-stored images?** Vercel's serverless filesystem is read-only/ephemeral,
> so the old `public/uploads` approach won't persist. Storing image bytes in
> Postgres keeps the stack to a single dependency. For very high image volume you
> can later swap the `/api/admin/upload` + `/api/uploads/[id]` handlers for Vercel
> Blob without touching any UI code.

> **Low-memory local builds:** set `LOW_MEM_BUILD=1` to limit build parallelism on
> constrained machines. Vercel's build environment has ample RAM, so leave it unset there.

---

## 🔒 Security Notes
- Admin routes are protected by middleware + a server-side session check in the dashboard layout.
- All form input is validated with Zod on both client and server.
- Lead/contact endpoints use a honeypot field and per-IP rate limiting.
- Settings mutations require the `SUPER_ADMIN` role.
- Always rotate `NEXTAUTH_SECRET` and the seeded admin password for production.

---

© Financing in Canada. Built as a production-ready reference platform.
