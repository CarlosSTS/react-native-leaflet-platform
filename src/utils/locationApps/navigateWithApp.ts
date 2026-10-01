import { NavigationUrlOptions } from '../../@types/locationApps';
import { buildNavigationUrl } from './buildNavigationUrl';
import { openAppWithLocation } from './openAppWithLocation';

/**
 * Convenience wrapper that builds the right URL for the app and opens it.
 *
 * On any platform other than Android and iOS it resolves to `false`.
 *
 * @example
 * const [app] = await getLocationApps();
 * await navigateWithApp({
 *   packageName: app.package,
 *   scheme: app.scheme,
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
