-- Supabase schema for VogueTravel concierge booking requests.
-- Server-side inserts use SUPABASE_SERVICE_ROLE_KEY and bypass RLS.

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  destination_id text not null,
  destination_title text not null,
  start_date date not null,
  end_date date not null,
  guests integer not null check (guests > 0),
  rooms integer not null check (rooms > 0),
  add_ons text[] default '{}',
  quote_usd integer not null default 0,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  preferences text,
  status text not null default 'concierge_review',
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_customer_email_idx on public.bookings (customer_email);
create index if not exists bookings_status_idx on public.bookings (status);

alter table public.bookings enable row level security;

-- No public policies are created. All writes/reads happen from secure server routes
-- with the Supabase service role key stored only in environment variables.
