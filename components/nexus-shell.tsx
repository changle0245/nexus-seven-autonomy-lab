"use client";

import dynamic from "next/dynamic";
import { CloudOff } from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { CommandCenter } from "@/components/views/command-center";

const IncidentCommand = dynamic(
  () => import("@/components/views/incident-command").then((module) => module.IncidentCommand),
  { loading: () => <ViewSkeleton /> },
);
const WorkflowStudio = dynamic(
  () => import("@/components/views/workflow-studio").then((module) => module.WorkflowStudio),
  { loading: () => <ViewSkeleton /> },
);
const DeploymentControl = dynamic(
  () => import("@/components/views/deployment-control").then((module) => module.DeploymentControl),
  { loading: () => <ViewSkeleton /> },
);
const Intelligence = dynamic(
  () => import("@/components/views/intelligence").then((module) => module.Intelligence),
  { loading: () => <ViewSkeleton /> },
);
const AuditSettings = dynamic(
  () => import("@/components/views/audit-settings").then((module) => module.AuditSettings),
  { loading: () => <ViewSkeleton /> },
);
const CommandPalette = dynamic(
  () => import("@/components/command-palette").then((module) => module.CommandPalette),
  { ssr: false },
);
const CopilotPanel = dynamic(
  () => import("@/components/copilot-panel").then((module) => module.CopilotPanel),
  { ssr: false },
);

function ViewSkeleton() {
  return (
    <div className="view-skeleton" aria-label="Loading view">
      <span />
      <div><i /><i /><i /></div>
      <section />
    </div>
  );
}

function ActiveView() {
  const { state } = useNexus();
  switch (state.view) {
    case "incidents":
      return <IncidentCommand />;
    case "automations":
      return <WorkflowStudio />;
    case "deployments":
      return <DeploymentControl />;
    case "intelligence":
      return <Intelligence />;
    case "audit":
    case "settings":
      return <AuditSettings mode={state.view} />;
    case "command":
    default:
      return <CommandCenter />;
  }
}

export function NexusShell() {
  const { state, dispatch, commandOpen, copilotOpen } = useNexus();
  return (
    <div className={state.sidebarCollapsed ? "app-shell sidebar-is-collapsed" : "app-shell"}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar />
      <button
        type="button"
        className="mobile-sidebar-backdrop"
        onClick={() => dispatch({ type: "toggle-sidebar" })}
        aria-label="Close navigation"
      />
      <div className="app-column">
        <Topbar />
        {!state.online ? (
          <div className="offline-banner" role="status">
            <CloudOff size={16} />
            <span>Network unavailable. Cached state and reversible local actions remain available.</span>
          </div>
        ) : null}
        <main id="main-content" className="main-content" tabIndex={-1}>
          <ActiveView />
        </main>
      </div>
      {commandOpen ? <CommandPalette /> : null}
      {copilotOpen ? <CopilotPanel /> : null}
      <div className="synthetic-watermark" aria-hidden="true">SYNTHETIC SYSTEM · NO REAL INFRASTRUCTURE</div>
    </div>
  );
}
