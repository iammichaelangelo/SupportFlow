import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/Badge";
import { createClient } from "@/lib/supabase/server";
import type { Ticket, TicketMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

type TicketDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TicketDetails({
  params,
}: TicketDetailsProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: ticketData, error: ticketError } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (ticketError || !ticketData) {
    console.error("Unable to load ticket:", ticketError);
    notFound();
  }

  const ticket = ticketData as Ticket;

  const { data: messageData, error: messageError } = await supabase
    .from("support_ticket_messages")
    .select("*")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  if (messageError) {
    console.error("Unable to load ticket messages:", messageError);
  }

  const thread = (messageData ?? []) as TicketMessage[];

  return (
    <AppShell title={ticket.ticket_id} subtitle={ticket.subject}>
      <Link href="/tickets" className="back-link">
        <ArrowLeft size={16} />
        Back to tickets
      </Link>

      <div className="ticket-detail-grid">
        <aside className="panel customer-panel">
          <div className="large-avatar">
            {getInitials(ticket.customer_name)}
          </div>

          <h3>{ticket.customer_name || "Unknown customer"}</h3>
          <p>{ticket.customer_email || "No email available"}</p>

          <div className="detail-list">
            <Detail
              icon={<Mail />}
              label="Email"
              value={ticket.customer_email || "Not available"}
            />

            <Detail
              icon={<UserRound />}
              label="Assigned to"
              value={ticket.assigned_to || "Unassigned"}
            />

            <Detail
              icon={<CalendarDays />}
              label="Created"
              value={formatFullDate(ticket.created_at)}
            />

            <Detail
              icon={<MessageSquareText />}
              label="Replies"
              value={String(ticket.reply_count ?? 0)}
            />
          </div>

          <div className="divider" />

          <label className="field-label" htmlFor="ticket-status">
            Status
          </label>

          <select id="ticket-status" defaultValue={ticket.status}>
            <option value="New">New</option>
            <option value="Open">Open</option>
            <option value="Waiting for Customer">
              Waiting for Customer
            </option>
            <option value="Internal Review">Internal Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <label className="field-label">Priority</label>

          <div>
            <Badge tone={ticket.priority}>
              {ticket.priority || "Not set"}
            </Badge>
          </div>

          <label className="field-label">Category</label>

          <div>
            <Badge tone={ticket.category}>
              {ticket.category || "Other"}
            </Badge>
          </div>

          <label className="field-label">Human review</label>

          <div>
            <Badge tone={ticket.human_review ? "High" : "Resolved"}>
              {ticket.human_review ? "Required" : "Not required"}
            </Badge>
          </div>
        </aside>

        <section className="panel conversation-panel">
          <div className="section-head">
            <div>
              <span className="mini-label">CONVERSATION</span>
              <h3>{ticket.subject}</h3>
            </div>

            <Badge tone={ticket.sentiment}>
              {ticket.sentiment || "Neutral"}
            </Badge>
          </div>

          <div className="conversation">
            {thread.length > 0 ? (
              thread.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))
            ) : (
              <div className="empty-state">
                <MessageSquareText size={30} />

                <strong>No conversation history yet</strong>

                <p>
                  Incoming customer emails and AI drafts will appear here
                  after they are saved to the support ticket messages table.
                </p>
              </div>
            )}
          </div>

          <div className="reply-composer">
            <div className="composer-head">
              <span>
                <Sparkles size={16} />
                AI-assisted reply
              </span>

              <button type="button">
                <Copy size={15} />
                Copy
              </button>
            </div>

            <textarea
              defaultValue={ticket.draft_reply || ""}
              placeholder="No AI draft is available yet."
            />

            <div className="composer-actions">
              <span>Draft only — review before sending</span>

              <button className="button primary" type="button">
                <Send size={16} />
                Approve & send
              </button>
            </div>
          </div>
        </section>

        <aside className="right-stack">
          <section className="panel insight-card">
            <div className="insight-title">
              <Sparkles size={18} />
              <h3>AI Summary</h3>
            </div>

            <p>
              {ticket.ai_summary ||
                "No AI-generated summary is available yet."}
            </p>
          </section>

          <section className="panel insight-card">
            <div className="insight-title">
              <Check size={18} />
              <h3>Recommended action</h3>
            </div>

            <p>
              {ticket.recommended_action ||
                "No recommended action is available yet."}
            </p>
          </section>

          <section className="panel insight-card">
            <div className="insight-title">
              <MessageSquareText size={18} />
              <h3>Customer request</h3>
            </div>

            <p>
              {ticket.customer_request ||
                "No specific customer request was recorded."}
            </p>
          </section>

          <section className="panel insight-card">
            <div className="insight-title">
              <MessageSquareText size={18} />
              <h3>Internal notes</h3>
            </div>

            <textarea placeholder="Add a private note for your team..." />

            <button className="button secondary full" type="button">
              Save note
            </button>
          </section>

          <section className="panel activity-timeline">
            <h3>Activity</h3>

            <ActivityItem
              title="Ticket last updated"
              time={formatRelativeDate(ticket.updated_at)}
            />

            <ActivityItem
              title="Customer messages"
              time={`${getIncomingCount(thread)} recorded`}
            />

            <ActivityItem
              title="AI drafts"
              time={`${getDraftCount(thread)} recorded`}
            />

            <ActivityItem
              title={`Assigned to ${ticket.assigned_to || "Unassigned"}`}
              time={formatFullDate(ticket.created_at)}
            />
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function MessageItem({ message }: { message: TicketMessage }) {
  const senderName =
    message.sender_name ||
    (message.sender_type === "ai" ? "SupportFlow AI" : "Customer");

  return (
    <article className={`message ${message.direction}`}>
      <div className="message-avatar">
        {message.sender_type === "ai" ? (
          <Bot size={18} />
        ) : (
          getInitials(senderName).slice(0, 1)
        )}
      </div>

      <div className="message-wrap">
        <div className="message-meta">
          <strong>{senderName}</strong>

          <span>{formatMessageDate(message.created_at)}</span>

          {message.is_ai_generated && (
            <Badge tone="ai">AI draft</Badge>
          )}

          {!message.is_ai_generated &&
            message.direction === "incoming" && (
              <Badge tone="Open">Customer</Badge>
            )}
        </div>

        <div className="message-bubble">
          {message.message_body
            .split("\n")
            .map((paragraph, index) => (
              <p key={`${message.id}-${index}`}>
                {paragraph || <br />}
              </p>
            ))}
        </div>
      </div>
    </article>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="detail-item">
      <span>{icon}</span>

      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ActivityItem({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <div>
      <i />

      <p>
        <strong>{title}</strong>
        <span>{time}</span>
      </p>
    </div>
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

function formatFullDate(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatMessageDate(date?: string | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatRelativeDate(date?: string | null) {
  if (!date) {
    return "Not available";
  }

  const timestamp = new Date(date).getTime();
  const difference = Date.now() - timestamp;
  const minutes = Math.max(0, Math.floor(difference / 60000));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getIncomingCount(messages: TicketMessage[]) {
  return messages.filter(
    (message) => message.direction === "incoming"
  ).length;
}

function getDraftCount(messages: TicketMessage[]) {
  return messages.filter(
    (message) =>
      message.direction === "outgoing" &&
      message.message_status === "draft"
  ).length;
}