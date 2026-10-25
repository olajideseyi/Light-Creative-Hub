# Light Creative Hub

A Next.js 15 / React 19 / TypeScript website for Light Creative Hub: branding, graphic design, printing, photography, videography, and content production.

## Brand and contact details

- Supplied logo reference: `public/brand/light-creative-hub-logo.png`
- Scalable brand wordmark: `public/brand/light-creative-hub-mark.svg`
- Brand board: `public/brand/light-creative-hub-brand-guidelines.jpg`
- Brand blue: `#0018A1`; white and black; Montserrat-inspired typography.
- Email: `lightcreativehub0@gmail.com`; secondary email: `adeniyiboluwatife513@gmail.com`
- Phone: `07067376478`; additional phone: `09045218491`; WhatsApp: `2347067376478`

## Routes

- `/` — homepage
- `/about` — studio introduction
- `/services` — service list
- `/portfolio` — portfolio overview
- `/contact` — contact details
- `/request-a-quote` — validated project enquiry form
- `/privacy` — privacy information
- `/admin` — authenticated portfolio administration

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`.

## Supabase configuration

The connected project has been migrated. Migration files are under `supabase/migrations/`:
1. `202610250001_initial_schema.sql` — enquiries and portfolio tables with RLS.
2. `202610250002_admin_portfolio_storage.sql` — admin allowlist, portfolio permissions, and the `portfolio-media` Storage bucket.
3. `202610250003_private_admin_helper.sql` — moves the admin authorization helper into a non-exposed schema.

Configure the following in your local `.env.local` and Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL` — `https://kjgqztbxlbqpwzbbgkib.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the project's publishable key or legacy anon key (public client key, not a service-role key).

Never put a Supabase service-role key in any `NEXT_PUBLIC_*` variable or browser code.

### Enable the first admin account

1. In Supabase Dashboard → Authentication → Users, create an admin user with an email you control and a strong password.
2. Copy that user's UUID.
3. In SQL Editor, run the following, replacing the UUID with the real UUID from the dashboard:

```sql
insert into public.admin_users (user_id, role)
values ('REPLACE-WITH-AUTH-USER-UUID', 'owner')
on conflict (user_id) do update set role = excluded.role;
```

4. Sign in at `/admin`. Only UUIDs listed in `public.admin_users` can manage portfolio entries and upload media.

The `portfolio-media` bucket accepts image/video files up to 50 MB. Add only content you have permission to publish.

## Deployment to Vercel

1. Open [Vercel New Project](https://vercel.com/new) and import `olajideseyi/Light-Creative-Hub`.
2. Set the two Supabase environment variables above for Production, Preview, and Development.
3. Deploy the `main` branch.
4. Check the GitHub Actions build status and test the homepage, enquiry form, admin login, portfolio upload, and mobile layout on the deployed URL.
5. Add a custom domain after the site has been verified.

## Current limitations

- Real client portfolio media and final photography still need to be supplied/approved.
- Email notifications for enquiries are not implemented; enquiries are saved to Supabase.
- Before public launch, test authentication and storage policies with both an admin and a non-admin account.
- No production deployment URL is claimed in this repository until Vercel confirms a successful deployment.
