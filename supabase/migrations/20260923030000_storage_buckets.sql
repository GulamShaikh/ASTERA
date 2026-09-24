-- Storage buckets for catalogue media. Public read (so product photos/logos
-- render directly from their Storage URL, no signed-request round trip),
-- admin-only write. Run after 20260923020000_rls_policies.sql (depends on
-- public.is_admin()).

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('brand-logos', 'brand-logos', true),
  ('category-images', 'category-images', true),
  ('marketing', 'marketing', true)
on conflict (id) do nothing;

create policy "catalogue_media_public_read" on storage.objects
  for select using (
    bucket_id in ('product-images', 'brand-logos', 'category-images', 'marketing')
  );

create policy "catalogue_media_admin_insert" on storage.objects
  for insert with check (
    bucket_id in ('product-images', 'brand-logos', 'category-images', 'marketing')
    and public.is_admin()
  );

create policy "catalogue_media_admin_update" on storage.objects
  for update using (
    bucket_id in ('product-images', 'brand-logos', 'category-images', 'marketing')
    and public.is_admin()
  );

create policy "catalogue_media_admin_delete" on storage.objects
  for delete using (
    bucket_id in ('product-images', 'brand-logos', 'category-images', 'marketing')
    and public.is_admin()
  );
