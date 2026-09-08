import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventSync - Public Live School Event Portal",
  description:
    "Real-time stage tracking, current running performances, upcoming schedule, delays & coordinator notices for school events.",
  keywords: [
    "EventSync",
    "School Event Tracker",
    "Live Stage Tracker",
    "Real-time schedule",
    "Cultural Fest",
    "School Portal",
  ],
  authors: [{ name: "EventSync Platform" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

