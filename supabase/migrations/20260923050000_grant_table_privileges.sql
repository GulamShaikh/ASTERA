-- Table-level privileges for the PostgREST API roles.
--
-- RLS decides WHICH ROWS a role may touch, but Postgres checks table-level
-- privileges first. Without a GRANT, every request fails with
-- "permission denied for table ..." (SQLSTATE 42501) no matter how permissive
-- the policies are -- both layers have to pass. Tables created by raw SQL in
-- the SQL Editor don't always pick up the default grants, so they're explicit
-- here.
--
-- Granting writes to `authenticated` is still safe: every insert/update/delete
-- policy in 20260923020000_rls_policies.sql requires public.is_admin(), so a
-- signed-in non-admin can't change anything. `anon` gets reads only.

grant usage on schema public to anon, authenticated;

-- Anonymous visitors: read the published catalogue (rows filtered by RLS).
grant select on table public.brands to anon;
grant select on table public.categories to anon;
grant select on table public.products to anon;
grant select on table public.product_images to anon;

-- Signed-in users: the same reads, plus the writes the admin dashboard will
-- need. RLS keeps those writes limited to admin profiles.
grant select, insert, update, delete on table public.brands to authenticated;
grant select, insert, update, delete on table public.categories to authenticated;
grant select, insert, update, delete on table public.products to authenticated;
grant select, insert, update, delete on table public.product_images to authenticated;

-- profiles is never exposed to anon. An authenticated user can read their own
-- row (and an admin every row) per the policies.
grant select, update on table public.profiles to authenticated;
