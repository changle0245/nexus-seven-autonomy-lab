import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEXUS-7 · Autonomous Operations Lab",
    template: "%s · NEXUS-7",
  },
  description:
    "A Level 7 synthetic operations command center demonstrating resilient full-stack delivery, incident response, workflow automation, deployment governance, and explainable AI.",
  applicationName: "NEXUS-7",
  keywords: [
    "operations",
    "incident response",
    "workflow automation",
    "deployment governance",
    "synthetic lab",
  ],
  authors: [{ name: "Codex autonomous delivery experiment" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "NEXUS-7 · Autonomous Operations Lab",
    description: "A high-complexity, no-login, synthetic operations command center.",
    type: "website",
    siteName: "NEXUS-7",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXUS-7 · Autonomous Operations Lab",
    description: "A high-complexity synthetic operations command center.",
  },
  icons: {
    icon: "/nexus-mark.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090b10" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-theme="dark" data-density="comfortable" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
