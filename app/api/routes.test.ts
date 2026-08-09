import { describe, expect, it } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getIncidents, POST as postIncident } from "@/app/api/incidents/route";
import { POST as postCopilot } from "@/app/api/copilot/route";

describe("NEXUS API contracts", () => {
  it("returns a request-traceable health envelope", async () => {
    const response = getHealth(
      new Request("http://localhost/api/health", {
        headers: { "x-request-id": "test-request" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      data: { status: "operational" },
      meta: { requestId: "test-request", synthetic: true },
    });
  });

  it("filters incidents without mutating fixtures", async () => {
    const response = getIncidents(
      new Request("http://localhost/api/incidents?status=open"),
    );
    const body = await response.json();
    expect(body.data.total).toBe(1);
    expect(body.data.incidents[0].status).toBe("open");
  });

  it("returns a controlled validation error", async () => {
    const response = await postIncident(
      new Request("http://localhost/api/incidents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: "x", severity: "SEV-9" }),
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(422);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("creates a bounded synthetic incident", async () => {
    const response = await postIncident(
      new Request("http://localhost/api/incidents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: "Regional cache saturation",
          service: "Edge cache",
          severity: "SEV-2",
        }),
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.data.incident).toMatchObject({
      title: "Regional cache saturation",
      status: "open",
      affectedUsers: 0,
    });
  });

  it("routes copilot prompts through the same safe domain model", async () => {
    const response = await postCopilot(
      new Request("http://localhost/api/copilot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: "Review deployment risk" }),
      }),
    );
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.data.intent).toBe("deployment");
    expect(body.data.action.target).toBe("deployments");
  });
});
