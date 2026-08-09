"use client";

import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Cpu,
  Gauge,
  Globe2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { NetworkMap, RingGauge, TelemetryChart } from "@/components/charts";
import { AvatarStack, MetricCard, Panel, ProgressBar, StatusPill } from "@/components/ui";
import { formatCompact, sortIncidents } from "@/lib/utils";

function severityTone(severity: string) {
  if (severity === "SEV-1") return "danger" as const;
  if (severity === "SEV-2") return "warning" as const;
  return "info" as const;
}

export function CommandCenter() {
  const { state, dispatch, t, setCopilotOpen } = useNexus();
  const [diagnostic, setDiagnostic] = useState<"idle" | "running" | "complete">("idle");
  const incidents = sortIncidents(state.incidents);
  const openIncidents = incidents.filter((incident) => incident.status !== "resolved");

  const runDiagnostic = () => {
    if (diagnostic === "running") return;
    setDiagnostic("running");
    window.setTimeout(() => {
      dispatch({ type: "tick" });
      setDiagnostic("complete");
      window.setTimeout(() => setDiagnostic("idle"), 2_400);
    }, 1_050);
  };

  return (
    <div className="view command-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">NORTHSTAR / GLOBAL CONTROL PLANE</span>
          <h1>{t.command}</h1>
          <p>One operating picture across reliability, delivery, cost, policy, and autonomous action.</p>
        </div>
        <div className="heading-actions">
          <button type="button" className="button secondary" onClick={() => setCopilotOpen(true)}>
            <Bot size={16} />
            {t.askCopilot}
          </button>
          <button type="button" className="button primary" onClick={runDiagnostic} disabled={diagnostic === "running"}>
            {diagnostic === "running" ? <RefreshCw size={16} className="spin" /> : diagnostic === "complete" ? <CheckCircle2 size={16} /> : <Sparkles size={16} />}
            {diagnostic === "running" ? "Scanning 6 regions" : diagnostic === "complete" ? "Diagnostic clean" : t.runDiagnostic}
          </button>
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard icon={Activity} label={t.requestVolume} value="98.4k" delta="+12.6%" tone="cyan" detail={<span>per minute · global</span>} />
        <MetricCard icon={ShieldCheck} label={t.availability} value="99.982%" delta="+0.014%" tone="green" detail={<span>above 99.95% SLO</span>} />
        <MetricCard icon={Gauge} label="Global p95" value="124 ms" delta="-18 ms" tone="violet" detail={<span>7-day best</span>} />
        <MetricCard icon={Zap} label={t.autoResolved} value="84%" delta="+9.2%" tone="amber" detail={<span>37 actions · policy-safe</span>} />
        <MetricCard icon={CircleGauge} label={t.errorBudget} value="76.8%" delta="+2.1%" tone="cyan" detail={<span>21d 14h remaining</span>} />
      </div>

      <div className="dashboard-grid hero-grid">
        <Panel className="score-panel" eyebrow="OPERATING POSTURE" title={t.operationsScore}>
          <div className="score-content">
            <RingGauge value={94} label="resilience" detail="+3 this week" />
            <div className="score-breakdown">
              <p>{t.scoreCaption}</p>
              {[
                ["Reliability", 96, "green"],
                ["Automation", 84, "violet"],
                ["Security", 98, "cyan"],
                ["Cost efficiency", 89, "amber"],
              ].map(([label, value, tone]) => (
                <div className="score-row" key={label}>
                  <span>{label}</span>
                  <ProgressBar value={Number(value)} tone={tone as "green" | "violet" | "cyan" | "amber"} label={String(label)} />
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel
          className="telemetry-panel"
          eyebrow="24 HOURS · LIVE INDEX"
          title={t.liveTelemetry}
          action={<StatusPill label="Streaming" tone="success" pulse />}
        >
          <TelemetryChart tick={state.telemetryTick} />
        </Panel>
      </div>

      <div className="dashboard-grid operations-grid">
        <Panel
          className="fabric-panel"
          eyebrow="6 REGIONS · 18 SERVICES"
          title={t.globalFabric}
          action={<button type="button" className="text-button" onClick={() => dispatch({ type: "navigate", view: "deployments" })}>Topology <ArrowUpRight size={14} /></button>}
        >
          <NetworkMap />
        </Panel>

        <Panel
          className="incident-panel"
          eyebrow={`${openIncidents.length} ACTIVE · 1 CONTAINED`}
          title={t.activeIncidents}
          action={<button type="button" className="text-button" onClick={() => dispatch({ type: "navigate", view: "incidents" })}>{t.all} <ArrowUpRight size={14} /></button>}
        >
          <div className="incident-compact-list">
            {incidents.slice(0, 3).map((incident) => (
              <button
                type="button"
                className="incident-compact"
                key={incident.id}
                onClick={() => dispatch({ type: "navigate", view: "incidents" })}
              >
                <div className="incident-title-row">
                  <StatusPill label={incident.severity} tone={severityTone(incident.severity)} />
                  <span>{incident.id}</span>
                  <small>{incident.status}</small>
                </div>
                <strong>{incident.title}</strong>
                <p>{incident.impact}</p>
                <div className="incident-meta">
                  <span><Clock3 size={13} /> {incident.openedAt.slice(11, 16)} UTC</span>
                  <span><Users size={13} /> {formatCompact(incident.affectedUsers)}</span>
                  <span>{incident.owner}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="dashboard-grid lower-grid">
        <Panel eyebrow="AGENTIC OPERATIONS" title="Autonomy ledger">
          <div className="autonomy-ledger">
            {[
              { icon: Bot, label: "Traffic shifted", detail: "AI Gateway · hnd1 → sin1", time: "3m", tone: "violet" },
              { icon: ShieldCheck, label: "Policy gate passed", detail: "Blast radius below 8%", time: "4m", tone: "green" },
              { icon: Cpu, label: "Capacity rebalanced", detail: "+4 warm inference workers", time: "11m", tone: "cyan" },
              { icon: Radio, label: "Signal correlated", detail: "12 telemetry streams", time: "14m", tone: "amber" },
            ].map((event) => {
              const Icon = event.icon;
              return (
                <article key={event.label} className="ledger-event">
                  <span className={`ledger-icon tone-${event.tone}`}><Icon size={16} /></span>
                  <div><strong>{event.label}</strong><p>{event.detail}</p></div>
                  <time>{event.time}</time>
                </article>
              );
            })}
          </div>
        </Panel>

        <Panel eyebrow="PEOPLE + AGENTS" title="Response cell">
          <div className="response-cell">
            <div className="response-copy">
              <AvatarStack names={["Maya Chen", "Owen Park", "NEXUS Agent", "Policy Engine"]} />
              <div><strong>4 active collaborators</strong><p>One shared incident model, no duplicate actions.</p></div>
            </div>
            <div className="response-stats">
              <div><Globe2 size={16} /><span>Coverage</span><strong>24×7</strong></div>
              <div><Clock3 size={16} /><span>MTTA</span><strong>1m 42s</strong></div>
              <div><CheckCircle2 size={16} /><span>Handoffs</span><strong>0 lost</strong></div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
