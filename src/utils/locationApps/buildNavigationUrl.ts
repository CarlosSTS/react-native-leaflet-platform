import { LatLng } from '../../@types/map';
import { NavigationUrlOptions } from '../../@types/locationApps';
import { IOS_LOCATION_APP_SCHEMES, LOCATION_APP_PACKAGES } from './constants';

const formatCoords = ({ lat, lng }: LatLng) => `${lat},${lng}`;

const encodeLabel = (label: string) => encodeURIComponent(label);

const buildWazeUrl = ({ destination, navigate = true }: NavigationUrlOptions) =>
  `waze://?ll=${formatCoords(destination)}&navigate=${navigate ? 'yes' : 'no'}`;

const buildUberUrl = ({ destination, label }: NavigationUrlOptions) =>
  'uber://?action=setPickup&pickup=my_location' +
  `&dropoff[latitude]=${destination.lat}` +
  `&dropoff[longitude]=${destination.lng}` +
  (label ? `&dropoff[nickname]=${encodeLabel(label)}` : '');

const buildIOSNavigationUrl = ({
  scheme,
  ...options
}: NavigationUrlOptions & { scheme: string }): string => {
  const { destination, label, navigate = true } = options;
  const coords = formatCoords(destination);

  switch (scheme) {
    case IOS_LOCATION_APP_SCHEMES.APPLE_MAPS:
      return navigate
        ? `maps://?daddr=${coords}&dirflg=d`
        : `maps://?ll=${coords}&q=${encodeLabel(label ?? coords)}`;
    case IOS_LOCATION_APP_SCHEMES.GOOGLE_MAPS:
      return navigate
        ? `comgooglemaps://?daddr=${coords}&directionsmode=driving`
        : `comgooglemaps://?q=${coords}&center=${coords}`;
    case IOS_LOCATION_APP_SCHEMES.WAZE:
      return buildWazeUrl(options);
    case IOS_LOCATION_APP_SCHEMES.UBER:
      return buildUberUrl(options);
    case IOS_LOCATION_APP_SCHEMES.LYFT:
      return (
        'lyft://ridetype?id=lyft' +
        `&destination[latitude]=${destination.lat}` +
        `&destination[longitude]=${destination.lng}`
      );
    case IOS_LOCATION_APP_SCHEMES.CITYMAPPER:
      return (
        `citymapper://directions?endcoord=${coords}` +
        (label ? `&endname=${encodeLabel(label)}` : '')
      );
    case IOS_LOCATION_APP_SCHEMES.MOOVIT:
      return (
        `moovit://directions?dest_lat=${destination.lat}&dest_lon=${destination.lng}` +
        (label ? `&dest_name=${encodeLabel(label)}` : '')
      );
    default:
      return `${scheme}://`;
  }
};

/**
 * Builds the navigation URL for a destination, using the scheme each app
 * understands. When `scheme` is set (iOS), unknown schemes fall back to
 * `<scheme>://`, which only opens the app. Otherwise (Android), unknown
 * packages fall back to the standard `geo:` scheme.
 *
 * @example
 * buildNavigationUrl({
 *   packageName: 'com.waze',
 *   destination: { lat: -3.7327, lng: -38.5267 },
 * });
 */
export const buildNavigationUrl = ({
  packageName,
  scheme,
  ...options
}: NavigationUrlOptions): string => {
  if (scheme) {
    return buildIOSNavigationUrl({ scheme, ...options });
  }

  const { destination, label, navigate = true } = options;
  const coords = formatCoords(destination);

  if (packageName === LOCATION_APP_PACKAGES.WAZE) {
    return buildWazeUrl(options);
  }

  if (packageName === LOCATION_APP_PACKAGES.UBER) {
    return buildUberUrl(options);
  }

  if (packageName === LOCATION_APP_PACKAGES.GOOGLE_MAPS && navigate) {
    return `google.navigation:q=${coords}`;
  }

  return `geo:${coords}?q=${coords}${label ? `(${encodeLabel(label)})` : ''}`;
};
