-- Mysteries of the Gut - Supabase/Postgres baseline schema
-- Apply in Supabase SQL editor or your migration pipeline.

create extension if not exists pgcrypto;

create table if not exists public.users (
  phone text primary key check (length(phone) <= 32),
  name text not null check (length(name) <= 120),
  specialty text not null check (length(specialty) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  quiz_id bigint generated always as identity primary key,
  questions jsonb not null check (jsonb_typeof(questions) = 'array'),
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists public.responses (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references public.quizzes (quiz_id) on delete cascade,
  name text not null check (length(name) <= 120), -- Snapshot at submission time
  specialty text not null check (length(specialty) <= 120), -- Snapshot at submission time
  phone text not null references public.users (phone),
  score integer not null check (score between 0 and 5),
  time_ms integer not null check (time_ms >= 0),
  cycle_start date not null,
  created_at timestamptz not null default now(),
  unique (quiz_id, cycle_start, phone)
);

create index if not exists responses_quiz_cycle_rank_idx
  on public.responses (quiz_id, cycle_start, score desc, time_ms asc);

create index if not exists responses_phone_lookup_idx
  on public.responses (quiz_id, phone);

-- Optional secret table for admin checks via RPC.
create table if not exists public.admin_secrets (
  id bigint generated always as identity primary key,
  secret_hash text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER function for admin verification.
create or replace function public.verify_admin_secret(secret text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_secrets
    where is_active = true
      and secret_hash = crypt(secret, secret_hash)
  );
$$;

revoke all on function public.verify_admin_secret(text) from public;
grant execute on function public.verify_admin_secret(text) to anon, authenticated;

alter table public.quizzes enable row level security;
alter table public.users enable row level security;
alter table public.responses enable row level security;
alter table public.admin_secrets enable row level security;

-- Public reads for quizzes so the app can load question sets.
drop policy if exists quizzes_public_read on public.quizzes;
create policy quizzes_public_read
  on public.quizzes
  for select
  to anon, authenticated
  using (true);

drop policy if exists users_public_upsert on public.users;
create policy users_public_upsert
  on public.users
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists users_public_update on public.users;
create policy users_public_update
  on public.users
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Public insert + leaderboard read (without direct admin table access).
drop policy if exists responses_public_insert on public.responses;
create policy responses_public_insert
  on public.responses
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists responses_public_read on public.responses;
create policy responses_public_read
  on public.responses
  for select
  to anon, authenticated
  using (true);

-- Never expose admin secret hashes directly.
drop policy if exists admin_secrets_no_read on public.admin_secrets;
create policy admin_secrets_no_read
  on public.admin_secrets
  for select
  to anon, authenticated
  using (false);
