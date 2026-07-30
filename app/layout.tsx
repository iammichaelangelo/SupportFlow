import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportFlow AI",
  description: "Intelligent customer support automation dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
