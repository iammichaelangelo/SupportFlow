"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/Badge";
import type { Ticket } from "@/lib/types";

type SortKey = "updated" | "priority" | "replies";

const priorityRank: Record<string, number> = {
  Critical: 5,
  Urgent: 5,
  High: 4,
  Normal: 3,
  Medium: 3,
  Low: 1,
};

export function TicketExplorer({ tickets }: { tickets: Ticket[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("updated");

  const categories = useMemo(
    () =>
      Array.from(new Set(tickets.map((ticket) => ticket.category).filter(Boolean))).sort(),
    [tickets],
  );

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tickets
      .filter((ticket) => {
        const matchesQuery =
          !normalizedQuery ||
          [
            ticket.ticket_id,
            ticket.subject,
            ticket.customer_name,
            ticket.customer_email,
            ticket.category,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery));

        const matchesStatus = status === "all" || ticket.status === status;
        const matchesPriority = priority === "all" || ticket.priority === priority;
        const matchesCategory = category === "all" || ticket.category === category;

        return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sort === "priority") {
          return (priorityRank[b.priority] ?? 0) - (priorityRank[a.priority] ?? 0);
        }

        if (sort === "replies") {
          return (b.reply_count ?? 0) - (a.reply_count ?? 0);
        }

        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [tickets, query, status, priority, category, sort]);

  return (
    <section className="panel ticket-explorer-panel">
      <div className="ticket-toolbar">
        <label className="ticket-search" aria-label="Search tickets">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search ticket ID, customer, email, or subject..."
          />
        </label>

        <div className="filter-label">
          <SlidersHorizontal size={16} />
          Filters
        </div>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="New">New</option>
          <option value="Open">Open</option>
          <option value="Internal Review">Internal Review</option>
          <option value="Waiting for Customer">Waiting for Customer</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="all">All priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Normal">Normal</option>
          <option value="Low">Low</option>
        </select>

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>

        <label className="sort-control">
          <ArrowUpDown size={16} />
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="updated">Recently updated</option>
            <option value="priority">Highest priority</option>
            <option value="replies">Most replies</option>
          </select>
        </label>
      </div>

      <div className="results-summary">
        <div>
          <strong>{filteredTickets.length}</strong> of {tickets.length} tickets
        </div>
        {(query || status !== "all" || priority !== "all" || category !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setPriority("all");
              setCategory("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="tickets-table">
        <div className="tickets-table-head">
          <span>Ticket</span>
          <span>Customer</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Replies</span>
          <span>Updated</span>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <Search size={28} />
            <strong>No matching tickets</strong>
            <p>Try a different search term or clear one of the filters.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Link href={`/tickets/${ticket.id}`} className="tickets-table-row" key={ticket.id}>
              <div className="ticket-cell-main">
                <strong>{ticket.subject}</strong>
                <small>{ticket.ticket_id}</small>
              </div>

              <div className="customer-cell">
                <span className="customer-avatar">{getInitials(ticket.customer_name)}</span>
                <div>
                  <strong>{ticket.customer_name || "Unknown customer"}</strong>
                  <small>{ticket.customer_email}</small>
                </div>
              </div>

              <Badge tone={ticket.category}>{ticket.category || "Other"}</Badge>
              <Badge tone={ticket.priority}>{ticket.priority || "Normal"}</Badge>
              <Badge tone={ticket.status}>{ticket.status || "New"}</Badge>
              <span className="reply-count">{ticket.reply_count ?? 0}</span>
              <span className="updated-cell">{formatCompactDate(ticket.updated_at)}</span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

function getInitials(name?: string | null) {
  if (!name) return "CU";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatCompactDate(date?: string | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}
