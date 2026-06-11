-- ============================================================================
-- Supabase schema for The App — Firebase → Supabase migration
-- Run this in the Supabase SQL editor (Dashboard → SQL).
--
-- Auth setup (do in Dashboard → Authentication, not SQL):
--   * Enable Email provider with "Confirm email" ON (maps to UserData.emailVerified).
--   * Add your app origin to the redirect URLs (dev + prod) for confirmation links.
--
-- Column convention: snake_case (consistent with the existing `flight_logs` table).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — per-user profile data (name, avatar). 1:1 with auth.users.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- notes
-- ----------------------------------------------------------------------------
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  content text not null default '',
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Color label (idempotent for installs created before this column existed).
alter table public.notes add column if not exists color text;

create index if not exists notes_user_id_idx on public.notes (user_id);

alter table public.notes enable row level security;

drop policy if exists "Notes are selectable by owner" on public.notes;
drop policy if exists "Notes are insertable by owner" on public.notes;
drop policy if exists "Notes are updatable by owner" on public.notes;
drop policy if exists "Notes are deletable by owner" on public.notes;

create policy "Notes are selectable by owner"
  on public.notes for select using (auth.uid() = user_id);
create policy "Notes are insertable by owner"
  on public.notes for insert with check (auth.uid() = user_id);
create policy "Notes are updatable by owner"
  on public.notes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Notes are deletable by owner"
  on public.notes for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- companies
-- ----------------------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  street text,
  zip text,
  city text,
  country text,
  company_id text,
  tax_id text,
  vat_id text,
  iban text,
  swift text,
  registration text,
  business_reg text,
  created_at timestamptz not null default now()
);

create index if not exists companies_user_id_idx on public.companies (user_id);

alter table public.companies enable row level security;

drop policy if exists "Companies are selectable by owner" on public.companies;
drop policy if exists "Companies are insertable by owner" on public.companies;
drop policy if exists "Companies are updatable by owner" on public.companies;
drop policy if exists "Companies are deletable by owner" on public.companies;

create policy "Companies are selectable by owner"
  on public.companies for select using (auth.uid() = user_id);
create policy "Companies are insertable by owner"
  on public.companies for insert with check (auth.uid() = user_id);
create policy "Companies are updatable by owner"
  on public.companies for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Companies are deletable by owner"
  on public.companies for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- invoices — nested consumer/supplier/items kept as jsonb (faithful to app types)
-- ----------------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  variable_symbol text,
  issue_date text,
  due_date text,
  delivery_date text,
  zero_vat_rate_value text,
  is_payed boolean not null default false,
  consumer jsonb,
  supplier jsonb,
  invoice_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_delivery_date_idx on public.invoices (delivery_date);

alter table public.invoices enable row level security;

drop policy if exists "Invoices are selectable by owner" on public.invoices;
drop policy if exists "Invoices are insertable by owner" on public.invoices;
drop policy if exists "Invoices are updatable by owner" on public.invoices;
drop policy if exists "Invoices are deletable by owner" on public.invoices;

create policy "Invoices are selectable by owner"
  on public.invoices for select using (auth.uid() = user_id);
create policy "Invoices are insertable by owner"
  on public.invoices for insert with check (auth.uid() = user_id);
create policy "Invoices are updatable by owner"
  on public.invoices for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Invoices are deletable by owner"
  on public.invoices for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- flight_logs — already exists (drone). Enable real auth-based RLS now that
-- the app uses Supabase Auth. NOTE: its `user_id` column is `text` (it stored
-- Firebase string UIDs), so we cast on both sides — this works whether the
-- column is text or uuid.
-- ----------------------------------------------------------------------------
alter table public.flight_logs enable row level security;

drop policy if exists "Flight logs are selectable by owner" on public.flight_logs;
drop policy if exists "Flight logs are insertable by owner" on public.flight_logs;
drop policy if exists "Flight logs are updatable by owner" on public.flight_logs;
drop policy if exists "Flight logs are deletable by owner" on public.flight_logs;

create policy "Flight logs are selectable by owner"
  on public.flight_logs for select using (auth.uid()::text = user_id::text);
create policy "Flight logs are insertable by owner"
  on public.flight_logs for insert with check (auth.uid()::text = user_id::text);
create policy "Flight logs are updatable by owner"
  on public.flight_logs for update using (auth.uid()::text = user_id::text) with check (auth.uid()::text = user_id::text);
create policy "Flight logs are deletable by owner"
  on public.flight_logs for delete using (auth.uid()::text = user_id::text);

-- ----------------------------------------------------------------------------
-- Storage bucket: avatars (public read, owner-scoped write).
-- Files are stored at `${uid}/${filename}` (same principle as flight-logs).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
