-- Temporary image-led portfolio references.
-- These entries are explicitly labelled as visual references, not client projects.
-- Admins can replace their cover/gallery media and update copy from the portfolio CMS.
insert into public.portfolio_projects
(title, slug, category, summary, description, cover_image_url, media_urls, featured, published, display_order)
values
(
 'Brand identity — visual reference',
 'reference-brand-identity',
 'Visual reference · Brand identity',
 'Temporary open-source visual reference. Replace this image with approved Light Creative Hub client work in the admin studio.',
 'This is a visual placeholder used to demonstrate the portfolio layout. It is not represented as a completed client project.',
 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85',
 '["https://images.unsplash.com/photo-1634942536790-2534dbf1366d?auto=format&fit=crop&w=1600&q=85","https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1600&q=85"]'::jsonb,
 false, true, 10
),
(
 'Print and editorial — visual reference',
 'reference-print-editorial',
 'Visual reference · Print & design',
 'Temporary open-source visual reference. Replace this image with approved Light Creative Hub print work in the admin studio.',
 'This is a visual placeholder used to demonstrate the portfolio gallery. It is not represented as a completed client project.',
 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85',
 '["https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=85","https://images.unsplash.com/photo-1455390582262-044c7a7d6e0b?auto=format&fit=crop&w=1600&q=85"]'::jsonb,
 false, true, 20
),
(
 'Photography and film — visual reference',
 'reference-photo-film',
 'Visual reference · Photo & film',
 'Temporary open-source visual reference. Replace this image with approved Light Creative Hub photography or film in the admin studio.',
 'This is a visual placeholder used to demonstrate image-led portfolio browsing. It is not represented as a completed client project.',
 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=85',
 '["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=85","https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=85"]'::jsonb,
 false, true, 30
)
on conflict (slug) do update set
 category = excluded.category,
 summary = excluded.summary,
 description = excluded.description,
 cover_image_url = excluded.cover_image_url,
 media_urls = excluded.media_urls,
 published = true,
 updated_at = now();
