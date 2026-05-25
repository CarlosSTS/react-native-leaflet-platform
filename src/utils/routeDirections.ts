import { LatLng } from "../@types/map";
import { OSRMResponse } from "../@types/osrm";

const OSRM_BASE_URL =
  'http://router.project-osrm.org/route/v1/driving/';

const DEFAULT_PARAMS = {
  overview: 'full',
  geometries: 'geojson',
} as const;

const buildQueryString = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

const formatCoord = (point: LatLng) =>
  `${point.lng},${point.lat}`;

/**
 * Fetch raw route data from OSRM.
 * @param start - Starting coordinate
 * @param end - Destination coordinate
 * @returns Full OSRM response
 */
export const getOSRMRouteRaw = async (
  start: LatLng,
  end: LatLng,
): Promise<OSRMResponse> => {
  const coordinates = `${formatCoord(start)};${formatCoord(end)}`;

  const url =
    `${OSRM_BASE_URL}${coordinates}?` +
    buildQueryString(DEFAULT_PARAMS as Record<string, string>);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OSRM request failed (${response.status})`);
  }

  const data: OSRMResponse = await response.json();

  if (data.code !== 'Ok') {
    throw new Error(`OSRM error: ${data.code}`);
  }
  if(!data.routes.length) {
    throw new Error('No route found');
  }
  return data;
};