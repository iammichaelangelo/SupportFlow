# SupportFlow AI dashboard updates

- Added live ticket search across ticket ID, subject, customer name, customer email, and category.
- Added status, priority, and category filters.
- Added sorting by recent activity, priority, and reply count.
- Improved the ticket table with reply count and last-updated information.
- Added responsive mobile ticket cards.
- Replaced mock dashboard chart data with live 7-day Supabase ticket volume.
- Rebuilt Analytics to use live Supabase totals, resolution rate, AI draft count, human-review count, sentiment, and categories.
- Added visual polish to the ticket details, conversation, insights, and analytics layouts.

## Environment

Copy `.env.example` to `.env.local`, then add your existing Supabase values before running the app.
