"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CircleDot,
  GitBranch,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserCheck,
  Workflow as WorkflowIcon,
  Zap,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { Panel, ProgressBar, StatusPill } from "@/components/ui";
import type { WorkflowStep } from "@/lib/types";

function StepIcon({ kind }: { kind: WorkflowStep["kind"] }) {
  if (kind === "trigger") return <Zap size={17} />;
  if (kind === "decision") return <GitBranch size={17} />;
  if (kind === "approval") return <UserCheck size={17} />;
  return <Bot size={17} />;
}

export function WorkflowStudio() {
  const { state, dispatch, t } = useNexus();
  const [selectedId, setSelectedId] = useState(state.workflows[0]?.id ?? "");
  const [executionId, setExecutionId] = useState<string | null>(null);
  const selected = state.workflows.find((workflow) => workflow.id === selectedId) ?? state.workflows[0];

  const coverage = useMemo(() => {
    const enabled = state.workflows.filter((workflow) => workflow.enabled).length;
    return Math.round((enabled / Math.max(state.workflows.length, 1)) * 100);
  }, [state.workflows]);

  const run = () => {
    if (!selected) return;
    const at = new Date().toISOString();
    dispatch({ type: "run-workflow", workflowId: selected.id, at });
    setExecutionId(`run-${at}`);
    window.setTimeout(() => setExecutionId(null), 2_800);
  };

  return (
    <div className="view workflow-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">POLICY-AWARE · HUMAN OVERRIDES · AUDITABLE</span>
          <h1>{t.orchestration}</h1>
          <p>Compose detection, reasoning, reversible actions, approvals, and verification as one visible system.</p>
        </div>
        <button type="button" className="button primary">
          <Plus size={16} /> New draft workflow
        </button>
      </div>

      <div className="workflow-overview">
        <article><WorkflowIcon size={18} /><span>Active workflows</span><strong>2 / 3</strong><small>one advisory guard paused</small></article>
        <article><Sparkles size={18} /><span>Autonomous coverage</span><strong>{coverage}%</strong><small>low-risk actions only</small></article>
        <article><ShieldCheck size={18} /><span>Policy decisions</span><strong>1,284</strong><small>0 unreviewed exceptions</small></article>
        <article><TimerReset size={18} /><span>Time returned</span><strong>41.6h</strong><small>this synthetic month</small></article>
      </div>

      <div className="workflow-layout">
        <Panel className="workflow-list-panel" eyebrow="AUTOMATION LIBRARY" title="Operational workflows">
          <div className="workflow-list">
            {state.workflows.map((workflow) => (
              <button
                type="button"
                key={workflow.id}
                className={selected?.id === workflow.id ? "workflow-card selected" : "workflow-card"}
                onClick={() => setSelectedId(workflow.id)}
              >
                <div className="workflow-card-top">
                  <span className="workflow-symbol"><WorkflowIcon size={17} /></span>
                  <StatusPill label={workflow.enabled ? t.enabled : t.disabled} tone={workflow.enabled ? "success" : "neutral"} pulse={workflow.enabled} />
                </div>
                <strong>{workflow.name}</strong>
                <p>{workflow.description}</p>
                <div className="workflow-card-meta">
                  <span>{workflow.runs} runs</span>
                  <span>{workflow.successRate}% success</span>
                  <span>{workflow.lastRun}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        {selected ? (
          <div className="workflow-canvas-column">
            <Panel
              className="workflow-canvas-panel"
              eyebrow={selected.trigger}
              title={selected.name}
              action={
                <div className="canvas-actions">
                  <button
                    type="button"
                    className={selected.enabled ? "toggle-control on" : "toggle-control"}
                    role="switch"
                    aria-checked={selected.enabled}
                    onClick={() => dispatch({ type: "toggle-workflow", workflowId: selected.id })}
                  >
                    <span />
                    {selected.enabled ? t.enabled : t.disabled}
                  </button>
                  <button type="button" className="button primary small" onClick={run} disabled={!selected.enabled || executionId !== null}>
                    {executionId ? <CircleDot size={15} className="pulse-icon" /> : <Play size={15} />}
                    {executionId ? "Executing" : t.runNow}
                  </button>
                </div>
              }
            >
              <div className={executionId ? "workflow-graph executing" : "workflow-graph"}>
                {selected.steps.map((step, index) => (
                  <div className="graph-segment" key={step.id}>
                    <article className={`graph-node node-${step.kind} ${step.status}`}>
                      <span className="graph-node-icon"><StepIcon kind={step.kind} /></span>
                      <div><small>{step.kind}</small><strong>{step.label}</strong></div>
                      {step.status === "running" ? <CircleDot size={14} className="pulse-icon" /> : <Check size={14} />}
                    </article>
                    {index < selected.steps.length - 1 ? (
                      <span className="graph-connector"><ArrowRight size={18} /></span>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="execution-ribbon">
                <div><CircleDot size={14} /><span>Trigger</span><strong>{selected.trigger}</strong></div>
                <div><ShieldCheck size={14} /><span>Maximum blast radius</span><strong>8%</strong></div>
                <div><UserCheck size={14} /><span>Human approval</span><strong>Required above policy</strong></div>
              </div>
            </Panel>

            <div className="workflow-secondary-grid">
              <Panel eyebrow="POLICY SIMULATOR" title="Decision boundaries">
                <div className="policy-list">
                  {[
                    ["Traffic shift", "Auto under 8%", 82],
                    ["Capacity scale", "Auto under $140/h", 64],
                    ["Production rollback", "Human approval", 28],
                    ["Credential access", "Always blocked", 100],
                  ].map(([label, detail, value], index) => (
                    <div className="policy-row" key={String(label)}>
                      <span className={index === 3 ? "policy-icon blocked" : "policy-icon"}>{index === 3 ? <Pause size={14} /> : <ShieldCheck size={14} />}</span>
                      <div><strong>{label}</strong><small>{detail}</small></div>
                      <ProgressBar value={Number(value)} tone={index === 3 ? "red" : "violet"} label={String(label)} />
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel eyebrow="LAST 24 HOURS" title="Execution history">
                <div className="run-history">
                  {[
                    ["run-8491", "Autonomous SLO recovery", "success", "4m"],
                    ["run-8488", "Progressive release guard", "success", "28m"],
                    ["run-8479", "Cost anomaly guard", "waiting", "2h"],
                    ["run-8471", "Autonomous SLO recovery", "success", "5h"],
                  ].map(([id, name, status, time]) => (
                    <article key={id}>
                      <span className={status === "success" ? "run-dot success" : "run-dot waiting"} />
                      <div><strong>{name}</strong><small className="mono">{id}</small></div>
                      <StatusPill label={status} tone={status === "success" ? "success" : "warning"} />
                      <time>{time}</time>
                    </article>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
