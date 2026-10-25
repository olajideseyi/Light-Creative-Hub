-- Keep the SECURITY DEFINER helper outside the exposed public API schema.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_light_creative_admin()
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

revoke all on function private.is_light_creative_admin() from public;
grant execute on function private.is_light_creative_admin() to authenticated;

drop policy if exists "Admins can read admin allowlist" on public.admin_users;
drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;
drop policy if exists "Admins can upload portfolio media" on storage.objects;
drop policy if exists "Admins can update portfolio media" on storage.objects;
drop policy if exists "Admins can delete portfolio media" on storage.objects;
drop function if exists public.is_light_creative_admin();

create policy "Admins can read admin allowlist" on public.admin_users
  for select to authenticated using (private.is_light_creative_admin());
create policy "Admins can manage portfolio projects" on public.portfolio_projects
  for all to authenticated using (private.is_light_creative_admin()) with check (private.is_light_creative_admin());
create policy "Admins can upload portfolio media" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-media' and private.is_light_creative_admin());
create policy "Admins can update portfolio media" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-media' and private.is_light_creative_admin())
  with check (bucket_id = 'portfolio-media' and private.is_light_creative_admin());
create policy "Admins can delete portfolio media" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-media' and private.is_light_creative_admin());
