import { IOSLocationApp } from '../../@types/locationApps';

/** Known package names, exported so callers can match apps without hardcoding strings. */
export const LOCATION_APP_PACKAGES = {
  GOOGLE_MAPS: 'com.google.android.apps.maps',
  WAZE: 'com.waze',
  UBER: 'com.ubercab',
} as const;

/** Known iOS URL schemes, exported so callers can match apps without hardcoding strings. */
export const IOS_LOCATION_APP_SCHEMES = {
  APPLE_MAPS: 'maps',
  GOOGLE_MAPS: 'comgooglemaps',
  WAZE: 'waze',
  UBER: 'uber',
  TAXIS_99: 'taxis99',
  CABIFY: 'cabify',
  LYFT: 'lyft',
  CITYMAPPER: 'citymapper',
  MOOVIT: 'moovit',
} as const;

/** Apps checked by `getLocationApps` on iOS by default. */
export const IOS_LOCATION_APPS: readonly IOSLocationApp[] = [
  { name: 'Apple Maps', scheme: IOS_LOCATION_APP_SCHEMES.APPLE_MAPS },
  { name: 'Google Maps', scheme: IOS_LOCATION_APP_SCHEMES.GOOGLE_MAPS },
  { name: 'Waze', scheme: IOS_LOCATION_APP_SCHEMES.WAZE },
  { name: 'Uber', scheme: IOS_LOCATION_APP_SCHEMES.UBER },
  { name: '99', scheme: IOS_LOCATION_APP_SCHEMES.TAXIS_99 },
  { name: 'Cabify', scheme: IOS_LOCATION_APP_SCHEMES.CABIFY },
  { name: 'Lyft', scheme: IOS_LOCATION_APP_SCHEMES.LYFT },
  { name: 'Citymapper', scheme: IOS_LOCATION_APP_SCHEMES.CITYMAPPER },
  { name: 'Moovit', scheme: IOS_LOCATION_APP_SCHEMES.MOOVIT },
];
