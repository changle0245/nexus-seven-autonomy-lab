"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Filter,
  Plus,
  Search,
  ShieldAlert,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { EmptyState, Panel, ProgressBar, StatusPill } from "@/components/ui";
import { formatCompact, sortIncidents } from "@/lib/utils";
import type { Incident, IncidentStatus, Severity } from "@/lib/types";

type FilterValue = "active" | IncidentStatus | "all";

function severityTone(severity: Severity) {
  if (severity === "SEV-1") return "danger" as const;
  if (severity === "SEV-2") return "warning" as const;
  return "info" as const;
}

function CreateIncidentDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (incident: Incident) => void;
}) {
  const [title, setTitle] = useState("");
  const [service, setService] = useState("");
  const [severity, setSeverity] = useState<Severity>("SEV-2");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, service, severity }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Unable to create incident");
      onCreated(payload.data.incident as Incident);
      onClose();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create incident");
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-incident-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">VALIDATED SYNTHETIC API</span>
            <h2 id="create-incident-title">Create test incident</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>
        <form onSubmit={submit} className="form-stack">
          <label>
            Incident title
            <input value={title} onChange={(event) => setTitle(event.target.value)} minLength={4} maxLength={120} required autoFocus placeholder="Regional cache saturation" />
          </label>
          <label>
            Affected service
            <input value={service} onChange={(event) => setService(event.target.value)} minLength={2} maxLength={80} required placeholder="Edge cache" />
          </label>
          <label>
            Severity
            <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)}>
              <option value="SEV-1">SEV-1 · Critical</option>
              <option value="SEV-2">SEV-2 · Major</option>
              <option value="SEV-3">SEV-3 · Moderate</option>
              <option value="SEV-4">SEV-4 · Minor</option>
            </select>
          </label>
          <div className="safety-note">
            <ShieldAlert size={16} />
            <p>This creates a local synthetic record. It cannot page people or change infrastructure.</p>
          </div>
          {status === "error" ? <p className="form-error" role="alert">{message}</p> : null}
          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button primary" disabled={status === "submitting"}>
              {status === "submitting" ? "Validating…" : "Create incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function IncidentCommand() {
  const { state, dispatch, t } = useNexus();
  const [filter, setFilter] = useState<FilterValue>("active");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(state.incidents[0]?.id ?? "");
  const [createOpen, setCreateOpen] = useState(false);
  const deferredQuery = useDeferredValue(query.toLowerCase());

  const incidents = useMemo(() => {
    return sortIncidents(state.incidents).filter((incident) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "active" ? incident.status !== "resolved" : incident.status === filter);
      const matchesQuery =
        !deferredQuery ||
        [incident.id, incident.title, incident.service, incident.owner]
          .join(" ")
          .toLowerCase()
          .includes(deferredQuery);
      return matchesFilter && matchesQuery;
    });
  }, [deferredQuery, filter, state.incidents]);

  const selected =
    state.incidents.find((incident) => incident.id === selectedId) ??
    incidents[0] ??
    state.incidents[0];

  return (
    <div className="view incident-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">HUMAN-IN-THE-LOOP · REVERSIBLE ACTIONS</span>
          <h1>{t.responseCommand}</h1>
          <p>Coordinate detection, ownership, evidence, mitigation, recovery, and learning in one timeline.</p>
        </div>
        <button type="button" className="button primary" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Create test incident
        </button>
      </div>

      <div className="incident-toolbar">
        <label className="search-field">
          <Search size={15} />
          <span className="sr-only">Search incidents</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search incidents, services, owners…" />
        </label>
        <div className="segmented-control" aria-label="Incident filter">
          <Filter size={14} />
          {(["active", "open", "acknowledged", "resolved", "all"] as const).map((value) => (
            <button type="button" key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="incident-command-grid">
        <Panel className="incident-list-panel" eyebrow={`${incidents.length} MATCHES`} title="Incident queue">
          {incidents.length ? (
            <div className="incident-list">
              {incidents.map((incident) => (
                <button
                  type="button"
                  key={incident.id}
                  className={selected?.id === incident.id ? "incident-row selected" : "incident-row"}
                  onClick={() => setSelectedId(incident.id)}
                >
                  <span className={`severity-rail severity-${incident.severity.slice(-1)}`} />
                  <div className="incident-row-main">
                    <div>
                      <StatusPill label={incident.severity} tone={severityTone(incident.severity)} />
                      <span className="mono">{incident.id}</span>
                      <small>{incident.service}</small>
                    </div>
                    <strong>{incident.title}</strong>
                    <p>{incident.impact}</p>
                    <div className="incident-meta">
                      <span><Clock3 size={12} /> {incident.openedAt.slice(11, 16)} UTC</span>
                      <span><Users size={12} /> {formatCompact(incident.affectedUsers)}</span>
                      <span><UserRound size={12} /> {incident.owner}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icon={CheckCircle2} title="No incidents match" body="Change the filter or create a synthetic incident." />
          )}
        </Panel>

        {selected ? (
          <Panel
            className="incident-detail-panel"
            eyebrow={`${selected.id} · ${selected.service}`}
            title={selected.title}
            action={<StatusPill label={selected.status} tone={selected.status === "resolved" ? "success" : "warning"} pulse={selected.status !== "resolved"} />}
          >
            <div className="detail-impact">
              <div><span>{t.impact}</span><strong>{selected.impact}</strong></div>
              <div><span>{t.owner}</span><strong>{selected.owner}</strong></div>
              <div><span>{t.users}</span><strong>{formatCompact(selected.affectedUsers)}</strong></div>
            </div>
            <div className="runbook-progress">
              <div><span>{t.runbook}</span><strong>{selected.progress}%</strong></div>
              <ProgressBar value={selected.progress} tone={selected.progress === 100 ? "green" : "violet"} label={t.runbook} />
            </div>
            <div className="timeline">
              {selected.timeline.map((item, index) => (
                <article key={item.id} className={`timeline-item timeline-${item.kind}`}>
                  <span className="timeline-marker" />
                  <time>{item.at}</time>
                  <div><strong>{item.label}</strong><small>Step {index + 1} · {item.kind}</small></div>
                </article>
              ))}
            </div>
            <div className="incident-actions">
              {selected.status === "open" ? (
                <button type="button" className="button secondary" onClick={() => dispatch({ type: "acknowledge-incident", incidentId: selected.id })}>
                  <AlertTriangle size={15} /> {t.acknowledge}
                </button>
              ) : null}
              {selected.status !== "resolved" ? (
                <button type="button" className="button primary" onClick={() => dispatch({ type: "resolve-incident", incidentId: selected.id })}>
                  <CheckCircle2 size={15} /> {t.resolve}
                </button>
              ) : (
                <StatusPill label="Recovery verified" tone="success" />
              )}
            </div>
          </Panel>
        ) : null}
      </div>

      {createOpen ? (
        <CreateIncidentDialog
          onClose={() => setCreateOpen(false)}
          onCreated={(incident) => {
            dispatch({ type: "create-incident", incident });
            setSelectedId(incident.id);
            setFilter("all");
          }}
        />
      ) : null}
    </div>
  );
}
