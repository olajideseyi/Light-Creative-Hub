-- Avoid duplicate permissive SELECT policies while keeping admin access.
drop policy if exists "Admins can manage portfolio projects" on public.portfolio_projects;
drop policy if exists "Public can read published portfolio projects" on public.portfolio_projects;
create policy "Read published projects or admin projects" on public.portfolio_projects
  for select to anon, authenticated
  using (published = true or (select private.is_light_creative_admin()));
create policy "Admins can insert portfolio projects" on public.portfolio_projects
  for insert to authenticated with check (private.is_light_creative_admin());
create policy "Admins can update portfolio projects" on public.portfolio_projects
  for update to authenticated using (private.is_light_creative_admin())
  with check (private.is_light_creative_admin());
create policy "Admins can delete portfolio projects" on public.portfolio_projects
  for delete to authenticated using (private.is_light_creative_admin());
