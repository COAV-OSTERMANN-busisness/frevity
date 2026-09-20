import { getGoogleMapsApiKey } from "../config";
import {
  geocodeLocation,
  type GeocodedLocation,
} from "../geocoding/geocodeLocation";

interface GoogleRoutesResponse {
  routes?: Array<{
    distanceMeters?: number;
  }>;
}

export interface RoadDistanceResult {
  distanceKm: number;
  origin: GeocodedLocation;
  destination: GeocodedLocation;
}

const GOOGLE_ROUTES_URL =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

function isValidDistance(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export async function calculateRoadDistance(
  origin: string,
  destination: string
): Promise<RoadDistanceResult> {
  const normalizedOrigin = origin.trim();
  const normalizedDestination = destination.trim();

  if (!normalizedOrigin) {
    throw new Error("Origin is required.");
  }

  if (!normalizedDestination) {
    throw new Error("Destination is required.");
  }

  const [originCoordinates, destinationCoordinates] = await Promise.all([
    geocodeLocation(normalizedOrigin),
    geocodeLocation(normalizedDestination),
  ]);

  const apiKey = getGoogleMapsApiKey();

  const response = await fetch(GOOGLE_ROUTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters",
    },
    body: JSON.stringify({
      origin: {
        location: {
          latLng: originCoordinates,
        },
      },
      destination: {
        location: {
          latLng: destinationCoordinates,
        },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_UNAWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false,
      },
      units: "METRIC",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Google Routes API request failed with status ${response.status}.`
    );
  }

  const data = (await response.json()) as GoogleRoutesResponse;
  const distanceMeters = data.routes?.[0]?.distanceMeters;

  if (!isValidDistance(distanceMeters)) {
    throw new Error(
      `No road route was found between "${normalizedOrigin}" and "${normalizedDestination}".`
    );
  }

  return {
    distanceKm: distanceMeters / 1000,
    origin: originCoordinates,
    destination: destinationCoordinates,
  };
}
