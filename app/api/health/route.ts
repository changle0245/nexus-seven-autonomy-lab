import { apiSuccess } from "@/lib/api";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return apiSuccess(request, {
    service: "nexus-seven",
    status: "operational",
    version: "0.1.0",
    checks: {
      web: "pass",
      api: "pass",
      syntheticData: "pass",
    },
  });
}
