import { describe, expect, it } from "vitest";
import { analyzePrompt, normalizePrompt } from "@/lib/copilot";

const at = "2026-08-09T08:45:00.000Z";

describe("NEXUS copilot", () => {
  it("normalizes and bounds untrusted prompt text", () => {
    expect(normalizePrompt("  deploy   risk  ")).toBe("deploy risk");
    expect(normalizePrompt("a".repeat(800))).toHaveLength(500);
    expect(normalizePrompt({ prompt: "x" })).toBe("");
  });

  it.each([
    ["APAC latency incident", "incident", "incidents"],
    ["why did cost increase?", "cost", "intelligence"],
    ["review production deployment", "deployment", "deployments"],
    ["检查自动化工作流", "workflow", "automations"],
  ])("routes %s to a safe, reversible recommendation", (prompt, intent, target) => {
    const result = analyzePrompt(prompt, at);
    expect(result.intent).toBe(intent);
    expect(result.action.type).toBe("navigate");
    expect(result.action.target).toBe(target);
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.reasoning.length).toBeGreaterThanOrEqual(3);
  });

  it("does not propose an action for an empty prompt", () => {
    const result = analyzePrompt("  ", at);
    expect(result.action.type).toBe("none");
    expect(result.confidence).toBe(1);
  });
});
