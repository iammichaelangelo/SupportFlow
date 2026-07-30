import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!rawUrl || !rawKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
}

const supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
const supabaseKey = rawKey.trim();

try {
  const parsedUrl = new URL(supabaseUrl);

  console.log("Supabase origin:", parsedUrl.origin);
  console.log("Supabase pathname:", parsedUrl.pathname);
} catch {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);