import type { CopilotResponse } from "@/lib/types";

const incidentTerms = /incident|outage|latency|error|故障|事件|延迟|异常/i;
const costTerms = /cost|spend|budget|费用|成本|预算/i;
const deploymentTerms = /deploy|release|rollback|发布|部署|回滚/i;
const workflowTerms = /workflow|automation|runbook|工作流|自动化|编排/i;

export function normalizePrompt(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 500);
}

export function analyzePrompt(promptValue: unknown, generatedAt: string): CopilotResponse {
  const prompt = normalizePrompt(promptValue);

  if (!prompt) {
    return {
      id: `copilot-empty-${generatedAt}`,
      intent: "overview",
      headline: "A clear request is required",
      summary: "Describe an incident, deployment, workflow, or cost question.",
      reasoning: ["No executable scope was detected.", "No state-changing action was proposed."],
      confidence: 1,
      action: { type: "none", label: "No action" },
      generatedAt,
    };
  }

  if (incidentTerms.test(prompt)) {
    return {
      id: `copilot-incident-${generatedAt}`,
      intent: "incident",
      headline: "Incident triage plan prepared",
      summary: "Correlate APAC latency, route health, and the last AI Gateway release before changing traffic.",
      reasoning: [
        "The active SEV-1 and hnd1 saturation share the same regional boundary.",
        "Error rate remains recoverable, so reversible traffic shifting is safer than rollback.",
        "A human-visible incident record preserves accountability.",
      ],
      confidence: 0.94,
      action: { type: "navigate", target: "incidents", label: "Open incident command" },
      generatedAt,
    };
  }

  if (costTerms.test(prompt)) {
    return {
      id: `copilot-cost-${generatedAt}`,
      intent: "cost",
      headline: "Cost variance isolated",
      summary: "Inference retries and elevated APAC egress explain most of the projected monthly variance.",
      reasoning: [
        "Compute unit cost rose while request volume remained inside forecast.",
        "The variance begins at the same time as the regional failover.",
        "A capacity adjustment can be simulated without changing production data.",
      ],
      confidence: 0.89,
      action: { type: "navigate", target: "intelligence", label: "Open cost intelligence" },
      generatedAt,
    };
  }

  if (deploymentTerms.test(prompt)) {
    return {
      id: `copilot-deploy-${generatedAt}`,
      intent: "deployment",
      headline: "Release risk review ready",
      summary: "Revenue API v4.9.7 is the only production deployment outside its normal error envelope.",
      reasoning: [
        "The warning deployment has 1.84% errors versus a 0.5% service budget.",
        "The previous artifact remains available for a reversible rollback.",
        "Preview and production traffic are isolated.",
      ],
      confidence: 0.92,
      action: { type: "navigate", target: "deployments", label: "Inspect deployment" },
      generatedAt,
    };
  }

  if (workflowTerms.test(prompt)) {
    return {
      id: `copilot-workflow-${generatedAt}`,
      intent: "workflow",
      headline: "Automation coverage assessed",
      summary: "The disabled cost anomaly guard is the largest recoverable gap in the current policy graph.",
      reasoning: [
        "The workflow already has an explicit owner-review gate.",
        "Its actions are advisory and do not mutate external systems.",
        "Historical synthetic success is 94.8%.",
      ],
      confidence: 0.87,
      action: { type: "navigate", target: "automations", label: "Review automations" },
      generatedAt,
    };
  }

  return {
    id: `copilot-overview-${generatedAt}`,
    intent: "overview",
    headline: "Operating posture summarized",
    summary: "The system is globally available with one contained SEV-1, one warning release, and healthy error-budget headroom.",
    reasoning: [
      "Five of six network nodes are serving traffic.",
      "The release guard and SLO recovery workflows are active.",
      "No real infrastructure action is available in this synthetic lab.",
    ],
    confidence: 0.86,
    action: { type: "navigate", target: "command", label: "Open command center" },
    generatedAt,
  };
}
