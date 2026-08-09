"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import {
  Bot,
  CircleDollarSign,
  Command,
  FileClock,
  Languages,
  LayoutDashboard,
  Moon,
  Rocket,
  Search,
  Settings,
  ShieldAlert,
  Sun,
  Workflow,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import type { ViewId } from "@/lib/types";

interface CommandItem {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  keywords: string;
  run: () => void;
}

export function CommandPalette() {
  const { state, dispatch, t, setCommandOpen, setCopilotOpen } = useNexus();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query.toLowerCase());

  const navigate = useCallback((view: ViewId) => {
    dispatch({ type: "navigate", view });
    setCommandOpen(false);
  }, [dispatch, setCommandOpen]);

  const commands = useMemo<CommandItem[]>(
    () => [
      { id: "command", label: t.command, detail: "Global operating picture", icon: LayoutDashboard, keywords: "dashboard overview 指挥", run: () => navigate("command") },
      { id: "incidents", label: t.incidents, detail: "Triage, ownership, runbooks", icon: ShieldAlert, keywords: "incident outage 故障 事件", run: () => navigate("incidents") },
      { id: "automations", label: t.automations, detail: "Policy-aware workflows", icon: Workflow, keywords: "workflow automation 自动化", run: () => navigate("automations") },
      { id: "deployments", label: t.deployments, detail: "Releases, canaries, rollbacks", icon: Rocket, keywords: "deploy release rollback 部署", run: () => navigate("deployments") },
      { id: "intelligence", label: t.intelligence, detail: "Cost and risk simulation", icon: CircleDollarSign, keywords: "cost budget risk 成本", run: () => navigate("intelligence") },
      { id: "audit", label: t.audit, detail: "Trace every decision", icon: FileClock, keywords: "audit logs compliance 审计", run: () => navigate("audit") },
      { id: "settings", label: t.settings, detail: "Theme, language, data", icon: Settings, keywords: "settings preferences 设置", run: () => navigate("settings") },
      {
        id: "theme",
        label: state.theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        detail: "Persisted accessibility preference",
        icon: state.theme === "dark" ? Sun : Moon,
        keywords: "theme dark light 主题",
        run: () => {
          dispatch({ type: "set-theme", theme: state.theme === "dark" ? "light" : "dark" });
          setCommandOpen(false);
        },
      },
      {
        id: "locale",
        label: state.locale === "zh" ? "Switch interface to English" : "界面切换为中文",
        detail: "Local translation, no reload",
        icon: Languages,
        keywords: "language english chinese 语言 中文",
        run: () => {
          dispatch({ type: "set-locale", locale: state.locale === "zh" ? "en" : "zh" });
          setCommandOpen(false);
        },
      },
      {
        id: "copilot",
        label: t.copilot,
        detail: "Deterministic, explainable assistant",
        icon: Bot,
        keywords: "ai nexus assistant copilot 助手",
        run: () => {
          setCommandOpen(false);
          setCopilotOpen(true);
        },
      },
    ],
    [dispatch, navigate, setCommandOpen, setCopilotOpen, state.locale, state.theme, t],
  );

  const filtered = useMemo(() => {
    if (!deferredQuery) return commands;
    return commands.filter((item) =>
      `${item.label} ${item.detail} ${item.keywords}`.toLowerCase().includes(deferredQuery),
    );
  }, [commands, deferredQuery]);

  const effectiveIndex = Math.min(activeIndex, Math.max(filtered.length - 1, 0));

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(filtered.length, 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    }
    if (event.key === "Enter" && filtered[effectiveIndex]) {
      event.preventDefault();
      filtered[effectiveIndex].run();
    }
  };

  return (
    <div className="modal-backdrop command-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setCommandOpen(false);
    }}>
      <div className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title">
        <div className="command-input-wrap">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.search}
            autoFocus
            aria-label={t.commandPalette}
          />
          <kbd>ESC</kbd>
          <button type="button" className="icon-button small" onClick={() => setCommandOpen(false)} aria-label={t.close}><X size={15} /></button>
        </div>
        <div className="command-heading">
          <span id="command-title"><Command size={14} /> {t.commandPalette}</span>
          <small>{filtered.length} commands</small>
        </div>
        <div className="command-list" role="listbox" aria-label={t.commandPalette}>
          {filtered.length ? filtered.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                role="option"
                aria-selected={index === effectiveIndex}
                key={item.id}
                className={index === effectiveIndex ? "command-item active" : "command-item"}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={item.run}
              >
                <span className="command-icon"><Icon size={17} /></span>
                <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                <kbd>↵</kbd>
              </button>
            );
          }) : <div className="command-empty">{t.noResults}</div>}
        </div>
        <div className="command-footer"><span>↑↓ navigate</span><span>↵ select</span><span>esc close</span><b>Synthetic lab</b></div>
      </div>
    </div>
  );
}
