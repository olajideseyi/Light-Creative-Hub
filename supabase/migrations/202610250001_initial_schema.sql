-- Light Creative Hub initial schema. Apply in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text,
  service text not null,
  quantity text,
  deadline date,
  budget text,
  company text,
  details text not null check (char_length(details) between 10 and 5000),
  consent boolean not null default false check (consent = true),
  status text not null default 'new' check (status in ('new', 'in_progress', 'quoted', 'completed', 'closed'))
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null,
  summary text not null default '',
  description text not null default '',
  cover_image_url text,
  media_urls jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_status_idx on public.enquiries (status);
create index if not exists portfolio_published_order_idx on public.portfolio_projects (published, display_order);

alter table public.enquiries enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries" on public.enquiries for insert to anon, authenticated with check (consent = true);

drop policy if exists "Public can read published portfolio projects" on public.portfolio_projects;
create policy "Public can read published portfolio projects" on public.portfolio_projects for select to anon, authenticated using (published = true);

-- Admin-only write policies and media uploads must be added with verified server-side authorization.
