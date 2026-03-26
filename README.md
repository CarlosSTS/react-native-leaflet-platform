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

Add to your React Native project:

```sh
npm install @carlossts/react-native-leaflet-platform
# or
yarn add @carlossts/react-native-leaflet-platform
```

### Web HTML Asset Setup

To use this library on **Web** (either with Expo Web or React Native Web), you must run the following script after installing dependencies:

```sh
npm run copy-leaflet-html-web
# or
yarn copy-leaflet-html-web
```

This will copy the required `leaflet.html` file to the correct location for your web build. This step is necessary to avoid file duplication and to keep the library bundle size small. Always run this script after installing or updating the library.

### Additional dependencies

- **Android/iOS:**
  - `react-native-webview`
  - Follow React Native linking instructions for each platform
    > - [react-native-webview](https://github.com/react-native-webview/react-native-webview)

- **Web:**
  - `react-native-web`
  - `webpack` or another bundler

## Expo Support

For Expo projects, you must install the following dependencies:

```sh
npx expo install react-native-webview expo-asset expo-file-system
```

> - [react-native-webview](https://docs.expo.dev/versions/latest/sdk/webview/)
> - [expo-asset](https://docs.expo.dev/versions/latest/sdk/asset/)
> - [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)

You must also copy the required HTML file:

```sh
cp node_modules/react-native-leaflet-platform/android/src/main/assets/leaflet.html assets
```

## Usage with react-native-cli

```js
import React from 'react';
import { LeafletView } from 'react-native-leaflet-view';

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388
}
const App: React.FC = () => {

  return (
    <LeafletView
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}
    />
  );
}

export default App;
```

## Usage with Expo

```js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Asset } from "expo-asset";
import { File } from 'expo-file-system';
import { LatLng, LeafletView } from 'react-native-leaflet-view';

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388
}
const App: React.FC = () => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require("./assets/leaflet.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await new File(asset.localUri!).text();

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        Alert.alert('Error loading HTML', JSON.stringify(error));
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!webViewContent) {
    return <ActivityIndicator size="large" />
  }
  return (
    <LeafletView
      source={{ html: webViewContent }}
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}
    />
  );
}

export default App;
```

## Supported Platforms

- [x] Android
- [x] iOS
- [x] Web
- [x] Expo

## Props

| Property            | Required | Type                       | Purpose                                                                 |
| ------------------- | -------- | -------------------------- | ----------------------------------------------------------------------- |
| loadingIndicator    | optional | React.ReactElement         | Custom component displayed while the map is loading                     |
| onError             | optional | function                   | Receives an error event                                                 |
| onLoadEnd           | optional | function                   | Called when map stops loading                                           |
| onLoadStart         | optional | function                   | Called when the map starts to load                                      |
| onMessageReceived   | optional | function                   | Receives messages as WebviewLeafletMessage objects from the map         |
| mapLayers           | optional | MapLayer array             | An array of map layers                                                  |
| mapMarkers          | optional | MapMarker array            | An array of map markers                                                 |
| mapShapes           | optional | MapShape[]                 | An array of map shapes                                                  |
| mapCenterPosition   | optional | {lat: number, lng: number} | The center position of the map                                          |
| ownPositionMarker   | optional | Marker                     | A special marker with ID OWN_POSITION_MARKER_ID                         |
| zoom                | optional | number                     | Desired zoom value of the map. Max is 19. Min is 1.                     |
| doDebug             | optional | boolean                    | Flag for debug message logging                                          |
| source              | optional | WebView["source"]          | Loads static html or a uri (with optional headers) in the WebView       |
| zoomControl         | optional | boolean                    | Controls the visibility of the zoom controls on the map                 |
| attributionControl  | optional | boolean                    | Controls the visibility of the attribution control on the map           |
| useMarkerClustering | optional | boolean                    | Enables or disables marker clustering functionality. Default is `true`. |

## Credits

- Based on [react-native-leaflet](https://github.com/pavel-corsaghin/react-native-leaflet)
- Uses [Leaflet](https://leafletjs.com/) for map rendering

## License

MIT
