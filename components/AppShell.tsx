import { Sidebar } from "./Sidebar";
import { Bell, Search } from "lucide-react";

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return <div className="app-shell">
    <Sidebar />
    <main className="main-area">
      <header className="topbar">
        <div className="mobile-brand">SupportFlow AI</div>
        <div className="global-search"><Search size={18}/><input placeholder="Search tickets, customers, subjects..." /></div>
        <div className="top-actions"><button className="icon-button"><Bell size={19}/><span className="notification-dot"/></button><div className="avatar">MA</div><div className="profile-copy"><strong>Michael Acuña</strong><span>Administrator</span></div></div>
      </header>
      <section className="page-wrap">
        <div className="page-heading"><div><p className="eyebrow">SUPPORTFLOW AI</p><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></div>
        {children}
      </section>
    </main>
  </div>
}
