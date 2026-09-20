import { getGoogleMapsApiKey } from "../config";

interface GoogleGeocodingResponse {
  results?: Array<{
    location?: {
      latitude?: number;
      longitude?: number;
    };
  }>;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
}

const GOOGLE_GEOCODING_BASE_URL =
  "https://geocode.googleapis.com/v4/geocode/address";

function isValidCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function geocodeLocation(
  location: string
): Promise<GeocodedLocation> {
  const normalizedLocation = location.trim();

  if (!normalizedLocation) {
    throw new Error("Location is required for geocoding.");
  }

  const apiKey = getGoogleMapsApiKey();
  const encodedLocation = encodeURIComponent(normalizedLocation);

  const response = await fetch(
    `${GOOGLE_GEOCODING_BASE_URL}/${encodedLocation}`,
    {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "results.location.latitude,results.location.longitude",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Google Geocoding API request failed with status ${response.status}.`
    );
  }

  const data = (await response.json()) as GoogleGeocodingResponse;
  const locationResult = data.results?.[0]?.location;

  if (
    !locationResult ||
    !isValidCoordinate(locationResult.latitude) ||
    !isValidCoordinate(locationResult.longitude)
  ) {
    throw new Error(
      `No geographic coordinates were found for "${normalizedLocation}".`
    );
  }

  return {
    latitude: locationResult.latitude,
    longitude: locationResult.longitude,
  };
}
