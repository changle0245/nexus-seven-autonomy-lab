export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
    generatedAt: string;
    synthetic: true;
  };
}

export function requestMeta(request: Request): ApiEnvelope<never>["meta"] {
  return {
    requestId: request.headers.get("x-request-id") ?? crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    synthetic: true,
  };
}

export function apiSuccess<T>(
  request: Request,
  data: T,
  init: ResponseInit = {},
): Response {
  const body: ApiEnvelope<T> = {
    ok: true,
    data,
    meta: requestMeta(request),
  };
  return Response.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      "X-Nexus-Synthetic": "true",
      ...init.headers,
    },
  });
}

export function apiError(
  request: Request,
  status: number,
  code: string,
  message: string,
): Response {
  const body: ApiEnvelope<never> = {
    ok: false,
    error: { code, message },
    meta: requestMeta(request),
  };
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Nexus-Synthetic": "true",
    },
  });
}

export async function readJsonBody(request: Request, maxBytes = 4_096): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("INVALID_JSON");
  }
}
