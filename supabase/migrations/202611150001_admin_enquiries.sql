-- Allow approved studio administrators to review and manage client enquiries.
-- Public visitors retain INSERT-only access through the existing submission policy.

drop policy if exists "Admins can view enquiries" on public.enquiries;
create policy "Admins can view enquiries"
on public.enquiries for select to authenticated
using ((select private.is_light_creative_admin()));

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries"
on public.enquiries for update to authenticated
using ((select private.is_light_creative_admin()))
with check ((select private.is_light_creative_admin()));

grant select, update on public.enquiries to authenticated;
