import { LatLng } from './map';

/** An installed app able to handle geographic locations. */
export type LocationApp = {
  /** Display name of the app, as shown in the launcher. */
  name: string;

  /** Android package name, used to target the app when opening a URL. */
  package?: string;

  scheme?: string;

  /** App icon as a PNG data URI. Only present when `includesBase64` is `true`. */
  icon?: string;
};

export type IOSLocationApp = {
  name: string;

  scheme: string;
};

export type GetLocationAppsOptions = {
  /** Include the app icon as a PNG data URI. Defaults to `false`. */
  includesBase64?: boolean;

  iosApps?: readonly IOSLocationApp[];
};

export type OpenAppWithLocationOptions = {
  /** The location URL to open, for example `geo:`, `waze://` or `google.navigation:`. */
  url: string;

  /** Package name of the app that should handle the URL. */
  packageName?: string;
};

export type NavigationUrlOptions = {
  /** Target app, usually taken from `getLocationApps`. */
  packageName?: string;

  scheme?: string;

  /** Destination coordinate. */
  destination: LatLng;

  /** Label shown for the destination, when the target app supports it. */
  label?: string;

  /** Start turn-by-turn navigation instead of only showing the destination. Defaults to `true`. */
  navigate?: boolean;
};
