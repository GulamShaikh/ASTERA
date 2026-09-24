-- Seeds the EXISTING demo catalogue (src/data/products.ts, categories.ts,
-- brands.ts) so the schema/RLS can be verified end-to-end before any admin
-- UI exists. Safe to re-run: every insert upserts by its natural key.
-- Demo data only -- replace before real launch, per docs/DECISIONS.md.
-- Run last, after 20260923030000_storage_buckets.sql.

insert into brands (slug, name, category, description, status, featured, local, sort_order)
values
  ('hardware-power', 'Independent Hardware Studio', 'Hardware & Power',
   'Focused on compact power architectures and thermal efficiency for everyday workspace setups.',
   'published', false, false, 0),
  ('audio-sound', 'Acoustic Design Studio', 'Audio & Sound',
   'Dedicated to balanced sound tuning, clean listening profiles, and comfortable all-day wear.',
   'published', false, false, 1),
  ('device-protection', 'Protective Gear Makers', 'Device Protection',
   'Precision composite textures and ergonomic design built for reliable device longevity.',
   'published', false, false, 2)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  status = excluded.status,
  featured = excluded.featured,
  local = excluded.local,
  sort_order = excluded.sort_order;

insert into categories (slug, name, description, icon_key, status, sort_order)
values
  ('chargers', 'Chargers',
   'High-efficiency GaN wall blocks and slimline daily battery packs.', 'bolt', 'published', 0),
  ('cables', 'Cables',
   'Reinforced braided USB-C and tangle-resistant everyday cords.', 'cable', 'published', 1),
  ('earphones', 'Earphones & Earbuds',
   'Ergonomic wireless in-ears and balanced daily acoustic gear.', 'headphones', 'published', 2),
  ('speakers', 'Speakers',
   'Compact desktop audio and portable balanced room sound.', 'speaker', 'published', 3),
  ('cases', 'Mobile Cases',
   'Precision-fit protective composite frames with a matte finish.', 'phone-case', 'published', 4),
  ('screen-protectors', 'Screen Protectors',
   'Tempered optical glass and clean anti-reflective overlays.', 'shield', 'published', 5),
  ('adapters', 'Adapters & Accessories',
   'Multi-port USB-C hubs, audio dongles, and connectivity adapters.', 'hub', 'published', 6)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon_key = excluded.icon_key,
  status = excluded.status,
  sort_order = excluded.sort_order;

-- Product -> brand linkage: the source TypeScript demo data
-- (src/data/products.ts) only ever used generic descriptors ("Emerging
-- Brand" / "Independent Brand"), never a real link into src/data/brands.ts.
-- There is no ground truth to preserve, so each product is linked to the
-- seeded brand whose profile is the closest category match (charger/cable ->
-- Hardware & Power studio, earbuds -> Audio & Sound studio, phone case ->
-- Device Protection maker). Seed-time judgment call, logged in
-- docs/DECISIONS.md -- replace with real brand relationships once the
-- client's actual partner brands are onboarded.
insert into products (
  slug, name, brand_id, category_id, description, price, featured, status, stock_status, sort_order
)
values
  (
    'gan-dual-port-charger', 'GaN Dual-Port Charger',
    (select id from brands where slug = 'hardware-power'),
    (select id from categories where slug = 'chargers'),
    'Dual USB-C fast charging in an ultra-compact everyday shell.',
    null, true, 'published', 'in_stock', 0
  ),
  (
    'braided-type-c-cable', 'Braided Type-C Cable',
    (select id from brands where slug = 'hardware-power'),
    (select id from categories where slug = 'cables'),
    'Reinforced strain-relief joints with a durable tangle-resistant sleeve.',
    null, false, 'published', 'in_stock', 1
  ),
  (
    'wireless-earbuds', 'Wireless Earbuds',
    (select id from brands where slug = 'audio-sound'),
    (select id from categories where slug = 'earphones'),
    'Balanced sound chamber with a comfortable ergonomic daily fit.',
    null, true, 'published', 'in_stock', 2
  ),
  (
    'magnetic-phone-case', 'Magnetic Phone Case',
    (select id from brands where slug = 'device-protection'),
    (select id from categories where slug = 'cases'),
    'Tactile side grips with a responsive matte finish.',
    null, false, 'published', 'in_stock', 3
  )
on conflict (slug) do update set
  name = excluded.name,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  description = excluded.description,
  price = excluded.price,
  featured = excluded.featured,
  status = excluded.status,
  stock_status = excluded.stock_status,
  sort_order = excluded.sort_order;

-- Existing demo photography still lives in /public/images/products (shipped
-- with the frontend build), not in Supabase Storage yet -- moving these
-- files into the product-images bucket belongs to the admin image-upload
-- milestone. Referencing the existing public path here keeps this seed
-- limited to "existing demo data only," per spec.
insert into product_images (product_id, url, alt_text, sort_order)
values
  ((select id from products where slug = 'gan-dual-port-charger'),
   '/images/products/gan-dual-port-charger.jpg', 'GaN Dual-Port Charger product photo', 0),
  ((select id from products where slug = 'braided-type-c-cable'),
   '/images/products/braided-type-c-cable.jpg', 'Braided Type-C Cable product photo', 0),
  ((select id from products where slug = 'wireless-earbuds'),
   '/images/products/wireless-earbuds.jpg', 'Wireless Earbuds product photo', 0),
  ((select id from products where slug = 'magnetic-phone-case'),
   '/images/products/phonecase.jpg', 'Magnetic Phone Case product photo', 0)
on conflict (product_id, url) do nothing;
