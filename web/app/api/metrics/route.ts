import { NextRequest, NextResponse } from "next/server";

import { recordOperationalMetric } from "@/lib/metrics";
import { isOperationalMetricName } from "@/lib/metrics";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 256;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expectedOrigin = request.nextUrl.origin;

  if (!origin || origin !== expectedOrigin) {
    return jsonError("Forbidden origin.", 403);
  }

  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    return jsonError("Unsupported content type.", 415);
  }

  let body: string;

  try {
    body = await request.text();
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return jsonError("Request body too large.", 413);
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return jsonError("Invalid JSON.", 400);
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return jsonError("Invalid metric payload.", 400);
  }

  const input = payload as Record<string, unknown>;

  if (
    Object.keys(input).length !== 1 ||
    !isOperationalMetricName(input.event)
  ) {
    return jsonError("Invalid metric event.", 400);
  }

  try {
    await recordOperationalMetric(input.event);

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Operational metric recording failed:", error);

    return jsonError("Metrics service unavailable.", 503);
  }
}