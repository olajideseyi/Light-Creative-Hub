# Light Creative Hub

A Next.js starter for Light Creative Hub: a creative studio for branding, graphic design, printing, photography, videography, and content production.

## Brand assets received

- `public/brand/light-creative-hub-logo.png` — supplied logo image.
- `public/brand/light-creative-hub-brand-guidelines.jpg` — supplied brand board reference (blue `#0018A1`, white, black; Montserrat typography).
- Business email: `lightcreativehub0@gmail.com`.
- Phone: `07067376478`; WhatsApp: `2347067376478`.

## Important status

This repository is being populated from the prepared Next.js project. The website is not yet deployed, and Supabase, administrator media uploads, and email notifications still require setup and testing.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell use `Copy-Item .env.example .env.local`.

## Supabase

Apply `supabase/migrations/202610250001_initial_schema.sql` in the Supabase SQL Editor, then configure the environment variables from `.env.example`. Never commit `.env.local` or expose a Supabase service-role key in browser code.

## Deploy

Import this repository into Vercel, configure environment variables, deploy `main`, and verify the production build and forms. See the project README in the prepared starter for the full launch checklist.
