-- Dedicated gallery library: independent of portfolio projects.
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null check (char_length(title) between 2 and 180),
  description text not null default '',
  category text not null default 'Photography',
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  alt_text text not null default '',
  published boolean not null default false,
  featured boolean not null default false,
  display_order integer not null default 0
);

create index if not exists gallery_items_public_order_idx
  on public.gallery_items (published, featured desc, display_order, created_at desc);

alter table public.gallery_items enable row level security;

drop policy if exists "Public can view published gallery items" on public.gallery_items;
create policy "Public can view published gallery items"
  on public.gallery_items
  for select to anon, authenticated
  using (published = true);

drop policy if exists "Admins can manage gallery items" on public.gallery_items;
create policy "Admins can manage gallery items"
  on public.gallery_items
  for all to authenticated
  using ((select private.is_light_creative_admin()))
  with check ((select private.is_light_creative_admin()));

grant select on public.gallery_items to anon, authenticated;
grant insert, update, delete on public.gallery_items to authenticated;
