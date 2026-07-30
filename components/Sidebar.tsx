"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Inbox, LayoutDashboard, LifeBuoy, Settings, Sparkles } from "lucide-react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand-mark"><LifeBuoy size={22} /></div>
      <nav className="side-nav">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return <Link key={href} href={href} className={`side-link ${active ? "active" : ""}`} title={label}><Icon size={20} /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="ai-status"><Sparkles size={17} /><div><strong>AI Online</strong><small>Inbox monitored</small></div></div>
    </aside>
  );
}
