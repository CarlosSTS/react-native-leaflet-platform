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

- **Expo:**

  ```sh
  npx expo install react-native-webview expo-asset expo-file-system
  ```

  Copy the HTML asset:

  ```sh
  cp node_modules/@carlossts/react-native-leaflet-platform/android/app/src/main/assets/leaflet.html assets
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
