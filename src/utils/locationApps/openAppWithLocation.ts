import { Linking, Platform } from 'react-native';

import { OpenAppWithLocationOptions } from '../../@types/locationApps';
import { nativeModules } from './nativeModule';

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
export const openAppWithLocation = async ({
  url,
  packageName,
}: OpenAppWithLocationOptions): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    await Linking.openURL(url);

    return true;
  }

  if (Platform.OS !== 'android') {
    return false;
  }

  return nativeModules.LeafletPlatform.openAppWithLocation({
    url,
    packageName,
  });
};
