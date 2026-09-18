-- SPAF Masterclass 2026 — copy of Mysteries of the Gut schema.
-- Same Supabase project, separate tables so Gut data stays untouched.

create extension if not exists pgcrypto;

create table if not exists public.spaf_users (
  phone text primary key check (length(phone) <= 32),
  name text not null check (length(name) <= 120),
  specialty text not null check (length(specialty) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spaf_quizzes (
  quiz_id bigint generated always as identity primary key,
  questions jsonb not null check (jsonb_typeof(questions) = 'array'),
  starts_at timestamptz,
  ends_at timestamptz
);

create table if not exists public.spaf_responses (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references public.spaf_quizzes (quiz_id) on delete cascade,
  name text not null check (length(name) <= 120),
  specialty text not null check (length(specialty) <= 120),
  phone text not null references public.spaf_users (phone),
  score integer not null check (score between 0 and 5),
  time_ms integer not null check (time_ms >= 0),
  cycle_start date not null,
  created_at timestamptz not null default now(),
  unique (quiz_id, cycle_start, phone)
);

create index if not exists spaf_responses_quiz_cycle_rank_idx
  on public.spaf_responses (quiz_id, cycle_start, score desc, time_ms asc);

create index if not exists spaf_responses_phone_lookup_idx
  on public.spaf_responses (quiz_id, phone);

create table if not exists public.spaf_admin_secrets (
  id bigint generated always as identity primary key,
  secret_hash text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.spaf_analytics (
  id bigint generated always as identity primary key,
  event text not null,
  quiz_id integer,
  payload text,
  created_at timestamptz default now()
);

create or replace function public.verify_spaf_admin_secret(secret text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.spaf_admin_secrets
    where is_active = true
      and secret_hash = crypt(secret, secret_hash)
  );
$$;

revoke all on function public.verify_spaf_admin_secret(text) from public;
grant execute on function public.verify_spaf_admin_secret(text) to anon, authenticated;

alter table public.spaf_quizzes enable row level security;
alter table public.spaf_users enable row level security;
alter table public.spaf_responses enable row level security;
alter table public.spaf_admin_secrets enable row level security;
alter table public.spaf_analytics enable row level security;

drop policy if exists spaf_quizzes_public_read on public.spaf_quizzes;
create policy spaf_quizzes_public_read
  on public.spaf_quizzes for select to anon, authenticated using (true);

drop policy if exists spaf_users_public_upsert on public.spaf_users;
create policy spaf_users_public_upsert
  on public.spaf_users for insert to anon, authenticated with check (true);

drop policy if exists spaf_users_public_update on public.spaf_users;
create policy spaf_users_public_update
  on public.spaf_users for update to anon, authenticated using (true) with check (true);

drop policy if exists spaf_responses_public_insert on public.spaf_responses;
create policy spaf_responses_public_insert
  on public.spaf_responses for insert to anon, authenticated with check (true);

drop policy if exists spaf_responses_public_read on public.spaf_responses;
create policy spaf_responses_public_read
  on public.spaf_responses for select to anon, authenticated using (true);

drop policy if exists spaf_admin_secrets_no_read on public.spaf_admin_secrets;
create policy spaf_admin_secrets_no_read
  on public.spaf_admin_secrets for select to anon, authenticated using (false);

drop policy if exists spaf_analytics_public_insert on public.spaf_analytics;
create policy spaf_analytics_public_insert
  on public.spaf_analytics for insert to anon, authenticated with check (true);
