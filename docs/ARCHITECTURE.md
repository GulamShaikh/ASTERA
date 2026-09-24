# ASTERA Technical Architecture

## Principle
Start simple. Add infrastructure only when a real requirement appears.

## Recommended initial stack
If starting from scratch:
- React
- TypeScript
- Vite
- Tailwind CSS
- modern component architecture
- Git/GitHub

Alternative frameworks can be considered if there is a specific SEO/deployment requirement.

## Suggested structure
```text
src/
  assets/
  components/
    common/
    layout/
    product/
    brand/
  data/
  pages/
  hooks/
  lib/
  styles/
  App.tsx
  main.tsx

public/
docs/
```

## Data model direction
Products should be represented as data, not duplicated JSX.

Example:
```ts
type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price?: number;
  image: string;
  description?: string;
  featured?: boolean;
};
```

Brands should also be data-driven:
```ts
type Brand = {
  id: string;
  name: string;
  description: string;
  logo?: string;
  local?: boolean;
  featured?: boolean;
};
```

## Pages
Initial:
- `/`
- `/shop`
- `/brands`
- `/categories`
- `/about`
- `/contact`

Future:
- `/product/:slug`
- `/brand/:slug`
- `/category/:slug`

## SEO
Use:
- semantic headings
- unique page titles
- meta descriptions
- Open Graph metadata
- descriptive URLs
- structured data when appropriate
- optimized images

## Performance
Prioritize:
- small bundles
- lazy loading where useful
- optimized images
- minimal third-party scripts
- no unnecessary animation libraries

## State
Prefer local/component state for simple UI.
Introduce global state only when multiple independent areas genuinely need shared state.

## Backend
Do not add a backend in the first phase unless the project requires:
- authentication
- inventory management
- online checkout
- persistent product administration
- orders

For a first marketing/catalogue site, static/data-driven content is preferable.

**Status (2026-09-23): that threshold has been crossed.** The browser-based
admin catalogue requirement (persistent product administration) means the
site now needs a real backend. Chosen: **Supabase** (Postgres + Auth +
Storage) over Firebase/Firestore — the catalogue's data is inherently
relational (a product belongs to exactly one brand and one category, each
with its own publish/archive lifecycle), which maps directly onto Postgres +
Row Level Security, whereas a document store would need denormalization for
the same joins and per-row access rules.

- Schema, RLS policies, storage buckets, and demo-data seed live in
  `supabase/migrations/` (run manually via the Supabase SQL Editor until the
  CLI is linked -- see `supabase/README.md`).
- The frontend talks to Supabase only through `src/lib/api/*.ts`, which
  returns data already shaped to the existing `Product`/`Category`/`Brand`
  types in `src/data/*.ts` -- no component changes required to switch a
  page's data source later.
- `src/data/*.ts` is still the live source for every page today. The API
  layer exists and is verified against the live project, but pages have not
  been switched over yet -- that is the next milestone.
- Security boundary is **Postgres Row Level Security**, not the React route
  guard that will gate `/admin/*` -- anon/public reads are restricted to
  `status = 'published'` rows at the database layer regardless of what the
  client does.
- Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (safe to ship
  to the browser) are used client-side. No service-role/secret key exists
  anywhere in this repo or its history.

### Table privileges vs RLS

Both layers must pass. RLS decides *which rows* a role may touch; Postgres
checks table-level `GRANT`s first. Tables created by raw SQL in the SQL Editor
don't always inherit Supabase's default grants, so they're explicit in
`supabase/migrations/20260923050000_grant_table_privileges.sql`. Symptom when
missing: every request fails with `42501 permission denied for table ...`
regardless of how permissive the policies are.

## Admin (browser-based catalogue management)

`/admin/*` is a separate, lazily-loaded chunk — public visitors never download
it, and the public site never loads a Supabase session.

- **Auth**: Supabase email/password. No public sign-up; admin users are
  provisioned by hand (see `supabase/README.md`). `AuthProvider` (mounted only
  under `/admin`) restores the session on refresh, subscribes to
  `onAuthStateChange`, and resolves `profiles.role` into one of four states:
  `loading` / `signed-out` / `admin` / `not-admin`.
- **Route protection**: `ProtectedRoute` redirects signed-out users to
  `/admin/login` (remembering where they were headed) and non-admins to
  `/admin/access-denied`. This is **UX only** — RLS is the real boundary. A
  non-admin who bypassed the React guard still can't read drafts or write.
- **Role model**: a single `'admin'` role in the `app_role` enum. `profiles`
  has no client-reachable INSERT policy, so no one can self-promote.
- **Data access**: admin queries live in `src/lib/api/admin/*` (products,
  categories, brands, media, stats), mirroring the public `src/lib/api/*`
  pattern. Components never call Supabase directly.
- **Catalogue removal is archiving.** `archiveProduct` / `archiveCategory` /
  `archiveBrand` set `status = 'archived'`; nothing is hard-deleted from the
  admin UI. Archiving a category or brand first counts the products that
  reference it and warns before proceeding.
- **Storage**: images upload to `{bucket}/{entity-slug}/{uuid}.{ext}` in
  `product-images`, `brand-logos`, or `category-images`. Product images are
  rows in `product_images` ordered by `sort_order` (index 0 is the primary
  image); brand logos and category images are nullable columns. Deleting an
  image removes both the row/column reference and the stored object, so
  neither side is left orphaned. Binary data is never stored in Postgres.
- **Icons stay code-side**: `categories.icon_key` is a text key constrained by
  the admin UI to `ICON_KEY_OPTIONS` and mapped to a React component in
  `src/lib/iconKeys.ts`. The database never stores a component or any
  executable value.

## Deployment
Choose the deployment platform after the frontend architecture is stable.
Document deployment steps in `docs/DEPLOYMENT.md`.

## Security
Never commit:
- API keys
- OAuth tokens
- service account credentials
- `.env` secrets

Use environment variables and `.gitignore`.
