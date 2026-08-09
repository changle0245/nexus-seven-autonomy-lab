import { describe, expect, it } from "vitest";
import { nexusReducer, parsePersistedState, selectPersistedState } from "@/lib/reducer";
import { initialState } from "@/lib/seed";

describe("nexusReducer", () => {
  it("acknowledges an incident and writes an audit event", () => {
    const next = nexusReducer(initialState, {
      type: "acknowledge-incident",
      incidentId: "INC-2048",
    });

    expect(next.incidents[0].status).toBe("acknowledged");
    expect(next.incidents[0].timeline.at(-1)?.kind).toBe("human");
    expect(next.auditEvents[0].action).toBe("incident.acknowledge");
  });

  it("resolves an incident and preserves all other incidents", () => {
    const next = nexusReducer(initialState, {
      type: "resolve-incident",
      incidentId: "INC-2047",
    });

    expect(next.incidents).toHaveLength(initialState.incidents.length);
    expect(next.incidents.find((incident) => incident.id === "INC-2047")).toMatchObject({
      status: "resolved",
      progress: 100,
    });
    expect(next.notifications[0].level).toBe("success");
  });

  it("runs a workflow without mutating the seed object", () => {
    const originalRuns = initialState.workflows[0].runs;
    const next = nexusReducer(initialState, {
      type: "run-workflow",
      workflowId: "wf-auto-remediate",
      at: "2026-08-09T08:45:00.000Z",
    });

    expect(next.workflows[0].runs).toBe(originalRuns + 1);
    expect(next.workflows[0].steps[1].status).toBe("running");
    expect(initialState.workflows[0].runs).toBe(originalRuns);
  });

  it("rejects persisted state from an unknown schema", () => {
    expect(parsePersistedState('{"schemaVersion":2,"theme":"light"}')).toBeNull();
  });

  it("round-trips the allowlisted persistent state", () => {
    const selected = selectPersistedState({ ...initialState, theme: "light", locale: "en" });
    const parsed = parsePersistedState(JSON.stringify(selected));

    expect(parsed).toMatchObject({ schemaVersion: 1, theme: "light", locale: "en" });
    expect(parsed).not.toHaveProperty("notifications");
    expect(parsed).not.toHaveProperty("auditEvents");
  });
});
