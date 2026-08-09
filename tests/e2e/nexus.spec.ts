import { expect, test } from "@playwright/test";

test("serves a hardened command center and rejects unsafe API inputs", async ({ page, request }) => {
  const health = await request.get("/api/health", {
    headers: { "x-request-id": "e2e-health" },
  });
  expect(health.status()).toBe(200);
  expect(health.headers()["x-content-type-options"]).toBe("nosniff");
  expect(health.headers()["x-frame-options"]).toBe("DENY");
  await expect.poll(async () => (await health.json()).meta.requestId).toBe("e2e-health");

  const malformed = await request.post("/api/incidents", {
    headers: { "content-type": "application/json" },
    data: Buffer.from("{"),
  });
  expect(malformed.status()).toBe(400);
  expect((await malformed.json()).error.code).toBe("INVALID_JSON");

  const oversized = await request.post("/api/incidents", {
    headers: { "content-type": "application/json" },
    data: "x".repeat(5_000),
  });
  expect(oversized.status()).toBe(413);

  await page.goto("/");
  await expect(page).toHaveTitle(/NEXUS-7/);
  await expect(page.getByRole("heading", { name: "指挥中心", exact: true })).toBeVisible();
  await expect(page.getByText("SYNTHETIC SYSTEM · NO REAL INFRASTRUCTURE")).toBeVisible();
});

test("creates, owns, resolves, and persists a synthetic incident", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /事件响应/ }).click();
  await page.getByRole("button", { name: "Create test incident" }).click();
  await page.getByRole("textbox", { name: "Incident title" }).fill("Edge authorization storm");
  await page.getByRole("textbox", { name: "Affected service" }).fill("Identity Edge");
  await page.getByRole("combobox", { name: "Severity" }).selectOption("SEV-1");
  await page.getByRole("button", { name: "Create incident" }).click();

  await expect(page.getByRole("heading", { name: "Edge authorization storm" })).toBeVisible();
  await page.getByRole("button", { name: "确认接管" }).click();
  await page.getByRole("button", { name: "验证并解决" }).click();
  await expect(page.getByText("Recovery verified", { exact: true })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: /事件响应/ }).click();
  await page.getByRole("button", { name: "All" }).click();
  await expect(page.getByText("Edge authorization storm", { exact: true }).first()).toBeVisible();
});

test("correlates deployment risk, navigates, and performs a reversible rollback simulation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /NEXUS/ }).first().click();
  await page.getByRole("button", { name: "Check deployment risk" }).click();
  await page.getByRole("button", { name: "分析" }).click();
  await expect(page.getByText("Release risk review ready")).toBeVisible();
  await page.getByRole("button", { name: "Inspect deployment" }).click();

  await expect(page.getByRole("heading", { name: "发布控制面" })).toBeVisible();
  await page.getByText("revenue-api", { exact: true }).first().click();
  await page.getByRole("button", { name: "模拟回滚" }).click();
  await page.getByRole("button", { name: "Confirm simulation" }).click();
  await expect(page.getByText("v4.9.7-rollback", { exact: true }).first()).toBeVisible();
});

test("persists preferences, validates imports, and exports audit evidence", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "系统设置" }).click();
  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("button", { name: "Light" }).click();
  await page.getByRole("button", { name: "Compact" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await page.locator('input[type="file"]').setInputFiles({
    name: "unsupported.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":99}'),
  });
  await expect(page.getByText("Unsupported snapshot schema")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Command center" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

  await page.getByRole("button", { name: "Audit center" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("nexus-seven-audit.csv");
});

test("closes mobile navigation after selection and remains accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const sidebar = page.locator(".sidebar");
  await expect(sidebar).toBeHidden();

  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(sidebar).toBeVisible();
  await expect(page.getByRole("button", { name: "Close navigation" })).toBeVisible();
  await page.getByRole("button", { name: "工作流" }).click();

  await expect(page.getByRole("heading", { name: "自动化编排" })).toBeVisible();
  await expect(sidebar).toBeHidden();
  await expect(page.getByRole("button", { name: "NEXUS 指挥助手" })).toBeVisible();
});

test("boots the production shell from service-worker cache with the server unreachable", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/NEXUS-7/);
  await expect(page.getByRole("heading", { name: "指挥中心" })).toBeVisible();
  await context.setOffline(false);
});
