import { apiError, apiSuccess, readJsonBody } from "@/lib/api";
import { initialIncidents } from "@/lib/seed";
import type { Incident, Severity } from "@/lib/types";

export const dynamic = "force-dynamic";

const severities = new Set<Severity>(["SEV-1", "SEV-2", "SEV-3", "SEV-4"]);

export function GET(request: Request) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const incidents = status
    ? initialIncidents.filter((incident) => incident.status === status)
    : initialIncidents;
  return apiSuccess(request, { incidents, total: incidents.length });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const code = error instanceof Error ? error.message : "INVALID_BODY";
    return apiError(
      request,
      code === "PAYLOAD_TOO_LARGE" ? 413 : 400,
      code,
      "The request body must be valid JSON under 4 KB.",
    );
  }

  if (!body || typeof body !== "object") {
    return apiError(request, 422, "VALIDATION_ERROR", "An incident object is required.");
  }

  const candidate = body as Record<string, unknown>;
  const title = typeof candidate.title === "string" ? candidate.title.trim().slice(0, 120) : "";
  const service = typeof candidate.service === "string" ? candidate.service.trim().slice(0, 80) : "";
  const severity = candidate.severity as Severity;

  if (title.length < 4 || service.length < 2 || !severities.has(severity)) {
    return apiError(
      request,
      422,
      "VALIDATION_ERROR",
      "title, service, and a valid severity are required.",
    );
  }

  const createdAt = new Date().toISOString();
  const incident: Incident = {
    id: `INC-LAB-${createdAt.replace(/\D/g, "").slice(-8)}`,
    title,
    service,
    severity,
    status: "open",
    owner: "Unassigned",
    openedAt: createdAt,
    impact: "Synthetic test incident; no real users are affected.",
    affectedUsers: 0,
    progress: 5,
    timeline: [
      {
        id: `timeline-${createdAt}`,
        at: "now",
        label: "Synthetic incident created through validated API",
        kind: "signal",
      },
    ],
  };

  return apiSuccess(request, { incident }, { status: 201 });
}
