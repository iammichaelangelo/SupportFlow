# SupportFlow AI

A polished, responsive helpdesk dashboard inspired by the supplied soft, rounded SaaS reference. It includes dashboard metrics, ticket management, ticket conversations, AI draft review, analytics, settings, and a demo login.

## Run locally

1. Install Node.js 20 or newer.
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open `http://localhost:3000/login`.

The project works immediately with realistic demo data.

## Connect Supabase

Copy `.env.example` to `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The browser must receive only the publishable key. Never expose a Supabase secret key or service-role key in `NEXT_PUBLIC_*` variables.

The included `lib/supabase.ts` creates a browser client when environment variables exist. Replace the demo data imports with Supabase queries after confirming your table column names.

Expected tables:

- `support_tickets`
- `support_ticket_messages`

## Pages

- `/login`
- `/`
- `/tickets`
- `/tickets/1`
- `/analytics`
- `/settings`

## Deployment

Push the folder to GitHub, import it into Vercel, and add the same environment variables in Vercel Project Settings.
