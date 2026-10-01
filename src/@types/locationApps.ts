import { LatLng } from './map';

/** An installed app able to handle geographic locations. */
export type LocationApp = {
  /** Display name of the app, as shown in the launcher. */
  name: string;

  /** Android package name, used to target the app when opening a URL. Android only. */
  package?: string;

  /** URL scheme of the app, used to build the navigation URL. iOS only. */
  scheme?: string;

  /** App icon as a PNG data URI. Only present on Android when `includesBase64` is `true`. */
  icon?: string;
};

/** An app checked by `getLocationApps` on iOS. */
export type IOSLocationApp = {
  /** Display name of the app. */
  name: string;

  /** URL scheme of the app, without `://`. Must be declared in `LSApplicationQueriesSchemes`. */
  scheme: string;
};

export type GetLocationAppsOptions = {
  /** Include the app icon as a PNG data URI. Defaults to `false`. Android only. */
  includesBase64?: boolean;

  /** Apps to check on iOS. Defaults to `IOS_LOCATION_APPS`. */
  iosApps?: readonly IOSLocationApp[];
};

export type OpenAppWithLocationOptions = {
  /** The location URL to open, for example `geo:`, `waze://` or `google.navigation:`. */
  url: string;

  /** Package name of the app that should handle the URL. Required on Android, ignored on iOS. */
  packageName?: string;
};

export type NavigationUrlOptions = {
  /** Target app on Android, usually taken from `getLocationApps`. */
  packageName?: string;

  /** Target app on iOS, usually taken from `getLocationApps`. Takes precedence over `packageName`. */
  scheme?: string;

  /** Destination coordinate. */
  destination: LatLng;

  /** Label shown for the destination, when the target app supports it. */
  label?: string;

  /** Start turn-by-turn navigation instead of only showing the destination. Defaults to `true`. */
  navigate?: boolean;
};
