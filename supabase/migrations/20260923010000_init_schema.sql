-- ASTERA catalogue schema: brands, categories, products, product_images, profiles.
-- Run this in the Supabase SQL Editor (or via `supabase db push` once the CLI
-- is linked to this project) before any other migration in this folder.

create extension if not exists pgcrypto;

create type content_status as enum ('draft', 'published', 'archived');
create type stock_status as enum ('in_stock', 'out_of_stock', 'preorder');
create type app_role as enum ('admin');

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Maps an authenticated auth.users row to an admin role. Rows are created
-- manually (SQL editor / dashboard) after inviting a user via Supabase Auth --
-- there is no public sign-up path that can create or escalate a profile.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role app_role not null default 'admin',
  created_at timestamptz not null default now()
);

create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  -- Free-text descriptive tag (e.g. "Audio & Sound") -- a different, looser
  -- taxonomy than `categories`, not a foreign key to it.
  category text not null default '',
  description text not null default '',
  logo_url text,
  status content_status not null default 'draft',
  featured boolean not null default false,
  local boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index brands_status_idx on brands (status);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  -- Key into the frontend's fixed icon set (src/lib/iconKeys.ts), not an
  -- uploaded asset -- the catalogue only has a handful of icon glyphs.
  icon_key text not null default 'bolt',
  image_url text,
  status content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_status_idx on categories (status);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  -- restrict, not cascade/set null: hard-deleting a brand/category that
  -- still has products should fail loudly rather than silently orphan them.
  -- Normal removal is archiving (status), not a hard delete, per spec.
  brand_id uuid references brands (id) on delete restrict,
  category_id uuid references categories (id) on delete restrict,
  description text not null default '',
  specifications jsonb not null default '{}'::jsonb,
  compatibility text,
  price numeric(10, 2) check (price is null or price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  sku text unique,
  stock_status stock_status not null default 'in_stock',
  featured boolean not null default false,
  status content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_compare_at_price_not_below_price
    check (compare_at_price is null or price is null or compare_at_price >= price)
);
create index products_brand_idx on products (brand_id);
create index products_category_idx on products (category_id);
create index products_status_idx on products (status);
create index products_featured_idx on products (featured) where featured;

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, url)
);
create index product_images_product_idx on product_images (product_id, sort_order);

create trigger brands_set_updated_at before update on brands
  for each row execute function set_updated_at();
create trigger categories_set_updated_at before update on categories
  for each row execute function set_updated_at();
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();
