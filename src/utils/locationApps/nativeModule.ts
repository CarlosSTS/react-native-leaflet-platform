import { NativeModules } from 'react-native';

import {
  GetLocationAppsOptions,
  LocationApp,
  OpenAppWithLocationOptions,
} from '../../@types/locationApps';

export const nativeModules = NativeModules as {
  LeafletPlatform: {
    getLocationApps(options?: GetLocationAppsOptions): Promise<LocationApp[]>;
    openAppWithLocation(options: OpenAppWithLocationOptions): Promise<boolean>;
  };
};
