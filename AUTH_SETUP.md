# SupportFlow AI authentication setup

## 1. Create the administrator account

In Supabase, open **Authentication → Users → Add user**.

- Enter the administrator email you want to use.
- Create a strong password.
- Enable **Auto Confirm User**.

Only users created in Supabase Authentication can sign in.

## 2. Vercel environment variables

Add these exact variables under **Vercel → Project → Settings → Environment Variables**:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use the same values as the local `.env.local` file. Redeploy after saving them.

## 3. Database protection with Row Level Security

The login protects the web routes, but RLS protects the database API itself. Run the following in the Supabase SQL Editor after confirming that n8n uses the Supabase **service role** credential for its insert/update operations.

```sql
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;

create policy "Authenticated users can read support tickets"
on public.support_tickets
for select
to authenticated
using (true);

create policy "Authenticated users can read ticket messages"
on public.support_ticket_messages
for select
to authenticated
using (true);
```

The Supabase service role bypasses RLS, so n8n can continue creating and updating records when it is configured with the service-role key. Never expose the service-role key in browser code or a `NEXT_PUBLIC_` variable.

## 4. Deploy

Push the updated project to GitHub. Vercel will redeploy automatically. Opening the site while signed out should redirect to `/login`.
