-- Light Creative Hub admin access and portfolio media storage.
-- Create an Auth user first, then insert that user's UUID into public.admin_users
-- from the Supabase SQL Editor using an owner-level session.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_light_creative_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_light_creative_admin() from public;
grant execute on function public.is_light_creative_admin() to anon, authenticated;

drop policy if exists "Admins can read admin allowlist" on public.admin_users;
create policy "Admins can read admin allowlist"
on public.admin_users for select to authenticated
using (public.is_light_creative_admin());

drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;
create policy "Admins can manage portfolio projects"
on public.portfolio_projects for all to authenticated
using (public.is_light_creative_admin())
with check (public.is_light_creative_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  52428800,
  array['image/jpeg','image/png','image/webp','image/avif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-media' and public.is_light_creative_admin());

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-media' and public.is_light_creative_admin())
with check (bucket_id = 'portfolio-media' and public.is_light_creative_admin());

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-media' and public.is_light_creative_admin());
