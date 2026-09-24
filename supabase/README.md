# Supabase setup

Migrations live in `supabase/migrations/`, timestamp-prefixed in run order.
This project has no Supabase CLI link configured yet, so run them manually
the first time.

## Applying the schema

1. Open the Supabase dashboard for this project -> **SQL Editor**.
2. Run each file in `supabase/migrations/` in filename order:
   1. `20260923010000_init_schema.sql` -- tables, enums, indexes, constraints
   2. `20260923020000_rls_policies.sql` -- enables RLS, adds `is_admin()` + policies
   3. `20260923030000_storage_buckets.sql` -- creates the 4 media buckets + policies
   4. `20260923040000_seed_demo_data.sql` -- inserts the existing demo catalogue
3. Confirm in **Table Editor**: `brands` (3 rows), `categories` (7 rows),
   `products` (4 rows), `product_images` (4 rows), all `status = 'published'`.
4. Confirm in **Storage**: four public buckets exist -- `product-images`,
   `brand-logos`, `category-images`, `marketing`.

Every insert in the seed file upserts by its natural key (slug, or
`product_id + url`), so re-running all four files is safe.

## Creating the first admin account

There is no self-service admin sign-up by design -- `profiles` has no insert
policy from the client (see `20260923020000_rls_policies.sql`). To create the
first admin:

1. Dashboard -> **Authentication** -> Add user (set an email + password, or
   send an invite).
2. Copy that user's UUID from the Authentication table.
3. In the SQL Editor:
   ```sql
   insert into profiles (id, full_name, role)
   values ('<paste-the-user-uuid>', 'Your Name', 'admin');
   ```

## If you later adopt the Supabase CLI

These files are already named to match `supabase db push` conventions
(`supabase/migrations/<timestamp>_<name>.sql`), so linking the project
(`supabase link`) and pushing should work without renaming anything.

## Security model (summary)

| Role | Catalogue tables | Storage buckets |
|---|---|---|
| `anon` (public visitors) | `SELECT` where `status = 'published'` | public read only |
| `authenticated`, non-admin | same as anon — no writes | no writes |
| `authenticated` + `profiles.role = 'admin'` | full read/write on all rows | read + write |

Two layers must both pass: the table-level `GRANT`
(`20260923050000_grant_table_privileges.sql`) and the RLS policy
(`20260923020000_rls_policies.sql`). Granting writes to `authenticated` is
safe precisely because every write policy calls `public.is_admin()`.

`profiles` has no client-reachable `INSERT` policy and is never granted to
`anon`, so nobody can create or promote themselves to an admin from the
browser. Admin accounts exist only because someone ran the SQL above.

## What this does NOT do yet

- Does not upload the existing demo product photos into the
  `product-images` Storage bucket -- the seed still points
  `product_images.url` at `/images/products/*.jpg`, which ships with the
  frontend build. Those show as "Bundled asset" in `/admin/media`. Any image
  uploaded through the admin goes to Storage normally.
- Does not manage the pending client contact details (email, phone, address,
  hours). Those have no database schema and live in `src/content/site.ts`
  until ASTERA supplies them.
