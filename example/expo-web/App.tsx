import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { LeafletView, LoadingIndicator } from '@carlossts/react-native-leaflet-platform';

/**
 * Expo with Web support example.
 *
 * Prerequisites:
 *   npx expo install react-native-webview expo-asset expo-file-system react-dom react-native-web
 *
 * For native (Android/iOS):
 *   cp node_modules/@carlossts/react-native-leaflet-platform/android/app/src/main/assets/leaflet.html assets
 *
 * For web:
 *   sh node_modules/@carlossts/react-native-leaflet-platform/scripts/copy-leaflet-html.sh
 *   (this copies leaflet.html to the public/ folder)
 */

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388,
};

const App: React.FC = () => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb) return;

    let isMounted = true;

    const loadHtml = async () => {
      try {
        const { Asset } = await import('expo-asset');
        const { File } = await import('expo-file-system');

        const path = require('./assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await new File(asset.localUri!).text();

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, [isWeb]);

  if (!isWeb && !webViewContent) {
    return (
      <LoadingIndicator />
    );
  }

  return (
      <LeafletView
        {...(!isWeb && webViewContent
          ? { source: { html: webViewContent } }
          : {})}
        mapCenterPosition={{
          lat: DEFAULT_LOCATION.latitude,
          lng: DEFAULT_LOCATION.longitude,
        }}
      />
  );
};

export default App;
