# react-native-leaflet-platform

## Platform Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://res.cloudinary.com/dbw8igay3/image/upload/ios_s7wm58.png" alt="iOS Screenshot" width="350" />
    </td>
    <td align="center">
      <img src="https://res.cloudinary.com/dbw8igay3/image/upload/android_bdwkku.png" alt="Android Screenshot" width="440" />
    </td>
     <td align="center">
      <img src="https://res.cloudinary.com/dbw8igay3/image/upload/5628890f-65e7-4888-9ea1-9ad9a6d84fd8.png" alt="Web Screenshot" width="1340" />
    </td>
  </tr>
</table>

A React Native library for interactive maps using Leaflet, compatible with **Android**, **iOS**, **Web**, and **Expo**.

> Based on [react-native-leaflet](https://github.com/pavel-corsaghin/react-native-leaflet).

## Installation

```sh
npm install @carlossts/react-native-leaflet-platform
# or
yarn add @carlossts/react-native-leaflet-platform
```

### Additional dependencies

- **Android/iOS (React Native CLI):**
  - [`react-native-webview`](https://github.com/react-native-webview/react-native-webview)

```sh
npm install --save react-native-webview
# or
yarn add react-native-webview
```

> Tested with `react-native-webview@14.0.1`.

- **Expo:**

  ```sh
  npx expo install react-native-webview expo-asset expo-file-system
  ```

  Copy the HTML asset:

  ```sh
  cp node_modules/@carlossts/react-native-leaflet-platform/android/src/main/assets/leaflet.html assets
  ```

- **Web (Expo Web or React Native Web):**
  - [`react-native-web`](https://github.com/nicolecarlosleahy/react-native-web)

  Add to your `package.json` scripts and run:

  ```json
  {
    "scripts": {
      "copy-leaflet-html-web": "sh node_modules/@carlossts/react-native-leaflet-platform/scripts/copy-leaflet-html.sh"
    }
  }
  ```

  ```sh
  npm run copy-leaflet-html-web
  ```

  This copies `leaflet.html` to your project's `public/` directory.

## Examples

Usage examples for each platform are available in the [`example/`](example/) folder:

| Platform           | Example                                                        |
| ------------------ | -------------------------------------------------------------- |
| React Native CLI   | [`example/react-native/App.tsx`](example/react-native/App.tsx) |
| Expo (Android/iOS) | [`example/expo/App.tsx`](example/expo/App.tsx)                 |
| Expo + Web         | [`example/expo-web/App.tsx`](example/expo-web/App.tsx)         |

### Running the React Native CLI example

```sh
# 1. Install root dependencies
yarn install

# 2. Navigate to the example project
cd example/reactNativeLeafletPlatformExample

# 3. Install example dependencies
yarn install

# 4. Run on Android
yarn android

# 5. Or run on iOS (macOS only)
cd ios && pod install && cd ..
yarn ios
```

### Running the Web example

```sh
# 1. Install root dependencies
yarn install

# 2. Navigate to the example project
cd example/reactNativeLeafletPlatformExample

# 3. Install example dependencies
yarn install

# 4. Copy leaflet.html to the public/ directory
yarn copy-leaflet-html-web

# 5. Start the web dev server
yarn web
```

> The `copy-leaflet-html-web` script creates the `public/` folder (if it doesn't exist) and copies the `leaflet.html` file required for the map to render via `<iframe>` on the web.

> The example project imports the library directly from the source (`../../src`) via Metro and Babel aliases, so any changes to the library code are reflected immediately.


### Full example
> https://github.com/CarlosSTS/react-native-leaflet-platform-demo

## Supported Platforms

| Platform         | Support | Min Version                                           |
| ---------------- | ------- | ----------------------------------------------------- |
| Android          | ✅      | API 24 (Android 7.0)                                  |
| iOS              | ✅      | iOS 13.0                                              |
| Web              | ✅      | Modern browsers (Chrome 80+, Firefox 75+, Safari 13+) |
| Expo (managed)   | ✅      | SDK 50+                                               |
| Expo (bare)      | ✅      | SDK 50+                                               |
| React Native CLI | ✅      | RN 0.72+                                              |

## Requirements

| Dependency           | Min Version | Notes                                           |
| -------------------- | ----------- | ----------------------------------------------- |
| React                | 18.0.0      | Peer dependency                                 |
| React Native         | 0.72.0      | Peer dependency                                 |
| react-native-webview | 13.0.0      | Required for Android/iOS; optional for web-only |
| react-native-web     | 0.19.0      | Required for web; optional for native-only      |
| Node.js              | 22.11.0+    | Build/dev only                                  |

> **iOS note:** Apple does not allow alternative browser engines on iOS. The map runs inside a native `WKWebView` via `react-native-webview`. There is no pure web/CSS fallback on iOS — behavior depends on the WebKit engine bundled with the OS version.

## Location permissions (optional)

Location support is limited to **Android** and **Web**. iOS is not supported by this package's location helper — see [`checkLocationPermission`](#checklocationpermission).

### Android

Add to your AndroidManifest.xml:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

If you need background location (API 29+), also add:

```xml
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

### Web

No manifest setup is needed. The browser prompts for permission on the first request, and the page must be served over HTTPS (or `localhost`).

### Expo (managed)

Add permissions in app.json/app.config.js so they are applied on build:

```json
{
  "expo": {
    "android": {
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    }
  }
}
```

## Utilities

These helpers are exported from the package and can be used independently.

### `calculateDistance`

Calculates the distance between two coordinates using the Haversine formula.

```ts
import { calculateDistance } from "@carlossts/react-native-leaflet-platform";

const distanceMeters = calculateDistance(-3.7327, -38.5267, -3.7172, -38.5434);
```

### `checkLocationPermission`

Checks and requests location permission on **Android** and **Web** only.

> iOS is not supported: the native permission flow cannot be triggered by this API. On iOS (and any other platform) the function always resolves to `false`.

Options:

- `showAlert` (boolean): show alert when denied (default: true)
- `title` (string): custom alert title
- `message` (string): custom alert message
- `confirmText` (string): confirm button label
- `onConfirmPress` (function): callback when user confirms
- `requestBackground` (boolean): request background location on Android (API 29+)

```ts
import { checkLocationPermission } from "@carlossts/react-native-leaflet-platform";

const granted = await checkLocationPermission({
  requestBackground: true,
  title: "Permission required",
  message: "Enable location access to show your position on the map.",
});
```

### Location apps (`getLocationApps` / `navigateWithApp`)

Lists the navigation apps installed on the device (Google Maps, Waze, Uber, …) so you can show them next to a marker and hand the route over to the user's app of choice.

> **Android only.** iOS has no public API to enumerate installed apps, and the browser has no equivalent. On any other platform these functions resolve to `[]` / `false` instead of throwing, so you can call them unconditionally.

No manifest setup is required. Android 11+ (API 30) package visibility hides other apps unless they are declared, so this library ships the matching `<queries>` block and the manifest merger adds it to your app:

```xml
<queries>
  <intent>
    <action android:name="android.intent.action.VIEW" />
    <data android:scheme="geo" />
  </intent>
</queries>
```

It only makes apps that handle `geo:` visible — it is not the `QUERY_ALL_PACKAGES` permission and needs no Play Store declaration. If your app does not use these functions and you want it out of the merged manifest, override it with `tools:node="remove"`.

Also note that unknown packages fall back to `geo:`, which opens the app on the destination but does not start turn-by-turn navigation.

#### `getLocationApps(options?)`

- `includesBase64` (boolean): include the app icon as a PNG data URI (default: false)

Resolves to `{ name, package, icon? }[]`.

#### `buildNavigationUrl({ packageName, destination, label?, navigate? })`

Builds the URL scheme the target app understands (`waze://`, `google.navigation:`, `uber://`), falling back to the standard `geo:` scheme for unknown packages.

- `packageName` (string): target app, usually taken from `getLocationApps`
- `destination` (`{ lat, lng }`): where to go
- `label` (string): destination name, when the app supports it
- `navigate` (boolean): start turn-by-turn navigation instead of only showing the point (default: true)

#### `openAppWithLocation({ url, packageName })`

Opens an already-built URL in a specific app. Rejects if the app is not installed or does not handle the URL.

#### `navigateWithApp({ packageName, destination, label?, navigate? })`

`buildNavigationUrl` + `openAppWithLocation` in one call.

```tsx
import {
  getLocationApps,
  navigateWithApp,
  type LocationApp,
} from "@carlossts/react-native-leaflet-platform";

const destination = { lat: -3.7327, lng: -38.5267 };

const apps: LocationApp[] = await getLocationApps({ includesBase64: true });

// Render one button per app, then:
await navigateWithApp({
  packageName: apps[0].package,
  destination,
  label: "Destination",
});
```

### `getOSRMRouteRaw`

Fetches raw route data from the public OSRM service.

```ts
import { getOSRMRouteRaw } from "@carlossts/react-native-leaflet-platform";

const route = await getOSRMRouteRaw(
  { lat: -3.7327, lng: -38.5267 },
  { lat: -3.7172, lng: -38.5434 },
);
```

## Props

| Property            | Required | Type                         | Purpose                                                           |
| ------------------- | -------- | ---------------------------- | ----------------------------------------------------------------- |
| onMessageReceived   | optional | function                     | Receives messages as `WebviewLeafletMessage` objects from the map |
| mapLayers           | optional | `MapLayer[]`                 | An array of map layers                                            |
| mapMarkers          | optional | `MapMarker[]`                | An array of map markers                                           |
| mapShapes           | optional | `MapShape[]`                 | An array of map shapes                                            |
| mapCenterPosition   | optional | `{lat: number, lng: number}` | The center position of the map                                    |
| ownPositionMarker   | optional | `OwnPositionMarker`          | A special marker with ID `OWN_POSITION_MARKER_ID`                 |
| zoom                | optional | `number`                     | Desired zoom value of the map (1–19)                              |
| doDebug             | optional | `boolean`                    | Flag for debug message logging                                    |
| source              | optional | `WebView["source"]`          | Loads static HTML or a URI in the WebView                         |
| zoomControl         | optional | `boolean`                    | Controls visibility of the zoom controls on the map               |
| attributionControl  | optional | `boolean`                    | Controls visibility of the attribution control on the map         |
| useMarkerClustering | optional | `boolean`                    | Enables or disables marker clustering. Default: `true`            |
| zoomControlStyle    | optional | `string`                     | Custom CSS style string applied to the zoom control container     |
| zoomInStyle         | optional | `string`                     | Custom CSS style string applied to the zoom-in button             |
| zoomOutStyle        | optional | `string`                     | Custom CSS style string applied to the zoom-out button            |

## Common Issues

### iOS WebView timeout / map not loading

In some iOS setups, `react-native-webview` can fail during navigation event serialization and the map may appear stuck (timeout behavior while the WebView keeps loading).

If this happens in your app (not only in the example), run the patch script provided by this library:

```json
{
  "scripts": {
    "patch-webview-ios": "sh node_modules/@carlossts/react-native-leaflet-platform/scripts/patch-react-native-webview-ios.sh"
  }
}
```

Then execute:

```sh
npm run patch-webview-ios
cd ios && pod install
```

If you use Yarn:

```sh
yarn patch-webview-ios
cd ios && pod install
```

This workaround is validated with `react-native-webview@13.16.1`.

## Credits

This library is built on top of [react-native-leaflet](https://github.com/pavel-corsaghin/react-native-leaflet) by [@pavel-corsaghin](https://github.com/pavel-corsaghin), which itself is inspired by the original [react-native-leaflet](https://github.com/reggie3/react-native-webview-leaflet) by [@reggie3](https://github.com/reggie3).

Key differences from the base library:

- Added **Web platform** support via `<iframe>` (React Native Web / Expo Web)
- Full **TypeScript** support with updated type definitions
- Compatible with **Expo managed workflow** (SDK 50+)
- Uses platform-specific file resolution (`.native.tsx` / `.web.tsx`)

Map rendering is powered by [Leaflet.js](https://leafletjs.com/).

## License

MIT
