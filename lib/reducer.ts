import type { AuditEvent, NexusAction, NexusState } from "@/lib/types";

const persistedKeys = [
  "workspaceId",
  "theme",
  "locale",
  "density",
  "sidebarCollapsed",
  "incidents",
  "workflows",
  "deployments",
  "featureFlags",
] as const;

function audit(
  action: string,
  resource: string,
  result: AuditEvent["result"] = "success",
  at = "now",
): AuditEvent {
  return {
    id: `aud-${action}-${resource}-${at}`,
    at,
    actor: "Current operator",
    action,
    resource,
    result,
    source: "nexus-console",
  };
}

export function nexusReducer(state: NexusState, action: NexusAction): NexusState {
  switch (action.type) {
    case "navigate":
      return { ...state, view: action.view };
    case "set-workspace":
      return {
        ...state,
        workspaceId: action.workspaceId,
        notifications: [
          {
            id: `workspace-${action.workspaceId}`,
            title: "Workspace changed",
            body: "Synthetic operating context has been isolated.",
            level: "info",
          },
          ...state.notifications,
        ],
      };
    case "set-theme":
      return { ...state, theme: action.theme };
    case "set-locale":
      return { ...state, locale: action.locale };
    case "set-density":
      return { ...state, density: action.density };
    case "toggle-sidebar":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "set-online":
      return {
        ...state,
        online: action.online,
        notifications: action.online
          ? [
              {
                id: "network-restored",
                title: "Connection restored",
                body: "Local changes remain available and cloud checks can resume.",
                level: "success",
              },
              ...state.notifications,
            ]
          : state.notifications,
      };
    case "acknowledge-incident":
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.incidentId
            ? {
                ...incident,
                status: "acknowledged",
                timeline: [
                  ...incident.timeline,
                  { id: `${incident.id}-ack`, at: "now", label: "Acknowledged by operator", kind: "human" },
                ],
              }
            : incident,
        ),
        auditEvents: [audit("incident.acknowledge", action.incidentId), ...state.auditEvents],
      };
    case "resolve-incident":
      return {
        ...state,
        incidents: state.incidents.map((incident) =>
          incident.id === action.incidentId
            ? {
                ...incident,
                status: "resolved",
                progress: 100,
                timeline: [
                  ...incident.timeline,
                  { id: `${incident.id}-resolved`, at: "now", label: "Recovery verified and incident resolved", kind: "recovery" },
                ],
              }
            : incident,
        ),
        auditEvents: [audit("incident.resolve", action.incidentId), ...state.auditEvents],
        notifications: [
          {
            id: `resolved-${action.incidentId}`,
            title: `${action.incidentId} resolved`,
            body: "Synthetic recovery checks passed and the error budget is stable.",
            level: "success",
          },
          ...state.notifications,
        ],
      };
    case "create-incident":
      return {
        ...state,
        incidents: [action.incident, ...state.incidents],
        auditEvents: [audit("incident.create", action.incident.id), ...state.auditEvents],
      };
    case "toggle-workflow":
      return {
        ...state,
        workflows: state.workflows.map((workflow) =>
          workflow.id === action.workflowId
            ? { ...workflow, enabled: !workflow.enabled }
            : workflow,
        ),
        auditEvents: [audit("workflow.toggle", action.workflowId), ...state.auditEvents],
      };
    case "run-workflow":
      return {
        ...state,
        workflows: state.workflows.map((workflow) =>
          workflow.id === action.workflowId
            ? {
                ...workflow,
                runs: workflow.runs + 1,
                lastRun: "just now",
                steps: workflow.steps.map((step, index) => ({
                  ...step,
                  status: index === 1 ? "running" : "ready",
                })),
              }
            : workflow,
        ),
        auditEvents: [audit("workflow.run", action.workflowId, "success", action.at), ...state.auditEvents],
        notifications: [
          {
            id: `workflow-${action.workflowId}-${action.at}`,
            title: "Workflow dispatched",
            body: "The synthetic run is visible in the execution graph.",
            level: "info",
          },
          ...state.notifications,
        ],
      };
    case "rollback-deployment":
      return {
        ...state,
        deployments: state.deployments.map((deployment) =>
          deployment.id === action.deploymentId
            ? {
                ...deployment,
                status: "building",
                version: `${deployment.version}-rollback`,
                deployedAt: "just now",
              }
            : deployment,
        ),
        auditEvents: [audit("deployment.rollback", action.deploymentId, "warning", action.at), ...state.auditEvents],
      };
    case "toggle-feature":
      return {
        ...state,
        featureFlags: state.featureFlags.map((flag) =>
          flag.id === action.featureId ? { ...flag, enabled: !flag.enabled } : flag,
        ),
        auditEvents: [audit("feature.toggle", action.featureId), ...state.auditEvents],
      };
    case "tick":
      return { ...state, telemetryTick: state.telemetryTick + 1 };
    case "hydrate":
      if (action.state.schemaVersion !== 1) return state;
      return {
        ...state,
        ...Object.fromEntries(
          persistedKeys
            .filter((key) => action.state[key] !== undefined)
            .map((key) => [key, action.state[key]]),
        ),
      };
    case "reset":
      return action.state;
    case "clear-notifications":
      return { ...state, notifications: [] };
    default:
      return state;
  }
}

export function selectPersistedState(state: NexusState): Partial<NexusState> {
  return {
    schemaVersion: state.schemaVersion,
    workspaceId: state.workspaceId,
    theme: state.theme,
    locale: state.locale,
    density: state.density,
    sidebarCollapsed: state.sidebarCollapsed,
    incidents: state.incidents,
    workflows: state.workflows,
    deployments: state.deployments,
    featureFlags: state.featureFlags,
  };
}

export function parsePersistedState(raw: string | null): Partial<NexusState> | null {
  if (!raw) return null;
  try {
    const candidate = JSON.parse(raw) as Partial<NexusState>;
    if (candidate.schemaVersion !== 1) return null;
    return candidate;
  } catch {
    return null;
  }
}
