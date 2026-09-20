import { NextResponse } from "next/server";

import { calculateRoadDistance } from "@/lib/external";

interface DistanceRequest {
  origin?: unknown;
  destination?: unknown;
}

function isValidLocation(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DistanceRequest;

    if (!isValidLocation(body.origin)) {
      return NextResponse.json(
        { error: "Origin is required." },
        { status: 400 }
      );
    }

    if (!isValidLocation(body.destination)) {
      return NextResponse.json(
        { error: "Destination is required." },
        { status: 400 }
      );
    }

    const result = await calculateRoadDistance(body.origin, body.destination);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Road distance calculation failed:", error);

    return NextResponse.json(
      { error: "Unable to calculate road distance." },
      { status: 500 }
    );
  }
}
