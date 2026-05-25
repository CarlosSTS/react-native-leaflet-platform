/**
 * Mean Earth radius in meters.
 * Used for distance calculation using the Haversine formula.
 */
const EARTH_RADIUS_M = 6371e3;

/**
 * Converts degrees to radians.
 *
 * @param value - Value in degrees
 * @returns Value converted to radians
 */
const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 *
 * This method accounts for Earth's curvature and provides accurate results for
 * distances between two latitude/longitude points.
 *
 * @param lat1 - Latitude of the first point (in degrees)
 * @param lon1 - Longitude of the first point (in degrees)
 * @param lat2 - Latitude of the second point (in degrees)
 * @param lon2 - Longitude of the second point (in degrees)
 *
 * @returns Distance between the two points in meters
 *
 * @example
 * ```ts
 * const distance = calculateDistance(
 *   -3.7327,
 *   -38.5267,
 *   -3.7172,
 *   -38.5434
 * );
 *
 * console.log(distance); // distance in meters
 * ```
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const sinΔφ = Math.sin(Δφ / 2);
  const sinΔλ = Math.sin(Δλ / 2);

  const a =
    sinΔφ * sinΔφ +
    Math.cos(φ1) * Math.cos(φ2) * (sinΔλ * sinΔλ);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_M * c;
};