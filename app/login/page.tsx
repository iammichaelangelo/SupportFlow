"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  LifeBuoy,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message || "Unable to sign in. Check your details.");
      setLoading(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <main className="login-page">
      <section className="login-art">
        <div className="login-brand">
          <div className="brand-mark"><LifeBuoy size={22} /></div>
          <span>SupportFlow AI</span>
        </div>

        <div className="login-copy">
          <span className="hero-pill"><Sparkles size={15} /> Intelligent helpdesk</span>
          <h1>Turn every customer email into a clear next action.</h1>
          <p>
            Classify requests, prioritize urgent issues, prepare replies, and
            manage the entire support journey from one calm workspace.
          </p>
          <div className="login-benefits">
            <div><CheckCircle2 />AI ticket classification</div>
            <div><CheckCircle2 />Conversation history</div>
            <div><CheckCircle2 />Real-time team alerts</div>
          </div>
        </div>

        <div className="login-graphic">
          <div className="graphic-card one"><Bot /><span>Draft reply prepared</span></div>
          <div className="graphic-card two"><CheckCircle2 /><span>Ticket resolved</span></div>
          <div className="graphic-core"><LifeBuoy size={60} /></div>
        </div>
      </section>

      <section className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <div className="login-icon"><LockKeyhole /></div>
          <h2>Welcome back</h2>
          <p>Sign in with your SupportFlow administrator account.</p>

          <label htmlFor="email">Email address</label>
          <div className="input-icon">
            <Mail size={17} />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="admin@example.com"
              required
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="input-icon">
            <LockKeyhole size={17} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? <div className="login-error" role="alert">{error}</div> : null}

          <button className="button primary login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            <ArrowRight size={17} />
          </button>

          <small>Only accounts created in Supabase Authentication can sign in.</small>
        </form>
      </section>
    </main>
  );
}
