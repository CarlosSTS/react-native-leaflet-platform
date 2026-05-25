/**
 * GeoJSON LineString geometry.
 */
interface LineString {
  type: 'LineString';
  coordinates: Array<[number, number]>;
}

interface OSRMWaypoint {
  name: string;
  location: [number, number];
  distance: number;
}

interface OSRMLeg {
  steps: unknown[];
  weight: number;
  summary: string;
  duration: number;
  distance: number;
}

interface OSRMRoute {
  legs: OSRMLeg[];
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  geometry: LineString;
}

export interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
  waypoints: OSRMWaypoint[];
}