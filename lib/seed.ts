import type {
  AuditEvent,
  Deployment,
  FeatureFlag,
  Incident,
  NetworkNode,
  NexusState,
  TelemetryPoint,
  Workflow,
  Workspace,
} from "@/lib/types";

export const workspaces: Workspace[] = [
  { id: "northstar", name: "Northstar Cloud", plan: "Enterprise", region: "Global" },
  { id: "meridian", name: "Meridian Labs", plan: "Scale", region: "APAC" },
  { id: "solace", name: "Solace Systems", plan: "Growth", region: "EMEA" },
];

export const telemetry: TelemetryPoint[] = [
  { label: "00", requests: 42, latency: 138, errors: 0.8 },
  { label: "04", requests: 55, latency: 126, errors: 0.5 },
  { label: "08", requests: 71, latency: 142, errors: 0.9 },
  { label: "12", requests: 86, latency: 158, errors: 1.2 },
  { label: "16", requests: 78, latency: 131, errors: 0.6 },
  { label: "20", requests: 94, latency: 119, errors: 0.4 },
  { label: "24", requests: 88, latency: 124, errors: 0.5 },
];

export const networkNodes: NetworkNode[] = [
  { id: "edge-sfo", label: "SFO Edge", region: "us-west", status: "healthy", x: 12, y: 46, load: 72 },
  { id: "api-iad", label: "IAD API", region: "us-east", status: "degraded", x: 34, y: 31, load: 88 },
  { id: "queue-fra", label: "FRA Queue", region: "eu-central", status: "healthy", x: 57, y: 42, load: 54 },
  { id: "db-sin", label: "SIN Data", region: "ap-southeast", status: "healthy", x: 79, y: 64, load: 63 },
  { id: "ai-hnd", label: "HND AI", region: "ap-northeast", status: "critical", x: 88, y: 28, load: 96 },
  { id: "vault-gru", label: "GRU Vault", region: "sa-east", status: "healthy", x: 43, y: 78, load: 38 },
];

export const initialIncidents: Incident[] = [
  {
    id: "INC-2048",
    title: "Inference latency outside SLO",
    service: "AI Gateway",
    severity: "SEV-1",
    status: "open",
    owner: "Maya Chen",
    openedAt: "2026-08-09T07:42:00.000Z",
    impact: "18% of APAC requests above 1.2s",
    affectedUsers: 12480,
    progress: 42,
    timeline: [
      { id: "t-1", at: "07:42", label: "Anomaly threshold crossed", kind: "signal" },
      { id: "t-2", at: "07:44", label: "Traffic shifted to secondary pool", kind: "automation" },
      { id: "t-3", at: "07:47", label: "Incident commander assigned", kind: "human" },
    ],
  },
  {
    id: "INC-2047",
    title: "Checkout webhook delivery drift",
    service: "Revenue API",
    severity: "SEV-2",
    status: "acknowledged",
    owner: "Owen Park",
    openedAt: "2026-08-09T06:18:00.000Z",
    impact: "Delayed entitlement updates in EU",
    affectedUsers: 2140,
    progress: 68,
    timeline: [
      { id: "t-4", at: "06:18", label: "Queue depth alert fired", kind: "signal" },
      { id: "t-5", at: "06:24", label: "Replay worker scaled to 12", kind: "automation" },
      { id: "t-6", at: "06:31", label: "Backlog reduced by 61%", kind: "recovery" },
    ],
  },
  {
    id: "INC-2043",
    title: "Search index freshness",
    service: "Discovery",
    severity: "SEV-3",
    status: "resolved",
    owner: "NEXUS Agent",
    openedAt: "2026-08-08T23:06:00.000Z",
    impact: "Catalog updates delayed by 11 minutes",
    affectedUsers: 680,
    progress: 100,
    timeline: [
      { id: "t-7", at: "23:06", label: "Freshness budget exceeded", kind: "signal" },
      { id: "t-8", at: "23:09", label: "Shard rebalance completed", kind: "automation" },
      { id: "t-9", at: "23:17", label: "SLO restored", kind: "recovery" },
    ],
  },
];

export const initialWorkflows: Workflow[] = [
  {
    id: "wf-auto-remediate",
    name: "Autonomous SLO recovery",
    description: "Detects regional saturation, shifts traffic, validates recovery, and opens a review.",
    trigger: "p95 latency > 900ms for 5m",
    enabled: true,
    runs: 148,
    successRate: 97.3,
    lastRun: "4m ago",
    steps: [
      { id: "ws-1", label: "SLO signal", kind: "trigger", status: "ready" },
      { id: "ws-2", label: "Risk gate", kind: "decision", status: "ready" },
      { id: "ws-3", label: "Shift traffic", kind: "action", status: "ready" },
      { id: "ws-4", label: "Verify recovery", kind: "approval", status: "ready" },
    ],
  },
  {
    id: "wf-release-guard",
    name: "Progressive release guard",
    description: "Promotes previews through canary stages when quality and error budgets pass.",
    trigger: "production candidate created",
    enabled: true,
    runs: 63,
    successRate: 99.1,
    lastRun: "28m ago",
    steps: [
      { id: "ws-5", label: "Candidate", kind: "trigger", status: "ready" },
      { id: "ws-6", label: "Quality suite", kind: "action", status: "ready" },
      { id: "ws-7", label: "10% canary", kind: "action", status: "ready" },
      { id: "ws-8", label: "Promote", kind: "approval", status: "ready" },
    ],
  },
  {
    id: "wf-cost-guard",
    name: "Cost anomaly guard",
    description: "Correlates usage, deployments, and unit economics before recommending action.",
    trigger: "forecast variance > 12%",
    enabled: false,
    runs: 31,
    successRate: 94.8,
    lastRun: "2h ago",
    steps: [
      { id: "ws-9", label: "Spend signal", kind: "trigger", status: "ready" },
      { id: "ws-10", label: "Correlate", kind: "decision", status: "ready" },
      { id: "ws-11", label: "Recommend", kind: "action", status: "ready" },
      { id: "ws-12", label: "Owner review", kind: "approval", status: "waiting" },
    ],
  },
];

export const initialDeployments: Deployment[] = [
  { id: "dep-1", project: "atlas-console", environment: "production", status: "ready", version: "v8.14.2", region: "Global", latency: 118, errorRate: 0.12, deployedAt: "12m ago", commit: "7f3a19d" },
  { id: "dep-2", project: "revenue-api", environment: "production", status: "warning", version: "v4.9.7", region: "iad1", latency: 284, errorRate: 1.84, deployedAt: "36m ago", commit: "129cc0a" },
  { id: "dep-3", project: "ai-router", environment: "staging", status: "building", version: "v12.1.0-rc3", region: "hnd1", latency: 640, errorRate: 3.2, deployedAt: "2m ago", commit: "c91ad8e" },
  { id: "dep-4", project: "catalog-index", environment: "production", status: "ready", version: "v6.2.1", region: "fra1", latency: 91, errorRate: 0.04, deployedAt: "3h ago", commit: "aa471bf" },
  { id: "dep-5", project: "identity-edge", environment: "preview", status: "ready", version: "pr-892", region: "sfo1", latency: 104, errorRate: 0.08, deployedAt: "8m ago", commit: "8e51bb2" },
  { id: "dep-6", project: "event-pipeline", environment: "production", status: "ready", version: "v3.8.9", region: "sin1", latency: 76, errorRate: 0.02, deployedAt: "5h ago", commit: "4dc91fe" },
];

export const initialAuditEvents: AuditEvent[] = [
  { id: "aud-1", at: "08:31:14", actor: "NEXUS Agent", action: "traffic.shift", resource: "ai-router/hnd1", result: "success", source: "workflow" },
  { id: "aud-2", at: "08:27:52", actor: "Maya Chen", action: "incident.acknowledge", resource: "INC-2048", result: "success", source: "console" },
  { id: "aud-3", at: "08:22:08", actor: "Policy Engine", action: "deploy.promote", resource: "revenue-api/v4.9.7", result: "warning", source: "release-guard" },
  { id: "aud-4", at: "08:18:33", actor: "NEXUS Agent", action: "secret.read", resource: "vault/prod/payment", result: "blocked", source: "least-privilege" },
  { id: "aud-5", at: "08:12:09", actor: "Owen Park", action: "workflow.enable", resource: "wf-release-guard", result: "success", source: "console" },
  { id: "aud-6", at: "07:58:41", actor: "Edge Monitor", action: "slo.evaluate", resource: "global/p95", result: "success", source: "telemetry" },
];

export const initialFeatureFlags: FeatureFlag[] = [
  { id: "predictive-incidents", label: "Predictive incidents", description: "Surface leading indicators before an SLO breach.", enabled: true, rollout: 100 },
  { id: "autonomous-actions", label: "Autonomous actions", description: "Permit low-risk synthetic remediations inside policy limits.", enabled: true, rollout: 40 },
  { id: "cost-forecast-v2", label: "Cost forecast v2", description: "Use workload-aware forecast models.", enabled: false, rollout: 0 },
  { id: "edge-command", label: "Edge command routing", description: "Route control-plane reads from the nearest region.", enabled: true, rollout: 75 },
];

export const initialState: NexusState = {
  schemaVersion: 1,
  view: "command",
  workspaceId: "northstar",
  theme: "dark",
  locale: "zh",
  density: "comfortable",
  sidebarCollapsed: false,
  online: true,
  telemetryTick: 0,
  incidents: initialIncidents,
  workflows: initialWorkflows,
  deployments: initialDeployments,
  auditEvents: initialAuditEvents,
  notifications: [
    { id: "note-1", title: "Autonomous recovery active", body: "Traffic guard is containing the APAC latency event.", level: "warning" },
    { id: "note-2", title: "Release candidate ready", body: "identity-edge PR-892 passed 42 quality checks.", level: "success" },
  ],
  featureFlags: initialFeatureFlags,
};
