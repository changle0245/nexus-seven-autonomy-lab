"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { copy } from "@/lib/i18n";
import { nexusReducer, parsePersistedState, selectPersistedState } from "@/lib/reducer";
import { initialState } from "@/lib/seed";
import { NexusContext } from "@/components/nexus-context";
import { NexusShell } from "@/components/nexus-shell";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const storageKey = "nexus-seven-state-v1";

export function NexusApp() {
  const [state, dispatch] = useReducer(nexusReducer, initialState);
  const [hydrated, setHydrated] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const persisted = parsePersistedState(window.localStorage.getItem(storageKey));
      if (persisted) dispatch({ type: "hydrate", state: persisted });
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(selectPersistedState(state)));
  }, [hydrated, state]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.dataset.density = state.density;
    document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";
  }, [state.density, state.locale, state.theme]);

  useEffect(() => {
    const updateNetwork = () => dispatch({ type: "set-online", online: navigator.onLine });
    updateNetwork();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);
    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 8_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setCopilotOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      t: copy[state.locale],
      commandOpen,
      setCommandOpen,
      copilotOpen,
      setCopilotOpen,
    }),
    [commandOpen, copilotOpen, state],
  );

  return (
    <NexusContext.Provider value={value}>
      <ServiceWorkerRegistration />
      <NexusShell />
    </NexusContext.Provider>
  );
}
