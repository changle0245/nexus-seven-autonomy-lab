import { ArrowLeft, Radar } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-screen">
      <span className="error-symbol"><Radar size={30} /></span>
      <span className="eyebrow">404 · OUTSIDE THE CONTROL PLANE</span>
      <h1>Signal not found</h1>
      <p>The requested synthetic route does not exist.</p>
      <Link className="button primary" href="/"><ArrowLeft size={16} /> Return to command center</Link>
    </main>
  );
}
