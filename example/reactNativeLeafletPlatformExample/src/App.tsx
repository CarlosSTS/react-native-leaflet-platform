import React from 'react';
import { LeafletView } from '@carlossts/react-native-leaflet-platform';

const DEFAULT_LOCATION = {
  latitude: -23.5489,
  longitude: -46.6388,
};

const App: React.FC = () => {
  return (
    <LeafletView
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}
      mapMarkers={[
        {
          id: '1',
          position: {
            lat: DEFAULT_LOCATION.latitude,
            lng: DEFAULT_LOCATION.longitude,
          },
          icon: '📍',
          size: [32, 32],
        },
      ]}
    />
  );
};

export default App;
