import { Ticket, TicketMessage } from "./types";

export const tickets: Ticket[] = [
  {
    id: "1",
    ticket_id: "SUP-20260729-5237",
    customer_name: "Angelo Santos",
    customer_email: "bhestiebhestie@gmail.com",
    subject: "Charged twice for my subscription",
    category: "Billing",
    priority: "High",
    sentiment: "Negative",
    status: "Internal Review",
    assigned_to: "Michael",
    ai_summary: "Customer reports two charges for the same subscription and has provided transaction details for verification.",
    recommended_action: "Compare the two transaction records and confirm whether one is pending or duplicated before approving a refund.",
    draft_reply: "Hi Angelo,\n\nThank you for sending the transaction details. We have documented the information and will review both charges before confirming the next step.\n\nWe will update you as soon as the review is complete.\n\nBest regards,\n\nSupport Team",
    reply_count: 2,
    created_at: "2026-07-29T09:14:00Z",
    updated_at: "2026-07-29T12:32:00Z"
  },
  {
    id: "2",
    ticket_id: "SUP-20260729-5182",
    customer_name: "Sophia Reyes",
    customer_email: "sophia@example.com",
    subject: "Unable to reset my password",
    category: "Technical",
    priority: "Medium",
    sentiment: "Neutral",
    status: "Open",
    assigned_to: "Unassigned",
    ai_summary: "Customer cannot complete the password reset flow after receiving the reset email.",
    recommended_action: "Verify the reset link expiry and ask the customer to retry in a private browser window.",
    draft_reply: "Hi Sophia,\n\nThanks for contacting us. Please request a new reset link and open it in a private browser window.\n\nBest regards,\n\nSupport Team",
    reply_count: 0,
    created_at: "2026-07-29T10:22:00Z",
    updated_at: "2026-07-29T10:22:00Z"
  },
  {
    id: "3",
    ticket_id: "SUP-20260729-5119",
    customer_name: "Marcus Lee",
    customer_email: "marcus@example.com",
    subject: "Feature request: export reports",
    category: "Feature Request",
    priority: "Low",
    sentiment: "Positive",
    status: "Waiting for Customer",
    assigned_to: "Michael",
    ai_summary: "Customer would like downloadable PDF and CSV reports.",
    recommended_action: "Confirm which report types are most important and log the request for product review.",
    draft_reply: "Hi Marcus,\n\nThank you for the suggestion. Which report would you most like to export first?\n\nBest regards,\n\nSupport Team",
    reply_count: 1,
    created_at: "2026-07-29T07:48:00Z",
    updated_at: "2026-07-29T09:40:00Z"
  },
  {
    id: "4",
    ticket_id: "SUP-20260728-4964",
    customer_name: "Nina Cruz",
    customer_email: "nina@example.com",
    subject: "Thank you, the issue is fixed",
    category: "Account",
    priority: "Low",
    sentiment: "Positive",
    status: "Resolved",
    assigned_to: "Michael",
    ai_summary: "Customer confirmed that the account access issue has been resolved.",
    recommended_action: "Close the ticket after the standard resolution window.",
    draft_reply: "Hi Nina,\n\nGlad to hear everything is working again.\n\nBest regards,\n\nSupport Team",
    reply_count: 3,
    created_at: "2026-07-28T13:05:00Z",
    updated_at: "2026-07-29T08:05:00Z"
  }
];

export const messages: TicketMessage[] = [
  { id: "m1", ticket_id: "1", direction: "incoming", sender_type: "customer", sender_name: "Angelo Santos", message_body: "Hello, I noticed that my subscription was charged twice today. Can you please check this?", message_status: "received", is_ai_generated: false, created_at: "2026-07-29T09:14:00Z" },
  { id: "m2", ticket_id: "1", direction: "outgoing", sender_type: "ai", sender_name: "SupportFlow AI", message_body: "Hi Angelo,\n\nThank you for contacting us. Could you send the last four digits of the payment method and the transaction dates?\n\nBest regards,\n\nSupport Team", message_status: "draft", is_ai_generated: true, created_at: "2026-07-29T09:15:00Z" },
  { id: "m3", ticket_id: "1", direction: "incoming", sender_type: "customer", sender_name: "Angelo Santos", message_body: "The last four digits are 4821. Both charges appeared on July 29. One is marked completed and the other is still pending.", message_status: "received", is_ai_generated: false, created_at: "2026-07-29T12:31:00Z" },
  { id: "m4", ticket_id: "1", direction: "outgoing", sender_type: "ai", sender_name: "SupportFlow AI", message_body: "Hi Angelo,\n\nThank you for sending the transaction details. We have documented the information and will review both charges before confirming the next step.\n\nWe will update you as soon as the review is complete.\n\nBest regards,\n\nSupport Team", message_status: "draft", is_ai_generated: true, created_at: "2026-07-29T12:32:00Z" }
];

export const chartData = [
  { day: "Mon", tickets: 18, resolved: 13 },
  { day: "Tue", tickets: 24, resolved: 19 },
  { day: "Wed", tickets: 21, resolved: 17 },
  { day: "Thu", tickets: 31, resolved: 22 },
  { day: "Fri", tickets: 27, resolved: 25 },
  { day: "Sat", tickets: 14, resolved: 12 },
  { day: "Sun", tickets: 12, resolved: 10 }
];
