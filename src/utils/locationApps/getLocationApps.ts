import { Linking, Platform } from 'react-native';

import {
  GetLocationAppsOptions,
  IOSLocationApp,
  LocationApp,
} from '../../@types/locationApps';
import { IOS_LOCATION_APPS } from './constants';
import { nativeModules } from './nativeModule';

const isInstalled = ({ scheme }: IOSLocationApp) =>
  Linking.canOpenURL(`${scheme}://`).catch(() => false);

const getIOSLocationApps = async ({
  apps,
}: {
  apps: readonly IOSLocationApp[];
}): Promise<LocationApp[]> => {
  const installed = await Promise.all(apps.map(isInstalled));

  return apps.filter((_, index) => installed[index]);
};

/**
 * Lists the installed apps able to handle geographic locations
 * (Google Maps, Waze, Uber, …).
 *
 * On Android it queries the apps that handle `geo:` URLs. On iOS, which has
 * no API to list installed apps, it checks `iosApps` with
 * `Linking.canOpenURL`, so their schemes must be declared in
 * `LSApplicationQueriesSchemes`. On any other platform it resolves to an
 * empty array.
 *
 * @example
 * const apps = await getLocationApps({ includesBase64: true });
 * // Android: [{ name: 'Waze', package: 'com.waze', icon: 'data:image/png;base64,…' }]
 * // iOS: [{ name: 'Waze', scheme: 'waze' }]
 */
export const getLocationApps = async ({
  includesBase64 = false,
  iosApps = IOS_LOCATION_APPS,
}: GetLocationAppsOptions = {}): Promise<LocationApp[]> => {
  if (Platform.OS === 'ios') {
    return getIOSLocationApps({ apps: iosApps });
  }

  if (Platform.OS !== 'android') {
    return [];
  }

  return nativeModules.LeafletPlatform.getLocationApps({ includesBase64 });
};
