-- Row Level Security: the real access boundary for ASTERA's catalogue.
-- React route guards are UX only -- this is what actually stops an
-- unauthenticated or non-admin request from reading drafts/archives or
-- writing anything. Run after 20260923010000_init_schema.sql.

alter table profiles enable row level security;
alter table brands enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;

-- security definer + fixed search_path so this can be evaluated inside any
-- policy (including on tables in other schemas, e.g. storage.objects)
-- without being subject to the RLS it exists to enforce.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles: a user reads their own row; an admin reads/updates every row.
-- Deliberately no insert policy -- profile rows (i.e. "who is an admin")
-- are created manually via the SQL editor/dashboard, never from the client.
-- See supabase/README.md for the first-admin provisioning steps.
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_admin" on profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- brands
create policy "brands_select_published_or_admin" on brands
  for select using (status = 'published' or public.is_admin());
create policy "brands_insert_admin" on brands
  for insert with check (public.is_admin());
create policy "brands_update_admin" on brands
  for update using (public.is_admin()) with check (public.is_admin());
create policy "brands_delete_admin" on brands
  for delete using (public.is_admin());

-- categories
create policy "categories_select_published_or_admin" on categories
  for select using (status = 'published' or public.is_admin());
create policy "categories_insert_admin" on categories
  for insert with check (public.is_admin());
create policy "categories_update_admin" on categories
  for update using (public.is_admin()) with check (public.is_admin());
create policy "categories_delete_admin" on categories
  for delete using (public.is_admin());

-- products
create policy "products_select_published_or_admin" on products
  for select using (status = 'published' or public.is_admin());
create policy "products_insert_admin" on products
  for insert with check (public.is_admin());
create policy "products_update_admin" on products
  for update using (public.is_admin()) with check (public.is_admin());
create policy "products_delete_admin" on products
  for delete using (public.is_admin());

-- product_images: readable whenever the parent product is readable (i.e.
-- published, or any row at all if the caller is an admin).
create policy "product_images_select_via_product" on product_images
  for select using (
    exists (
      select 1 from products p
      where p.id = product_images.product_id
        and (p.status = 'published' or public.is_admin())
    )
  );
create policy "product_images_insert_admin" on product_images
  for insert with check (public.is_admin());
create policy "product_images_update_admin" on product_images
  for update using (public.is_admin()) with check (public.is_admin());
create policy "product_images_delete_admin" on product_images
  for delete using (public.is_admin());
