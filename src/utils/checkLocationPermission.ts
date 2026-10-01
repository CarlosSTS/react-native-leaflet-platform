import {
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

type PermissionOptions = {
  /** Show alert when permission is denied */
  showAlert?: boolean;

  /** Custom alert title */
  title?: string;

  /** Custom alert message */
  message?: string;

  /** Confirm button label */
  confirmText?: string;

  /** Callback when user presses confirm */
  onConfirmPress?: () => void;

  /** Request background location (Android API 29+ and iOS "Always") */
  requestBackground?: boolean;
};

/** Authorization status resolved by the iOS native module. */
type IOSLocationStatus = 'granted' | 'always' | 'denied' | 'restricted' | 'disabled';

const nativeModules = NativeModules as {
  LeafletPlatform?: {
    requestLocationPermission(options: {
      requestBackground: boolean;
    }): Promise<IOSLocationStatus>;
  };
};

/**
 * Opens app/browser settings when possible.
 */
const openSettings = () => {
  if (Linking.openSettings) {
    Linking.openSettings();
  }
};

/**
 * Default alert (can be customized via options).
 */
const showPermissionAlert = ({
  title = 'Permission required',
  message = 'Please enable location access in settings.',
  confirmText = 'Open settings',
  onConfirmPress,
}: PermissionOptions) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);

    if (confirmed) {
      onConfirmPress?.();
    }

    return;
  }

  Alert.alert(title, message, [
    {
      text: confirmText,
      onPress: onConfirmPress ?? openSettings,
    },
  ]);
};

/**
 * Request location permission on Web.
 */
const requestLocationWeb = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
    );
  });
};

/**
 * Request location permission on iOS through CLLocationManager.
 */
const requestLocationIOS = async (requestBackground: boolean): Promise<boolean> => {
  const nativeModule = nativeModules.LeafletPlatform;

  if (!nativeModule?.requestLocationPermission) {
    console.warn(
      '[react-native-leaflet-platform] Native module not linked. Run `pod install` and rebuild the app.',
    );
    return false;
  }

  const status = await nativeModule.requestLocationPermission({ requestBackground });

  return requestBackground ? status === 'always' : status === 'granted' || status === 'always';
};

/**
 * Checks and requests location permission.
 *
 * Supported platforms:
 * - Android: uses PermissionsAndroid
 * - iOS: uses CLLocationManager (requires `NSLocationWhenInUseUsageDescription` in Info.plist)
 * - Web: triggers browser permission
 *
 * Any other platform returns `false`.
 */
export const checkLocationPermission = async (
  options: PermissionOptions = {},
): Promise<boolean> => {
  const {
    showAlert = true,
    requestBackground = false,
  } = options;

  if (Platform.OS === 'web') {
    const granted = await requestLocationWeb();

    if (!granted && showAlert) {
      showPermissionAlert(options);
    }

    return granted;
  }

  if (Platform.OS === 'android') {
    const fineGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (fineGranted !== PermissionsAndroid.RESULTS.GRANTED) {
      if (showAlert) {
        showPermissionAlert(options);
      }
      return false;
    }

    if (requestBackground && Platform.Version >= 29) {
      const bgGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      if (bgGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        if (showAlert) {
          showPermissionAlert(options);
        }
        return false;
      }
    }

    return true;
  }

  if (Platform.OS === 'ios') {
    const granted = await requestLocationIOS(requestBackground);

    if (!granted && showAlert) {
      showPermissionAlert(options);
    }

    return granted;
  }

  return false;
};
