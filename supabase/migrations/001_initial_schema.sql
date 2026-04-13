-- ============================================================
-- 001_initial_schema.sql
-- Phase 1 tables: staff, checklists, checklist_items,
--                 checklist_completions, products
-- ============================================================

-- uuid-ossp not needed — gen_random_uuid() is built into Postgres 13+

-- ----------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------

create table staff (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  role         text        not null check (role in ('owner', 'manager', 'budtender')),
  email        text        not null unique,
  created_at   timestamptz not null default now()
);

create table checklists (
  id           uuid primary key default gen_random_uuid(),
  title        text        not null,
  shift        text        not null check (shift in ('morning', 'evening')),
  created_at   timestamptz not null default now()
);

create table checklist_items (
  id             uuid primary key default gen_random_uuid(),
  checklist_id   uuid        not null references checklists(id) on delete cascade,
  task           text        not null,
  sort_order     int         not null default 0,
  created_at     timestamptz not null default now()
);

create table checklist_completions (
  id                  uuid primary key default gen_random_uuid(),
  checklist_item_id   uuid        not null references checklist_items(id) on delete cascade,
  staff_id            uuid        not null references staff(id) on delete cascade,
  completed_at        timestamptz not null default now(),
  -- Explicit date column so we can enforce one completion per item per day
  completed_date      date        not null default current_date
);

-- One completion per item per calendar day
create unique index checklist_completions_item_date_uidx
  on checklist_completions (checklist_item_id, completed_date);

create table products (
  id            uuid primary key default gen_random_uuid(),
  name          text           not null,
  category      text           not null,
  thc_percent   numeric(5, 2),
  cbd_percent   numeric(5, 2),
  -- Stored in ZAR cents. Display as: (price_cents / 100) formatted R 1,234.50
  price_cents   int            not null check (price_cents >= 0),
  stock_level   int            not null default 0 check (stock_level >= 0),
  created_at    timestamptz    not null default now(),
  updated_at    timestamptz    not null default now()
);

-- Auto-update updated_at on products
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

-- ----------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------

alter table staff                enable row level security;
alter table checklists           enable row level security;
alter table checklist_items      enable row level security;
alter table checklist_completions enable row level security;
alter table products             enable row level security;

-- Authenticated users have full read/write access to all tables (Phase 1)
create policy "authenticated full access" on staff
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on checklists
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on checklist_items
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on checklist_completions
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on products
  for all to authenticated using (true) with check (true);
