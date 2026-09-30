import { NativeModules, Platform } from 'react-native';

import { LatLng } from '../@types/map';

/** An installed app able to handle geographic locations. */
export type LocationApp = {
  /** Display name of the app, as shown in the launcher. */
  name: string;

  /** Android package name, used to target the app when opening a URL. */
  package: string;

  /** App icon as a PNG data URI. Only present when `includesBase64` is `true`. */
  icon?: string;
};

export type GetLocationAppsOptions = {
  /** Include the app icon as a PNG data URI. Defaults to `false`. */
  includesBase64?: boolean;
};

export type OpenAppWithLocationOptions = {
  /** The location URL to open, for example `geo:`, `waze://` or `google.navigation:`. */
  url: string;

  /** Package name of the app that should handle the URL. */
  packageName: string;
};

export type NavigationUrlOptions = {
  /** Target app, usually taken from `getLocationApps`. */
  packageName: string;

  /** Destination coordinate. */
  destination: LatLng;

  /** Label shown for the destination, when the target app supports it. */
  label?: string;

  /** Start turn-by-turn navigation instead of only showing the destination. Defaults to `true`. */
  navigate?: boolean;
};

/** Known package names, exported so callers can match apps without hardcoding strings. */
export const LOCATION_APP_PACKAGES = {
  GOOGLE_MAPS: 'com.google.android.apps.maps',
  WAZE: 'com.waze',
  UBER: 'com.ubercab',
} as const;

const nativeModules = NativeModules as {
  LeafletPlatform: {
    getLocationApps(options?: GetLocationAppsOptions): Promise<LocationApp[]>;
    openAppWithLocation(options: OpenAppWithLocationOptions): Promise<boolean>;
  };
};

const formatCoords = ({ lat, lng }: LatLng) => `${lat},${lng}`;

/**
 * Lists the installed apps able to handle geographic locations
 * (Google Maps, Waze, Uber, …).
 *
 * **Android only.** On any other platform it resolves to an empty array.
 *
 * @example
 * const apps = await getLocationApps({ includesBase64: true });
 * // [{ name: 'Waze', package: 'com.waze', icon: 'data:image/png;base64,…' }]
 */
export const getLocationApps = async (
  options: GetLocationAppsOptions = {},
): Promise<LocationApp[]> => {
  if (Platform.OS !== 'android') {
    return [];
  }

  return nativeModules.LeafletPlatform.getLocationApps(options);
};

/**
 * Opens an installed app on a given location URL.
 *
 * **Android only.** On any other platform it resolves to `false`.
 *
 * Rejects when the app is not installed or cannot handle the URL.
 *
 * @example
 * await openAppWithLocation({
 *   url: 'geo:-3.7327,-38.5267?q=-3.7327,-38.5267(Destination)',
 *   packageName: 'com.google.android.apps.maps',
 * });
 */
export const openAppWithLocation = async (
  options: OpenAppWithLocationOptions,
): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return false;
  }

  return nativeModules.LeafletPlatform.openAppWithLocation(options);
};

/**
 * Builds the navigation URL for a destination, using the scheme each app
 * understands. Falls back to the standard `geo:` scheme for unknown packages.
 *
 * @example
 * buildNavigationUrl({
 *   packageName: 'com.waze',
 *   destination: { lat: -3.7327, lng: -38.5267 },
 * });
 */
export const buildNavigationUrl = ({
  packageName,
  destination,
  label,
  navigate = true,
}: NavigationUrlOptions): string => {
  const coords = formatCoords(destination);

  if (packageName === LOCATION_APP_PACKAGES.WAZE) {
    return `waze://?ll=${coords}&navigate=${navigate ? 'yes' : 'no'}`;
  }

  if (packageName === LOCATION_APP_PACKAGES.UBER) {
    return (
      'uber://?action=setPickup&pickup=my_location' +
      `&dropoff[latitude]=${destination.lat}` +
      `&dropoff[longitude]=${destination.lng}` +
      (label ? `&dropoff[nickname]=${encodeURIComponent(label)}` : '')
    );
  }

  if (packageName === LOCATION_APP_PACKAGES.GOOGLE_MAPS && navigate) {
    return `google.navigation:q=${coords}`;
  }

  return `geo:${coords}?q=${coords}${label ? `(${encodeURIComponent(label)})` : ''}`;
};

/**
 * Convenience wrapper that builds the right URL for the app and opens it.
 *
 * **Android only.** On any other platform it resolves to `false`.
 *
 * @example
 * const [app] = await getLocationApps();
 * await navigateWithApp({
 *   packageName: app.package,
 *   destination: { lat: -3.7327, lng: -38.5267 },
 * });
 */
export const navigateWithApp = ({
  packageName,
  ...options
}: NavigationUrlOptions): Promise<boolean> =>
  openAppWithLocation({
    url: buildNavigationUrl({ packageName, ...options }),
    packageName,
  });
