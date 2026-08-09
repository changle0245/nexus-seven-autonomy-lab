import { apiSuccess } from "@/lib/api";
import { telemetry } from "@/lib/seed";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const totals = telemetry.reduce(
    (accumulator, point) => ({
      requests: accumulator.requests + point.requests,
      latency: accumulator.latency + point.latency,
      errors: accumulator.errors + point.errors,
    }),
    { requests: 0, latency: 0, errors: 0 },
  );

  return apiSuccess(request, {
    period: "24h",
    series: telemetry,
    summary: {
      requestIndex: totals.requests,
      averageLatencyMs: Math.round(totals.latency / telemetry.length),
      averageErrorRate: Number((totals.errors / telemetry.length).toFixed(2)),
    },
  });
}
