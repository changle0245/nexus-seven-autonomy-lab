"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-screen">
      <span className="error-symbol"><AlertTriangle size={30} /></span>
      <span className="eyebrow">CONTROLLED FAILURE STATE</span>
      <h1>NEXUS recovered the shell</h1>
      <p>{error.message || "An unexpected client boundary was triggered."}</p>
      <button type="button" className="button primary" onClick={reset}><RotateCcw size={16} /> Retry safely</button>
    </main>
  );
}
