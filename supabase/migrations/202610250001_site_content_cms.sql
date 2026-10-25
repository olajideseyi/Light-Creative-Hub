-- Light Creative Hub: editable site content CMS
-- Run once in Supabase SQL Editor. Public visitors can read content; only approved admin users can change it.
create table if not exists public.site_content (
  content_key text primary key,
  content_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.site_content enable row level security;
drop policy if exists "Published site content is readable by everyone" on public.site_content;
create policy "Published site content is readable by everyone"
  on public.site_content for select to anon, authenticated using (true);
drop policy if exists "Approved admins manage site content" on public.site_content;
create policy "Approved admins manage site content"
  on public.site_content for all to authenticated
  using (exists (select 1 from public.admin_users au where au.user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users au where au.user_id = auth.uid()));
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
insert into public.site_content (content_key, content_value) values
('homepage', '{"heroEyebrow":"INDEPENDENT CREATIVE STUDIO","heroTitle":"Make your brand matter.","heroDescription":"We help ambitious businesses build recognisable identities, compelling campaigns and visual stories people remember.","primaryCta":"Tell us about your project","secondaryCta":"Explore selected work","approachTitle":"Good design looks good. Great design does a job.","approachDescription":"Every colour, frame, word and printed detail should have a reason to be there. We bring creative thinking and practical execution together so the result is not only beautiful — it works for the people you need to reach."}'::jsonb),
('about', '{"eyebrow":"THE STUDIO","title":"Good creative work gives ideas a clear point of view.","description":"We bring strategy, design and production together to help businesses communicate with clarity, confidence and consistency.","founderQuote":"The best creative work gives an idea room to breathe—and gives the audience a clear reason to care."}'::jsonb),
('contact', '{"title":"Have a good idea? Let’s give it a strong visual voice.","description":"Tell us what you are building, who you need to reach and what success should look like. We will help shape the next step."}'::jsonb)
on conflict (content_key) do nothing;
