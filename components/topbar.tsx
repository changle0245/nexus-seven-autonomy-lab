"use client";

import { useState } from "react";
import {
  Bell,
  Bot,
  Check,
  ChevronDown,
  Command,
  Languages,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { workspaces } from "@/lib/seed";
import { StatusPill } from "@/components/ui";

export function Topbar() {
  const { state, dispatch, t, setCommandOpen, setCopilotOpen } = useNexus();
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const workspace = workspaces.find((item) => item.id === state.workspaceId) ?? workspaces[0];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-menu"
          onClick={() => dispatch({ type: "toggle-sidebar" })}
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
        <div className="workspace-switcher">
          <button
            type="button"
            className="workspace-button"
            aria-expanded={workspaceOpen}
            aria-label={`Switch workspace, current workspace ${workspace.name}`}
            onClick={() => setWorkspaceOpen((current) => !current)}
          >
            <span className="workspace-monogram">{workspace.name.slice(0, 2).toUpperCase()}</span>
            <span>
              <strong>{workspace.name}</strong>
              <small>{workspace.plan} · {workspace.region}</small>
            </span>
            <ChevronDown size={15} />
          </button>
          {workspaceOpen ? (
            <div className="popover workspace-menu">
              <span className="popover-label">Synthetic workspaces</span>
              {workspaces.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: "set-workspace", workspaceId: item.id });
                    setWorkspaceOpen(false);
                  }}
                >
                  <span className="workspace-monogram small">{item.name.slice(0, 2).toUpperCase()}</span>
                  <span><strong>{item.name}</strong><small>{item.region}</small></span>
                  {item.id === workspace.id ? <Check size={15} /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <button type="button" className="global-search" onClick={() => setCommandOpen(true)}>
        <Search size={16} aria-hidden="true" />
        <span>{t.search}</span>
        <kbd><Command size={11} /> K</kbd>
      </button>

      <div className="topbar-right">
        <StatusPill
          label={state.online ? t.live : t.offline}
          tone={state.online ? "success" : "warning"}
          pulse={state.online}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => dispatch({ type: "set-locale", locale: state.locale === "zh" ? "en" : "zh" })}
          aria-label={t.language}
          title={t.language}
        >
          <Languages size={17} />
          <span className="tiny-label">{state.locale === "zh" ? "中" : "EN"}</span>
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={() => dispatch({ type: "set-theme", theme: state.theme === "dark" ? "light" : "dark" })}
          aria-label={t.theme}
          title={t.theme}
        >
          {state.theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          type="button"
          className="copilot-trigger"
          onClick={() => setCopilotOpen(true)}
          aria-label={t.copilot}
        >
          <Bot size={17} />
          <span>NEXUS AI</span>
        </button>
        <div className="notification-wrap">
          <button
            type="button"
            className="icon-button notification-button"
            onClick={() => setNotificationsOpen((current) => !current)}
            aria-expanded={notificationsOpen}
            aria-label={t.notificationCenter}
          >
            <Bell size={17} />
            {state.notifications.length ? <b>{state.notifications.length}</b> : null}
          </button>
          {notificationsOpen ? (
            <div className="popover notifications-popover">
              <div className="popover-header">
                <div>
                  <span className="popover-label">{t.notificationCenter}</span>
                  <strong>{state.notifications.length} active signals</strong>
                </div>
                <button type="button" className="icon-button small" onClick={() => setNotificationsOpen(false)} aria-label={t.close}>
                  <X size={15} />
                </button>
              </div>
              {state.notifications.length ? (
                <div className="notification-list">
                  {state.notifications.slice(0, 5).map((notification) => (
                    <article key={notification.id} className={`notification note-${notification.level}`}>
                      <i />
                      <div><strong>{notification.title}</strong><p>{notification.body}</p></div>
                    </article>
                  ))}
                  <button type="button" className="text-button" onClick={() => dispatch({ type: "clear-notifications" })}>
                    {t.clearAll}
                  </button>
                </div>
              ) : (
                <div className="all-clear"><Check size={18} /> All signals reviewed</div>
              )}
            </div>
          ) : null}
        </div>
        <span className="user-avatar" title="changle0245">C7</span>
      </div>
    </header>
  );
}
