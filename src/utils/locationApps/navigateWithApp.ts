import { NavigationUrlOptions } from '../../@types/locationApps';
import { buildNavigationUrl } from './buildNavigationUrl';
import { openAppWithLocation } from './openAppWithLocation';

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
