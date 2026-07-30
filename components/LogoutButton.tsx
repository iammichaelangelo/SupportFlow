"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="logout-button"
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out"
    >
      <LogOut size={16} />
      <span>{loading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
