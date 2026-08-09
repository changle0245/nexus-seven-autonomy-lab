import type { Incident, Severity } from "@/lib/types";

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function severityRank(severity: Severity): number {
  return { "SEV-1": 1, "SEV-2": 2, "SEV-3": 3, "SEV-4": 4 }[severity];
}

export function sortIncidents(incidents: Incident[]): Incident[] {
  return incidents.toSorted((left, right) => {
    if (left.status === "resolved" && right.status !== "resolved") return 1;
    if (right.status === "resolved" && left.status !== "resolved") return -1;
    return severityRank(left.severity) - severityRank(right.severity);
  });
}

export function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
