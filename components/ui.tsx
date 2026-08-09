import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  id,
}: {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`panel ${className}`} id={id}>
      {title || eyebrow || action ? (
        <div className="panel-header">
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
          </div>
          {action ? <div className="panel-action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "cyan",
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  tone?: "cyan" | "violet" | "amber" | "green" | "red";
  detail?: ReactNode;
}) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-topline">
        <span className="metric-icon" aria-hidden="true">
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <span className="metric-delta">{delta}</span>
      </div>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {detail ? <div className="metric-detail">{detail}</div> : null}
    </article>
  );
}

export function StatusPill({
  label,
  tone = "neutral",
  pulse = false,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  pulse?: boolean;
}) {
  return (
    <span className={`status-pill status-${tone}`}>
      <span className={pulse ? "status-dot pulse" : "status-dot"} aria-hidden="true" />
      {label}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "cyan",
  label,
}: {
  value: number;
  tone?: "cyan" | "violet" | "amber" | "green" | "red";
  label?: string;
}) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-label={label}
    >
      <span className={`progress-fill tone-${tone}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="avatar-stack" aria-label={names.join(", ")}>
      {names.map((name, index) => (
        <span key={name} className={`avatar avatar-${index % 4}`} title={name}>
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </span>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="empty-state">
      <Icon size={28} aria-hidden="true" />
      <strong>{title}</strong>
      <p>{body}</p>
    </div>
  );
}
