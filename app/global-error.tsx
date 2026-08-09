"use client";

import { RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="error-screen">
          <span className="eyebrow">GLOBAL RECOVERY BOUNDARY</span>
          <h1>The lab shell needs a clean restart</h1>
          <p>No external infrastructure was changed. Reset the interface to continue.</p>
          <button type="button" className="button primary" onClick={reset}><RotateCcw size={16} /> Restore interface</button>
        </main>
      </body>
    </html>
  );
}
