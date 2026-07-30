export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone.toLowerCase().replaceAll(" ", "-")}`}>{children}</span>;
}
