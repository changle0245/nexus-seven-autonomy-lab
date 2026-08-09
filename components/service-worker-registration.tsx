"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is progressive enhancement; the main app remains usable.
      });
    }
  }, []);
  return null;
}
