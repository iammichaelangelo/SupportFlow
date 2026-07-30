import { AppShell } from "@/components/AppShell";
import { TicketExplorer } from "@/components/TicketExplorer";
import { createClient } from "@/lib/supabase/server";
import type { Ticket } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Supabase tickets page error:", error);
  }

  const tickets = (data ?? []) as Ticket[];

  return (
    <AppShell
      title="Tickets"
      subtitle="Search, prioritize, and review every customer conversation in one place."
    >
      <TicketExplorer tickets={tickets} />
    </AppShell>
  );
}
