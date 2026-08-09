"use client";

import {
  Activity,
  Boxes,
  ChevronLeft,
  CircleDollarSign,
  FileClock,
  LayoutDashboard,
  Rocket,
  Settings,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import type { ViewId } from "@/lib/types";

interface NavItem {
  id: ViewId;
  icon: LucideIcon;
  label: "command" | "incidents" | "automations" | "deployments" | "intelligence" | "audit" | "settings";
  badge?: string;
}

const navigation: NavItem[] = [
  { id: "command", icon: LayoutDashboard, label: "command" },
  { id: "incidents", icon: ShieldAlert, label: "incidents", badge: "2" },
  { id: "automations", icon: Workflow, label: "automations" },
  { id: "deployments", icon: Rocket, label: "deployments", badge: "1" },
  { id: "intelligence", icon: CircleDollarSign, label: "intelligence" },
  { id: "audit", icon: FileClock, label: "audit" },
  { id: "settings", icon: Settings, label: "settings" },
];

export function Sidebar() {
  const { state, dispatch, t } = useNexus();

  const navigate = (view: ViewId) => {
    dispatch({ type: "navigate", view });
    if (state.sidebarCollapsed && window.matchMedia("(max-width: 900px)").matches) {
      dispatch({ type: "toggle-sidebar" });
    }
  };

  return (
    <aside className={state.sidebarCollapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span />
          <Activity size={18} />
        </span>
        <div className="brand-copy">
          <strong>{t.product}</strong>
          <small>{t.lab}</small>
        </div>
      </div>

      <div className="environment-chip">
        <span className="environment-icon"><Boxes size={14} /></span>
        <span className="environment-copy">
          <strong>Level 7 Lab</strong>
          <small>{t.synthetic}</small>
        </span>
      </div>

      <nav className="primary-nav" aria-label="Primary navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              className={state.view === item.id ? "nav-item active" : "nav-item"}
              onClick={() => navigate(item.id)}
              aria-current={state.view === item.id ? "page" : undefined}
              title={t[item.label]}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{t[item.label]}</span>
              {item.badge ? <b>{item.badge}</b> : null}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="capacity">
          <span><i /> Autonomous capacity</span>
          <strong>84%</strong>
        </div>
        <div className="capacity-bar"><span /></div>
        <button
          type="button"
          className="collapse-button"
          onClick={() => dispatch({ type: "toggle-sidebar" })}
          aria-label={state.sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <ChevronLeft size={17} />
          <span>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
