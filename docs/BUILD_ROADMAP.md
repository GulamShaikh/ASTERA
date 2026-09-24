# ASTERA Build Roadmap

## Phase 0 - Discovery
Goal: understand requirements before coding.

Tasks:
- inspect current repository
- confirm stack
- confirm website scope
- collect available product/store photos
- define initial products/categories
- confirm contact/location information
- establish design reference

Deliverable:
- repository understood
- requirements documented

## Phase 1 - Design system
Tasks:
- finalize logo direction
- finalize colors
- typography
- spacing
- buttons
- cards
- navigation
- responsive rules

Use Stitch when useful to explore visual alternatives.
Export/maintain a `DESIGN.md` source of truth.

## Phase 2 - Foundation
Tasks:
- initialize project if required
- configure TypeScript
- configure Tailwind
- establish folder structure
- build layout shell
- header/footer
- responsive navigation

Quality gate:
- build works
- mobile layout works

## Phase 3 - Homepage
Sections:
1. Hero
2. ASTERA positioning
3. Featured categories
4. Emerging brands
5. Featured products
6. Quality philosophy
7. Store/visit CTA
8. Footer

## Phase 4 - Catalogue
Tasks:
- product data
- categories
- product cards
- filters/search if justified
- product detail foundation

## Phase 5 - Brand discovery
Tasks:
- brand listing
- brand cards
- brand detail structure
- explain ASTERA's curation philosophy

## Phase 4b - Supabase backend (done 2026-09-23)
- Postgres schema, RLS policies, storage buckets, demo seed
- Explicit table grants for `anon` / `authenticated`
- `src/lib/api/*` data-access layer

## Phase 5b - Multi-page public site (done 2026-09-23)
- `/`, `/shop`, `/product/:slug`, `/categories(+/:slug)`, `/brands(+/:slug)`,
  `/about`, `/contact`, 404
- All catalogue data read live from Supabase
- Loading / empty / error / not-found states throughout

## Phase 5c - Admin catalogue management (done 2026-09-23)
- Supabase Auth login, `profiles.role = 'admin'`, protected `/admin/*` routes
- Products CRUD with images, specs, publish/draft/archive
- Categories and brands CRUD with logo/image upload
- Media overview
- Result: product, category, and brand updates no longer need code changes

## Phase 6 - Trust and local identity
Tasks:
- real shop imagery
- store information
- contact
- location/map
- business hours
- customer support information

## Phase 7 - QA
Run:
- typecheck
- lint
- tests
- responsive checks
- accessibility checks
- browser visual review
- broken-link check

## Phase 8 - Launch
Tasks:
- production build
- domain
- hosting
- analytics if required
- SEO
- social preview
- final content review

## Phase 9 - Learning review
After each major phase record:
- what was learned
- what tool/MCP was used
- why it was used
- what could be improved

Do not optimize for speed at the cost of understanding.
