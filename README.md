# ASTERA

**Exploring New Brands. Delivering Quality.**

A curated storefront and admin platform for discovering mobile and tech accessories from emerging, independent, and local brands. Built as a full-stack reference implementation: a public catalogue backed by a real Postgres database, and a browser-based CMS so a non-technical owner can manage products, categories, and brands without ever touching code.

**Live:** [asteraweb.vercel.app](https://asteraweb.vercel.app/)

---

## Overview

ASTERA positions itself as a curator, not a reseller — the site's entire content model (copy, product data, brand descriptions) is built around that: no invented claims, no fabricated reviews, no pricing that isn't set by the person running the store. Every product enquiry routes to WhatsApp; there's no cart or checkout, by design — the business model is enquiry-first, not self-serve e-commerce.

The project is split cleanly into two halves that ship in the same build but never overlap at runtime:

- **Public storefront** — home, shop (search/filter/sort), categories, brands, product detail, about, contact. Reads only published rows, enforced at the database layer.
- **Admin CMS** (`/admin`) — authenticated product/category/brand management with image upload, draft/publish/archive lifecycle, and a media library. Lazy-loaded as a separate bundle, so public visitors never download an admin session or its code.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript, built with Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend | Supabase (Postgres, Auth, Storage) |
| Hosting | Vercel |

No UI/animation/state-management libraries beyond the above — component state and CSS handle everything the site needs, including the decorative motion on the homepage.

## Key features

**Storefront**
- Live catalogue read from Postgres — search, category filtering, and sorting on `/shop`
- Product, category, and brand detail pages with loading/empty/error states throughout
- Direct WhatsApp enquiry flow, pre-filled with the product name — the site's only conversion path
- Mobile-first responsive layout, including a swipeable card rail for homepage browsing on phones
- `prefers-reduced-motion`–aware decorative animation (orbit rings, starfield, comet)

**Admin CMS**
- Email/password auth, role-gated to a single `admin` role — no public sign-up
- Full CRUD for products (with specs, compatibility, multi-image galleries), categories, and brands
- Publish / Draft / Archive lifecycle — nothing is hard-deleted from the UI
- Image upload straight to Supabase Storage, with orphan-free delete (removes the DB reference and the stored file together)

**Security**
- **Row Level Security is the real access boundary**, not the React route guard — verified independently against the live REST API (anonymous writes rejected at the privilege layer before RLS is even consulted)
- Two-layer model: Postgres table grants + RLS policies, both documented in [`supabase/README.md`](supabase/README.md)
- No secrets in the client bundle — only the Supabase URL and publishable key ship to the browser; the service-role key never leaves the dashboard

## Getting started

**Prerequisites:** Node 20+, a Supabase project.

```bash
git clone https://github.com/GulamShaikh/ASTERA.git
cd ASTERA
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase project's URL and publishable key (Project Settings → API in the Supabase dashboard):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Apply the schema (tables, RLS policies, storage buckets, seed data) by running the files in [`supabase/migrations/`](supabase/migrations/) in order via the Supabase SQL Editor — full steps, including creating the first admin account, are in [`supabase/README.md`](supabase/README.md).

```bash
npm run dev
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Type-check and build for production |
| `npm run typecheck` | Type-check only, no emit |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview the production build locally |

## Project structure

```text
src/
  components/     # common, layout, product, brand, category, admin
  pages/          # route-level views (public + admin)
  lib/            # Supabase client, data-access layer, formatting helpers
  hooks/          # data fetching, auth, page-title utilities
  content/        # business-facing copy/config kept separate from UI
  types/          # shared TypeScript types
  styles/         # design tokens + global styles

supabase/
  migrations/     # schema, RLS policies, storage buckets, seed data

docs/
  ARCHITECTURE.md     # stack, data model, and admin architecture
  DESIGN_SYSTEM.md    # color tokens, typography, spacing
  PROJECT_BRIEF.md    # brand positioning and content principles
```

## Design system

Dark, cosmic-toned brand surfaces (`space-black`, `midnight`) with Cosmic Blue as an accent color, not a page-wide wash, plus a restrained champagne highlight for premium touches. Typography pairs **Outfit** (headings) with **Plus Jakarta Sans** (body). Full tokens in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Deployment

Deployed on Vercel with automatic builds on push to `main`. The only required configuration is the two `VITE_SUPABASE_*` environment variables and pointing Supabase's Auth redirect URLs at the production domain. `vercel.json` handles SPA routing so deep links (e.g. `/product/some-item`) don't 404 on refresh.

## Author

**Gulam Shaikh** — [github.com/GulamShaikh](https://github.com/GulamShaikh)

---

*This is a demonstration build for evaluation purposes. Product data, pricing, and brand names are illustrative unless stated otherwise.*
