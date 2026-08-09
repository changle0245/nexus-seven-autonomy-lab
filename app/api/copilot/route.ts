import { apiError, apiSuccess, readJsonBody } from "@/lib/api";
import { analyzePrompt } from "@/lib/copilot";

export const dynamic = "force-dynamic";

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

  const prompt =
    body && typeof body === "object" && "prompt" in body
      ? (body as { prompt?: unknown }).prompt
      : null;

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return apiError(request, 422, "VALIDATION_ERROR", "A non-empty prompt is required.");
  }

  return apiSuccess(request, analyzePrompt(prompt, new Date().toISOString()));
}
