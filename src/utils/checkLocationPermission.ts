import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

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

  /** Request background location (Android only) */
  requestBackground?: boolean;
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
 * Request location permission on iOS.
 */
const requestLocationIOS = (): Promise<boolean> => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
    );
  });
};

/**
 * Checks and requests location permission across platforms.
 *
 * - Android: uses PermissionsAndroid
 * - iOS: triggers permission via geolocation
 * - Web: triggers browser permission
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

  if (Platform.OS === 'ios') {
    const granted = await requestLocationIOS();

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

  return false;
};