import { AppShell } from "@/components/AppShell";
import { DashboardChart } from "@/components/DashboardChart";
import { Badge } from "@/components/Badge";
import { supabase } from "@/lib/supabase";
import type { Ticket } from "@/lib/types";
import { CheckCircle2, Clock3, Inbox, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Analytics() {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) console.error("Unable to load analytics:", error);

  const tickets = (data ?? []) as Ticket[];
  const resolved = tickets.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status)).length;
  const resolutionRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;
  const aiDrafts = tickets.filter((ticket) => Boolean(ticket.draft_reply?.trim())).length;
  const humanReview = tickets.filter((ticket) => ticket.human_review).length;
  const sentiment = getBreakdown(tickets, "sentiment");
  const categories = getBreakdown(tickets, "category").slice(0, 6);

  return (
    <AppShell title="Analytics" subtitle="Live insights from your Supabase support ticket data.">
      <div className="metrics-grid">
        <Metric icon={<Inbox />} label="Total tickets" value={String(tickets.length)} note="All recorded requests" />
        <Metric icon={<CheckCircle2 />} label="Resolution rate" value={`${resolutionRate}%`} note={`${resolved} resolved or closed`} />
        <Metric icon={<Sparkles />} label="AI drafts" value={String(aiDrafts)} note="Prepared for review" />
        <Metric icon={<Clock3 />} label="Human review" value={String(humanReview)} note="Requires attention" />
      </div>

      <div className="content-grid analytics-grid">
        <section className="panel chart-panel">
          <div className="section-head">
            <div>
              <span className="mini-label">LIVE VOLUME</span>
              <h3>Tickets created in the last 7 days</h3>
            </div>
          </div>
          <DashboardChart data={buildLastSevenDays(tickets)} />
        </section>

        <section className="panel sentiment-card">
          <span className="mini-label">CUSTOMER MOOD</span>
          <h3>Sentiment breakdown</h3>
          <div className="sentiment-summary">
            <strong>{tickets.length}</strong>
            <span>analyzed tickets</span>
          </div>
          <div className="legend analytics-legend">
            {sentiment.map(({ name, count, percentage }) => (
              <p key={name}>
                <Badge tone={name}>{name}</Badge>
                <strong>{count}</strong>
                <span>{percentage}%</span>
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="panel category-table">
        <div className="section-head">
          <div>
            <span className="mini-label">ISSUE INSIGHTS</span>
            <h3>Category breakdown</h3>
          </div>
        </div>

        <div className="analytics-category-grid">
          {categories.length ? categories.map(({ name, count, percentage }) => (
            <article key={name} className="analytics-category-card">
              <div>
                <Badge tone={name}>{name}</Badge>
                <strong>{count}</strong>
              </div>
              <p>{percentage}% of all tickets</p>
              <div className="progress"><i style={{ width: `${percentage}%` }} /></div>
            </article>
          )) : <p>No category data is available yet.</p>}
        </div>
      </section>
    </AppShell>
  );
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-icon">{icon}</span></div><p>{label}</p><h3>{value}</h3><small>{note}</small></article>;
}

function getBreakdown(tickets: Ticket[], field: "sentiment" | "category") {
  const counts = tickets.reduce<Record<string, number>>((result, ticket) => {
    const name = ticket[field] || "Other";
    result[name] = (result[name] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count, percentage: tickets.length ? Math.round((count / tickets.length) * 100) : 0 }))
    .sort((a, b) => b.count - a.count);
}

function buildLastSevenDays(tickets: Ticket[]) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      tickets: tickets.filter((ticket) => new Date(ticket.created_at).toDateString() === date.toDateString()).length,
    };
  });
}
