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
    />
  );
};

export default App;
