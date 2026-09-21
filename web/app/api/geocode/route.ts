import { NextResponse } from "next/server";
import { geocodeLocation } from "@/lib/external";

interface GeocodeRequest {
  location?: unknown;
}

function isValidLocation(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeocodeRequest;

    if (!isValidLocation(body.location)) {
      return NextResponse.json(
        { error: "Location is required." },
        { status: 400 }
      );
    }

    const result = await geocodeLocation(body.location);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Geocoding failed:", error);

    return NextResponse.json(
      { error: "Unable to geocode location." },
      { status: 500 }
    );
  }
}
