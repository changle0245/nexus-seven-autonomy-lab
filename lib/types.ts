export type Locale = "zh" | "en";
export type Theme = "dark" | "light";
export type Density = "comfortable" | "compact";
export type ViewId =
  | "command"
  | "incidents"
  | "automations"
  | "deployments"
  | "intelligence"
  | "audit"
  | "settings";

export type Severity = "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";
export type IncidentStatus = "open" | "acknowledged" | "resolved";
export type HealthStatus = "healthy" | "degraded" | "critical";

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  region: string;
}

export interface IncidentTimelineItem {
  id: string;
  at: string;
  label: string;
  kind: "signal" | "human" | "automation" | "recovery";
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  owner: string;
  openedAt: string;
  impact: string;
  affectedUsers: number;
  progress: number;
  timeline: IncidentTimelineItem[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  kind: "trigger" | "decision" | "action" | "approval";
  status: "ready" | "running" | "waiting";
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
  runs: number;
  successRate: number;
  lastRun: string;
  steps: WorkflowStep[];
}

export interface Deployment {
  id: string;
  project: string;
  environment: "production" | "preview" | "staging";
  status: "ready" | "building" | "warning" | "failed";
  version: string;
  region: string;
  latency: number;
  errorRate: number;
  deployedAt: string;
  commit: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  resource: string;
  result: "success" | "warning" | "blocked";
  source: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  level: "info" | "success" | "warning";
}

export interface FeatureFlag {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  rollout: number;
}

export interface TelemetryPoint {
  label: string;
  requests: number;
  latency: number;
  errors: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  region: string;
  status: HealthStatus;
  x: number;
  y: number;
  load: number;
}

export interface NexusState {
  schemaVersion: 1;
  view: ViewId;
  workspaceId: string;
  theme: Theme;
  locale: Locale;
  density: Density;
  sidebarCollapsed: boolean;
  online: boolean;
  telemetryTick: number;
  incidents: Incident[];
  workflows: Workflow[];
  deployments: Deployment[];
  auditEvents: AuditEvent[];
  notifications: Notification[];
  featureFlags: FeatureFlag[];
}

export type NexusAction =
  | { type: "navigate"; view: ViewId }
  | { type: "set-workspace"; workspaceId: string }
  | { type: "set-theme"; theme: Theme }
  | { type: "set-locale"; locale: Locale }
  | { type: "set-density"; density: Density }
  | { type: "toggle-sidebar" }
  | { type: "set-online"; online: boolean }
  | { type: "acknowledge-incident"; incidentId: string }
  | { type: "resolve-incident"; incidentId: string }
  | { type: "create-incident"; incident: Incident }
  | { type: "toggle-workflow"; workflowId: string }
  | { type: "run-workflow"; workflowId: string; at: string }
  | { type: "rollback-deployment"; deploymentId: string; at: string }
  | { type: "toggle-feature"; featureId: string }
  | { type: "tick" }
  | { type: "hydrate"; state: Partial<NexusState> }
  | { type: "reset"; state: NexusState }
  | { type: "clear-notifications" };

export interface CopilotAction {
  type: "navigate" | "create_incident" | "run_workflow" | "none";
  target?: string;
  label: string;
}

export interface CopilotResponse {
  id: string;
  intent: "incident" | "cost" | "deployment" | "workflow" | "overview";
  headline: string;
  summary: string;
  reasoning: string[];
  confidence: number;
  action: CopilotAction;
  generatedAt: string;
}
