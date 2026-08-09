"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import {
  ArchiveRestore,
  Check,
  Download,
  Eye,
  FileClock,
  Filter,
  Languages,
  LockKeyhole,
  Moon,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  ToggleLeft,
  Upload,
  X,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { EmptyState, Panel, ProgressBar, StatusPill } from "@/components/ui";
import { initialState } from "@/lib/seed";
import { downloadTextFile } from "@/lib/utils";
import type { AuditEvent, NexusState } from "@/lib/types";

function resultTone(result: AuditEvent["result"]) {
  if (result === "success") return "success" as const;
  if (result === "blocked") return "danger" as const;
  return "warning" as const;
}

function AuditCenter() {
  const { state, t } = useNexus();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | AuditEvent["result"]>("all");
  const deferredQuery = useDeferredValue(query.toLowerCase());

  const events = useMemo(
    () =>
      state.auditEvents.filter((event) => {
        const matchesFilter = filter === "all" || event.result === filter;
        const matchesQuery =
          !deferredQuery ||
          [event.id, event.actor, event.action, event.resource, event.source]
            .join(" ")
            .toLowerCase()
            .includes(deferredQuery);
        return matchesFilter && matchesQuery;
      }),
    [deferredQuery, filter, state.auditEvents],
  );

  const exportAudit = () => {
    const header = "id,time,actor,action,resource,result,source";
    const rows = state.auditEvents.map((event) =>
      [event.id, event.at, event.actor, event.action, event.resource, event.result, event.source]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(","),
    );
    downloadTextFile("nexus-seven-audit.csv", [header, ...rows].join("\n"), "text/csv");
  };

  return (
    <>
      <div className="view-heading">
        <div>
          <span className="eyebrow">TRACEABLE · EXPLAINABLE · EXPORTABLE</span>
          <h1>{t.auditTrail}</h1>
          <p>Every synthetic human, agent, policy, and deployment decision shares one queryable chronology.</p>
        </div>
        <button type="button" className="button secondary" onClick={exportAudit}><Download size={16} /> {t.exportCsv}</button>
      </div>

      <div className="audit-overview">
        <article><FileClock size={18} /><span>Events indexed</span><strong>128.4k</strong><small>90-day synthetic retention</small></article>
        <article><ShieldCheck size={18} /><span>Policy coverage</span><strong>100%</strong><small>all agent actions traceable</small></article>
        <article><LockKeyhole size={18} /><span>Blocked access</span><strong>14</strong><small>least-privilege working</small></article>
        <article><Eye size={18} /><span>Review queue</span><strong>0</strong><small>nothing unowned</small></article>
      </div>

      <Panel className="audit-panel" eyebrow={`${events.length} VISIBLE EVENTS`} title="Event stream">
        <div className="audit-toolbar">
          <label className="search-field">
            <Search size={15} />
            <span className="sr-only">Search audit events</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Actor, action, resource, source…" />
          </label>
          <div className="segmented-control">
            <Filter size={14} />
            {(["all", "success", "warning", "blocked"] as const).map((value) => (
              <button type="button" key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>
                {value}
              </button>
            ))}
          </div>
        </div>
        {events.length ? (
          <div className="audit-table" role="table" aria-label="Audit events">
            <div className="audit-table-head" role="row">
              <span>Time</span><span>Actor</span><span>Action</span><span>Resource</span><span>Result</span><span>Source</span>
            </div>
            {events.map((event) => (
              <div className="audit-table-row" role="row" key={event.id}>
                <time className="mono">{event.at}</time>
                <span><i className="actor-dot" /> {event.actor}</span>
                <strong className="mono">{event.action}</strong>
                <span className="mono">{event.resource}</span>
                <StatusPill label={event.result} tone={resultTone(event.result)} />
                <small>{event.source}</small>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={FileClock} title="No matching audit events" body="Try a broader query or clear the result filter." />
        )}
      </Panel>
    </>
  );
}

function ResetDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="reset-title">
        <div className="modal-heading">
          <div><span className="eyebrow">LOCAL RECOVERABLE DATA</span><h2 id="reset-title">Reset the lab?</h2></div>
          <button type="button" className="icon-button" onClick={onCancel} aria-label="Close"><X size={17} /></button>
        </div>
        <p className="modal-copy">This restores the bundled synthetic fixtures and clears local interaction changes. No cloud or repository data is affected.</p>
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onCancel}>Cancel</button>
          <button type="button" className="button danger" onClick={onConfirm}><ArchiveRestore size={15} /> Reset synthetic data</button>
        </div>
      </div>
    </div>
  );
}

function SettingsCenter() {
  const { state, dispatch, t } = useNexus();
  const [resetOpen, setResetOpen] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const exportState = () => {
    downloadTextFile(
      "nexus-seven-snapshot.json",
      JSON.stringify({ ...state, exportedAt: new Date().toISOString(), synthetic: true }, null, 2),
      "application/json",
    );
  };

  const importState = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<NexusState>;
      if (parsed.schemaVersion !== 1) throw new Error("Unsupported snapshot schema");
      dispatch({ type: "hydrate", state: parsed });
      setImportMessage("Snapshot imported through the allowlisted schema.");
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "Unable to import snapshot");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      <div className="view-heading">
        <div>
          <span className="eyebrow">LOCAL-FIRST · VERSIONED STATE · SAFE DEFAULTS</span>
          <h1>{t.settings}</h1>
          <p>Control language, theme, density, feature rollout, data portability, and experiment recovery.</p>
        </div>
        <StatusPill label="Schema v1" tone="info" />
      </div>

      <div className="settings-layout">
        <Panel className="preference-panel" eyebrow="ACCESSIBLE BY DEFAULT" title={t.preferences}>
          <div className="preference-list">
            <div className="preference-row">
              <span className="preference-icon"><Languages size={17} /></span>
              <div><strong>{t.language}</strong><p>Instant UI translation without a network request.</p></div>
              <div className="segmented-control">
                <button type="button" className={state.locale === "zh" ? "active" : ""} onClick={() => dispatch({ type: "set-locale", locale: "zh" })}>中文</button>
                <button type="button" className={state.locale === "en" ? "active" : ""} onClick={() => dispatch({ type: "set-locale", locale: "en" })}>English</button>
              </div>
            </div>
            <div className="preference-row">
              <span className="preference-icon">{state.theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}</span>
              <div><strong>{t.theme}</strong><p>High-contrast dark and daylight operating surfaces.</p></div>
              <div className="segmented-control">
                <button type="button" className={state.theme === "dark" ? "active" : ""} onClick={() => dispatch({ type: "set-theme", theme: "dark" })}><Moon size={14} /> Dark</button>
                <button type="button" className={state.theme === "light" ? "active" : ""} onClick={() => dispatch({ type: "set-theme", theme: "light" })}><Sun size={14} /> Light</button>
              </div>
            </div>
            <div className="preference-row">
              <span className="preference-icon"><SlidersHorizontal size={17} /></span>
              <div><strong>{t.density}</strong><p>Adapt information density without losing semantics.</p></div>
              <div className="segmented-control">
                <button type="button" className={state.density === "comfortable" ? "active" : ""} onClick={() => dispatch({ type: "set-density", density: "comfortable" })}>{t.comfortable}</button>
                <button type="button" className={state.density === "compact" ? "active" : ""} onClick={() => dispatch({ type: "set-density", density: "compact" })}>{t.compact}</button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="feature-panel" eyebrow="SAFE ROLLOUTS" title={t.featureFlags}>
          <div className="feature-list">
            {state.featureFlags.map((flag) => (
              <article key={flag.id} className="feature-row">
                <span className="preference-icon"><ToggleLeft size={18} /></span>
                <div><strong>{flag.label}</strong><p>{flag.description}</p><ProgressBar value={flag.rollout} tone={flag.enabled ? "violet" : "cyan"} label={flag.label} /></div>
                <button
                  type="button"
                  className={flag.enabled ? "toggle-control on" : "toggle-control"}
                  role="switch"
                  aria-checked={flag.enabled}
                  onClick={() => dispatch({ type: "toggle-feature", featureId: flag.id })}
                >
                  <span />
                  {flag.enabled ? t.enabled : t.disabled}
                </button>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="data-tools-panel" eyebrow="PORTABLE · NO LOCK-IN" title="Data recovery & portability">
          <div className="data-tools">
            <button type="button" className="data-tool" onClick={exportState}>
              <span><Download size={18} /></span><div><strong>{t.exportState}</strong><p>Download the complete synthetic client state as versioned JSON.</p></div><Check size={15} />
            </button>
            <button type="button" className="data-tool" onClick={() => fileRef.current?.click()}>
              <span><Upload size={18} /></span><div><strong>Import snapshot</strong><p>Only schema v1 allowlisted fields are accepted.</p></div>
            </button>
            <button type="button" className="data-tool danger-tool" onClick={() => setResetOpen(true)}>
              <span><ArchiveRestore size={18} /></span><div><strong>{t.resetLab}</strong><p>Restore bundled fixtures without touching any cloud system.</p></div>
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(event) => void importState(event.target.files?.[0])} />
            {importMessage ? <p className="import-message" role="status">{importMessage}</p> : null}
          </div>
        </Panel>

        <Panel className="security-boundary-panel" eyebrow="EXPERIMENT BOUNDARY" title="Security posture">
          <div className="security-boundary">
            <span className="security-shield"><ShieldCheck size={28} /></span>
            <div>
              <strong>No production credentials or real user data</strong>
              <p>All records are synthetic. State changes remain in this browser, API routes validate bounded input, and destructive external actions do not exist.</p>
              <div className="boundary-tags"><span>same-origin CSP</span><span>versioned local storage</span><span>4 KB API limit</span><span>audited actions</span></div>
            </div>
          </div>
        </Panel>
      </div>

      {resetOpen ? (
        <ResetDialog
          onCancel={() => setResetOpen(false)}
          onConfirm={() => {
            dispatch({ type: "reset", state: initialState });
            window.localStorage.removeItem("nexus-seven-state-v1");
            setResetOpen(false);
          }}
        />
      ) : null}
    </>
  );
}

export function AuditSettings({ mode }: { mode: "audit" | "settings" }) {
  return <div className="view audit-settings-view">{mode === "audit" ? <AuditCenter /> : <SettingsCenter />}</div>;
}
