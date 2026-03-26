import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  MapMarker,
  WebviewLeafletMessage,
  MapMessage,
  WebViewLeafletEvents,
  MapLayer,
  MapShape,
  OwnPositionMarker,
  OWN_POSITION_MARKER_ID,
} from '~/@types/leaflet';

import { LatLngExpression } from '~/@types/map';

const DEFAULT_MAP_LAYERS: MapLayer[] = [
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: 'OpenStreetMap.Mapnik',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
];

const DEFAULT_ZOOM = 15;

interface LeafletViewProps {
  onMessageReceived?: (message: WebviewLeafletMessage) => void;
  mapLayers?: MapLayer[];
  mapMarkers?: MapMarker[];
  mapShapes?: MapShape[];
  mapCenterPosition?: LatLngExpression;
  ownPositionMarker?: OwnPositionMarker;
  zoom?: number;
  doDebug?: boolean;
  zoomControl?: boolean;
  attributionControl?: boolean;
  useMarkerClustering?: boolean;
  source?: string;
  style?: React.CSSProperties;
}

const LeafletView: React.FC<LeafletViewProps> = ({
  onMessageReceived,
  mapLayers = DEFAULT_MAP_LAYERS,
  mapMarkers = [],
  mapShapes = [],
  mapCenterPosition,
  ownPositionMarker,
  zoom = DEFAULT_ZOOM,
  doDebug = __DEV__,
  source = '/leaflet.html',
  zoomControl = true,
  attributionControl = true,
  useMarkerClustering = true,
  style,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialized, setInitialized] = useState(false);

  const logMessage = useCallback(
    (message: string) => {
      if (doDebug) {
        console.log(message);
      }
    },
    [doDebug],
  );

  const sendMessage = useCallback(
    (payload: MapMessage) => {
      if (!iframeRef.current?.contentWindow) {
        return;
      }
      logMessage(`sending: ${JSON.stringify(payload)}`);

      iframeRef.current?.contentWindow?.postMessage(payload, '*');
    },
    [logMessage],
  );

  const sendInitialMessage = useCallback(() => {
    const startupMessage: MapMessage = {};

    if (mapLayers) {
      startupMessage.mapLayers = mapLayers;
    }
    if (mapMarkers) {
      startupMessage.mapMarkers = mapMarkers;
    }
    if (mapCenterPosition) {
      startupMessage.mapCenterPosition = mapCenterPosition;
    }
    if (mapShapes) {
      startupMessage.mapShapes = mapShapes;
    }
    if (ownPositionMarker) {
      startupMessage.ownPositionMarker = {
        ...ownPositionMarker,
        id: OWN_POSITION_MARKER_ID,
      };
    }
    startupMessage.zoom = zoom;
    startupMessage.useMarkerClustering = useMarkerClustering;
    startupMessage.zoomControl = zoomControl;
    startupMessage.attributionControl = attributionControl;

    sendMessage(startupMessage);
    setInitialized(true);
    logMessage('sending initial message');
  }, [
    logMessage,
    mapCenterPosition,
    mapLayers,
    mapMarkers,
    mapShapes,
    ownPositionMarker,
    sendMessage,
    zoom,
    attributionControl,
    zoomControl,
    useMarkerClustering,
  ]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      console.log('Received message from iframe:', data);
      if (!data || typeof data !== 'string') {
        return;
      }

      const message: WebviewLeafletMessage = JSON.parse(data);
      logMessage(`received: ${JSON.stringify(message)}`);

      if (message.msg === WebViewLeafletEvents.MAP_READY) {
        sendInitialMessage();
      }
      if (message.event === WebViewLeafletEvents.ON_MOVE_END) {
        logMessage(
          `moved to: ${JSON.stringify(message.payload?.mapCenterPosition)}`,
        );
      }

      onMessageReceived?.(message);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [logMessage, onMessageReceived, sendInitialMessage]);

  //Handle mapLayers update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({ mapLayers });
  }, [initialized, mapLayers, sendMessage]);

  //Handle mapMarkers update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapMarkers,
      useMarkerClustering,
      zoomControl,
      attributionControl,
    });
  }, [
    initialized,
    mapMarkers,
    sendMessage,
    useMarkerClustering,
    zoomControl,
    attributionControl,
  ]);

  //Handle mapShapes update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({ mapShapes });
  }, [initialized, mapShapes, sendMessage]);

  //Handle ownPositionMarker update
  useEffect(() => {
    if (!initialized || !ownPositionMarker) {
      return;
    }
    sendMessage({
      ownPositionMarker: { ...ownPositionMarker, id: OWN_POSITION_MARKER_ID },
    });
  }, [initialized, ownPositionMarker, sendMessage]);

  //Handle mapCenterPosition update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({ mapCenterPosition });
  }, [initialized, mapCenterPosition, sendMessage]);

  //Handle zoom update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({ zoom });
  }, [initialized, zoom, sendMessage]);

  return (
    <iframe
      ref={iframeRef}
      src={source}
      title="Leaflet Map"
      style={{
        border: 0,
        width: '100vw',
        height: '100vh',
        ...style,
      }}
    />
  );
};

export { LeafletView };
