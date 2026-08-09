"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Code2,
  GitBranch,
  Globe2,
  History,
  LoaderCircle,
  RotateCcw,
  Rocket,
  Server,
  ShieldCheck,
  X,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { Panel, ProgressBar, StatusPill } from "@/components/ui";
import type { Deployment } from "@/lib/types";

function deploymentTone(status: Deployment["status"]) {
  if (status === "ready") return "success" as const;
  if (status === "failed") return "danger" as const;
  if (status === "warning") return "warning" as const;
  return "info" as const;
}

function RollbackDialog({
  deployment,
  onCancel,
  onConfirm,
}: {
  deployment: Deployment;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <div className="modal-card rollback-modal" role="dialog" aria-modal="true" aria-labelledby="rollback-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">REVERSIBLE SYNTHETIC ACTION</span>
            <h2 id="rollback-title">Simulate rollback</h2>
          </div>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Close"><X size={17} /></button>
        </div>
        <div className="rollback-summary">
          <span className="deployment-icon"><RotateCcw size={20} /></span>
          <div><strong>{deployment.project}</strong><p>{deployment.version} · {deployment.environment} · {deployment.region}</p></div>
        </div>
        <div className="safety-grid">
          <div><CheckCircle2 size={16} /><span>Previous artifact retained</span></div>
          <div><ShieldCheck size={16} /><span>No real traffic attached</span></div>
          <div><History size={16} /><span>Audit event will be recorded</span></div>
        </div>
        <p className="modal-copy">This updates only the browser&apos;s synthetic deployment model and is safe to repeat.</p>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="button danger" onClick={onConfirm}><RotateCcw size={15} /> Confirm simulation</button>
        </div>
      </div>
    </div>
  );
}

export function DeploymentControl() {
  const { state, dispatch, t } = useNexus();
  const [selectedId, setSelectedId] = useState(state.deployments[0]?.id ?? "");
  const [pendingRollback, setPendingRollback] = useState<Deployment | null>(null);
  const selected = state.deployments.find((deployment) => deployment.id === selectedId) ?? state.deployments[0];
  const readyCount = state.deployments.filter((deployment) => deployment.status === "ready").length;

  const checks = useMemo(
    () => [
      { label: "Type safety", status: "passed", detail: "0 errors" },
      { label: "Unit contracts", status: "passed", detail: "42 checks" },
      { label: "Browser journey", status: "passed", detail: "7 flows" },
      { label: "Error budget", status: selected?.status === "warning" ? "warning" : "passed", detail: selected?.status === "warning" ? "1.84%" : "0.12%" },
      { label: "Policy review", status: "passed", detail: "signed" },
    ],
    [selected?.status],
  );

  return (
    <div className="view deployment-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">BUILD ONCE · VERIFY · PROMOTE · ROLLBACK</span>
          <h1>{t.releaseControl}</h1>
          <p>One artifact moves through preview, policy gates, staged traffic, production, and recovery.</p>
        </div>
        <button type="button" className="button primary"><Rocket size={16} /> Create release candidate</button>
      </div>

      <div className="deployment-summary">
        <article><Globe2 size={18} /><span>Production services</span><strong>{readyCount} healthy</strong><small>of {state.deployments.length} tracked</small></article>
        <article><GitBranch size={18} /><span>Preview environments</span><strong>14 active</strong><small>isolated synthetic data</small></article>
        <article><Clock3 size={18} /><span>Median lead time</span><strong>8m 42s</strong><small>-31% this week</small></article>
        <article><RotateCcw size={18} /><span>Recovery objective</span><strong>54 sec</strong><small>artifact promotion only</small></article>
      </div>

      <div className="release-train" aria-label="Release pipeline">
        {[
          ["Source", "7f3a19d", Code2, "complete"],
          ["Build", "1m 48s", Box, "complete"],
          ["Quality", "42 / 42", ShieldCheck, "complete"],
          ["Canary", "10% traffic", Activity, "active"],
          ["Production", "awaiting gate", Globe2, "pending"],
        ].map(([label, detail, Icon, status], index) => {
          const StageIcon = Icon as typeof Code2;
          return (
            <div className={`release-stage stage-${status}`} key={String(label)}>
              <span className="stage-icon">{status === "active" ? <LoaderCircle size={17} className="spin" /> : <StageIcon size={17} />}</span>
              <div><small>0{index + 1}</small><strong>{label as string}</strong><span>{detail as string}</span></div>
              {index < 4 ? <ChevronRight size={16} className="stage-arrow" /> : null}
            </div>
          );
        })}
      </div>

      <div className="deployment-layout">
        <Panel className="deployment-table-panel" eyebrow="ALL ENVIRONMENTS" title="Deployment matrix">
          <div className="deployment-table" role="table" aria-label="Deployments">
            <div className="deployment-table-head" role="row">
              <span>Project</span><span>{t.environment}</span><span>{t.status}</span><span>{t.latency}</span><span>{t.errors}</span><span>Version</span>
            </div>
            {state.deployments.map((deployment) => (
              <button
                type="button"
                role="row"
                key={deployment.id}
                className={selected?.id === deployment.id ? "deployment-table-row selected" : "deployment-table-row"}
                onClick={() => setSelectedId(deployment.id)}
              >
                <span><i className="project-glyph"><Server size={15} /></i><strong>{deployment.project}</strong><small>{deployment.region}</small></span>
                <span><b className={`env-badge env-${deployment.environment}`}>{deployment.environment}</b></span>
                <span><StatusPill label={deployment.status} tone={deploymentTone(deployment.status)} pulse={deployment.status === "building"} /></span>
                <span className="mono">{deployment.latency} ms</span>
                <span className={deployment.errorRate > 1 ? "mono warning-text" : "mono"}>{deployment.errorRate}%</span>
                <span><strong className="mono">{deployment.version}</strong><small>{deployment.commit}</small></span>
              </button>
            ))}
          </div>
        </Panel>

        {selected ? (
          <Panel
            className="release-detail-panel"
            eyebrow={`${selected.environment.toUpperCase()} · ${selected.region}`}
            title={selected.project}
            action={<StatusPill label={selected.status} tone={deploymentTone(selected.status)} pulse={selected.status === "building"} />}
          >
            <div className="artifact-card">
              <span className="artifact-icon"><Box size={21} /></span>
              <div><small>Immutable artifact</small><strong>{selected.version}</strong><span className="mono">{selected.commit}</span></div>
              <Check size={17} />
            </div>
            <div className="quality-gates">
              {checks.map((check) => (
                <div key={check.label} className={check.status === "passed" ? "quality-check passed" : "quality-check warning"}>
                  {check.status === "passed" ? <Check size={14} /> : <Activity size={14} />}
                  <span>{check.label}</span>
                  <strong>{check.detail}</strong>
                </div>
              ))}
            </div>
            <div className="traffic-allocation">
              <div><span>Traffic allocation</span><strong>{selected.environment === "production" ? "100%" : "10%"}</strong></div>
              <ProgressBar value={selected.environment === "production" ? 100 : 10} tone={selected.status === "warning" ? "amber" : "green"} label="Traffic allocation" />
            </div>
            <div className="release-actions">
              <button type="button" className="button secondary"><Code2 size={15} /> {t.inspect}</button>
              <button type="button" className="button danger-outline" onClick={() => setPendingRollback(selected)}><RotateCcw size={15} /> {t.rollback}</button>
            </div>
          </Panel>
        ) : null}
      </div>

      {pendingRollback ? (
        <RollbackDialog
          deployment={pendingRollback}
          onCancel={() => setPendingRollback(null)}
          onConfirm={() => {
            dispatch({ type: "rollback-deployment", deploymentId: pendingRollback.id, at: new Date().toISOString() });
            setPendingRollback(null);
          }}
        />
      ) : null}
    </div>
  );
}
