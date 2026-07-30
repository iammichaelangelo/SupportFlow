import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { DashboardChart } from "@/components/DashboardChart";
import { createClient } from "@/lib/supabase/server";
import type { Ticket } from "@/lib/types";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock3,
  Inbox,
  Siren,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Supabase ticket error:", {
  message: error.message,
  code: error.code,
  details: error.details,
  hint: error.hint,
});
  }

  const tickets = (data ?? []) as Ticket[];

  const open = tickets.filter(
    (ticket) => !["Resolved", "Closed"].includes(ticket.status)
  ).length;

  const highPriority = tickets.filter(
    (ticket) =>
      ticket.priority === "High" || ticket.priority === "Urgent"
  ).length;

  const resolvedToday = tickets.filter((ticket) => {
    if (ticket.status !== "Resolved") {
      return false;
    }

    const updated = new Date(ticket.updated_at);
    const today = new Date();

    return updated.toDateString() === today.toDateString();
  }).length;

  const drafts = tickets.filter(
    (ticket) => Boolean(ticket.draft_reply?.trim())
  ).length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <AppShell
      title="Dashboard"
      subtitle="A clear view of your support operation and AI activity."
    >
      <div className="hero-grid">
        <section className="welcome-card">
          <div>
            <span className="hero-pill">
              <Sparkles size={15} />
              Smart inbox active
            </span>

            <h2>Hi, Michael!</h2>

            <p>
              SupportFlow AI is currently tracking{" "}
              <strong>{tickets.length} customer tickets</strong> and has prepared{" "}
              <strong>{drafts} draft replies</strong>.
            </p>

            <div className="hero-actions">
              <Link href="/tickets" className="button primary">
                View tickets
                <ArrowRight size={17} />
              </Link>

              <button className="button secondary" type="button">
                Create ticket
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="bot-orbit orbit-one" />
            <div className="bot-orbit orbit-two" />
            <div className="bot-core">
              <Bot size={52} />
            </div>

            <span className="float-chip chip-one">
              {tickets.length} tracked
            </span>

            <span className="float-chip chip-two">
              {drafts} drafts
            </span>
          </div>
        </section>

        <section className="notification-card">
          <div className="section-head">
            <div>
              <span className="mini-label">LIVE ACTIVITY</span>
              <h3>Notifications</h3>
            </div>

            <Link href="/tickets">See all</Link>
          </div>

          <div className="activity-list">
            {recentTickets.length === 0 ? (
              <p>No support activity yet.</p>
            ) : (
              recentTickets.slice(0, 3).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="activity-item"
                >
                  <span
                    className={`activity-icon ${
                      ticket.priority === "High" ||
                      ticket.priority === "Urgent"
                        ? "amber"
                        : ticket.status === "Resolved"
                          ? "green"
                          : "blue"
                    }`}
                  >
                    {ticket.status === "Resolved" ? (
                      <CheckCircle2 size={17} />
                    ) : ticket.priority === "High" ||
                      ticket.priority === "Urgent" ? (
                      <Siren size={17} />
                    ) : (
                      <Bot size={17} />
                    )}
                  </span>

                  <div>
                    <strong>{ticket.subject}</strong>
                    <small>
                      {ticket.ticket_id} · {ticket.status}
                    </small>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="metrics-grid">
        <Metric
          icon={<Inbox />}
          label="Open tickets"
          value={String(open)}
          note={`${tickets.length} total tickets`}
        />

        <Metric
          icon={<Siren />}
          label="High priority"
          value={String(highPriority)}
          note="Requires attention"
        />

        <Metric
          icon={<Clock3 />}
          label="AI drafts"
          value={String(drafts)}
          note="Ready for review"
        />

        <Metric
          icon={<CheckCircle2 />}
          label="Resolved today"
          value={String(resolvedToday)}
          note="Updated today"
        />
      </div>

      <div className="content-grid">
        <section className="panel chart-panel">
          <div className="section-head">
            <div>
              <span className="mini-label">LAST 7 DAYS</span>
              <h3>Ticket volume</h3>
            </div>

            <select defaultValue="day">
              <option value="day">By day</option>
              <option value="week">By week</option>
            </select>
          </div>

          <DashboardChart data={buildLastSevenDays(tickets)} />
        </section>

        <section className="panel categories-panel">
          <div className="section-head">
            <div>
              <span className="mini-label">BREAKDOWN</span>
              <h3>Top categories</h3>
            </div>
          </div>

          <CategoryBreakdown tickets={tickets} />
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="section-head">
          <div>
            <span className="mini-label">LATEST</span>
            <h3>Recent tickets</h3>
          </div>

          <Link href="/tickets">
            View all
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="ticket-list">
          {recentTickets.length === 0 ? (
            <p>No tickets found in Supabase.</p>
          ) : (
            recentTickets.map((ticket) => (
              <Link
                href={`/tickets/${ticket.id}`}
                className="ticket-row"
                key={ticket.id}
              >
                <div className="customer-avatar">
                  {getInitials(ticket.customer_name)}
                </div>

                <div className="ticket-main">
                  <strong>{ticket.subject}</strong>
                  <span>
                    {ticket.ticket_id} · {ticket.customer_name}
                  </span>
                </div>

                <Badge tone={ticket.category}>{ticket.category}</Badge>
                <Badge tone={ticket.priority}>{ticket.priority}</Badge>
                <Badge tone={ticket.status}>{ticket.status}</Badge>

                <span className="row-arrow">→</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Metric({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-menu">•••</span>
      </div>

      <p>{label}</p>
      <h3>{value}</h3>
      <small>{note}</small>
    </article>
  );
}

function CategoryBreakdown({ tickets }: { tickets: Ticket[] }) {
  const counts = tickets.reduce<Record<string, number>>((result, ticket) => {
    const category = ticket.category || "Other";
    result[category] = (result[category] ?? 0) + 1;
    return result;
  }, {});

  const total = tickets.length || 1;

  const categories = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  if (categories.length === 0) {
    return <p>No category data yet.</p>;
  }

  return (
    <>
      {categories.map(({ name, percentage }) => (
        <div className="category-row" key={name}>
          <div>
            <span>{name}</span>
            <strong>{percentage}%</strong>
          </div>

          <div className="progress">
            <i style={{ width: `${percentage}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}

function getInitials(name?: string | null) {
  if (!name) {
    return "CU";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function buildLastSevenDays(tickets: Ticket[]) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });

  return days.map((date) => ({
    day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
    tickets: tickets.filter((ticket) => {
      const created = new Date(ticket.created_at);
      return created.toDateString() === date.toDateString();
    }).length,
  }));
}
