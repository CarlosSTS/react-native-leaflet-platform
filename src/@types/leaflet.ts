import { DivIcon, LatLng, LatLngBounds } from './map';

/** Default marker ID used to identify the user's own position on the map. */
export const OWN_POSITION_MARKER_ID = 'OWN_POSITION_MARKER_ID';

/** Events emitted by the Leaflet WebView map component. */
export enum WebViewLeafletEvents {
  /** Fired when the map React component has mounted. */
  MAP_COMPONENT_MOUNTED = 'MAP_COMPONENT_MOUNTED',
  /** Fired when the Leaflet map is fully initialized and ready to use. */
  MAP_READY = 'MAP_READY',
  /** Fired when a document-level event listener has been added. */
  DOCUMENT_EVENT_LISTENER_ADDED = 'DOCUMENT_EVENT_LISTENER_ADDED',
  /** Fired when a window-level event listener has been added. */
  WINDOW_EVENT_LISTENER_ADDED = 'WINDOW_EVENT_LISTENER_ADDED',
  /** Fired when the map was unable to add an event listener. */
  UNABLE_TO_ADD_EVENT_LISTENER = 'UNABLE_TO_ADD_EVENT_LISTENER',
  /** Fired when a document-level event listener has been removed. */
  DOCUMENT_EVENT_LISTENER_REMOVED = 'DOCUMENT_EVENT_LISTENER_REMOVED',
  /** Fired when a window-level event listener has been removed. */
  WINDOW_EVENT_LISTENER_REMOVED = 'WINDOW_EVENT_LISTENER_REMOVED',
  /** Fired when the map finishes a pan/move action. */
  ON_MOVE_END = 'onMoveEnd',
  /** Fired when the map starts a pan/move action. */
  ON_MOVE_START = 'onMoveStart',
  /** Fired continuously while the map is being panned/moved. */
  ON_MOVE = 'onMove',
  /** Fired when the map container is resized. */
  ON_RESIZE = 'onResize',
  /** Fired when the map is destroyed. */
  ON_UNLOAD = 'onUnload',
  /** Fired when the map needs to redraw its content (e.g. after a zoom or center change). */
  ON_VIEW_RESET = 'onViewReset',
  /** Fired when the map finishes a zoom action. */
  ON_ZOOM_END = 'onZoomEnd',
  /** Fired when the number of available zoom levels changes (e.g. layers are added/removed). */
  ON_ZOOM_LEVELS_CHANGE = 'onZoomLevelsChange',
  /** Fired when the map starts a zoom action. */
  ON_ZOOM_START = 'onZoomStart',
  /** Fired continuously while the map zoom level is changing. */
  ON_ZOOM = 'onZoom',
  /** Fired when the user clicks/taps on the map (not on a marker). */
  ON_MAP_TOUCHED = 'onMapClicked',
  /** Fired when the user clicks/taps on a map marker. */
  ON_MAP_MARKER_CLICKED = 'onMapMarkerClicked',
  //  ON_MAP_SHAPE_CLICKED = "onMapShapeClicked" cannot click on shapes yet
}

/** Available CSS animation types that can be applied to map markers. */
export enum AnimationType {
  /** Makes the marker bounce up and down. */
  BOUNCE = 'bounce',
  /** Fades the marker in and out. */
  FADE = 'fade',
  /** Applies a pulsing scale effect to the marker. */
  PULSE = 'pulse',
  /** Makes the marker jump in place. */
  JUMP = 'jump',
  /** Rotates the marker continuously. */
  SPIN = 'spin',
  /** Makes the marker waggle side to side. */
  WAGGLE = 'waggle',
}

/** Types of map layers supported by Leaflet. */
export enum MapLayerType {
  /** An image overlay bound to specific geographical coordinates. */
  IMAGE_LAYER = 'ImageOverlay',
  /** A standard tile layer (e.g. OpenStreetMap, Mapbox). */
  TILE_LAYER = 'TileLayer',
  /** A vector data layer (e.g. GeoJSON-based shapes). */
  VECTOR_LAYER = 'VectorLayer',
  /** A video overlay bound to specific geographical coordinates. */
  VIDEO_LAYER = 'VideoOverlay',
  /** A WMS (Web Map Service) tile layer. */
  WMS_TILE_LAYER = 'WMSTileLayer',
}

/** Types of geometric shapes that can be drawn on the map. */
export enum MapShapeType {
  /** A circle with a radius in meters, projected on the map. */
  CIRCLE = 'Circle',
  /** A circle marker with a fixed pixel radius, regardless of zoom level. */
  CIRCLE_MARKER = 'CircleMarker',
  /** A polyline (series of connected line segments). */
  POLYLINE = 'Polyline',
  /** A filled polygon (closed shape). */
  POLYGON = 'Polygon',
  /** A rectangle (axis-aligned bounding box). */
  RECTANGLE = 'Rectangle',
}

/** Constant used to make a marker animation repeat indefinitely. */
export const INFINITE_ANIMATION_ITERATIONS: string = 'infinite';

/** Direction in which a CSS animation plays. Follows the `animation-direction` CSS property. */
export enum AnimationDirection {
  /** Plays the animation forwards each cycle. */
  NORMAL = 'nomal',
  /** Plays the animation backwards each cycle. */
  REVERSE = 'reverse',
  /** Alternates between forwards and backwards on each cycle. */
  ALTERNATE = 'alternate',
  /** Alternates starting backwards then forwards on each cycle. */
  ALTERNATE_REVERSE = 'alternate-reverse',
}
/** Configuration for a CSS animation applied to a map marker. */
export interface MapMarkerAnimation {
  /** The animation effect to apply. */
  type: AnimationType;
  /** Duration of a single animation cycle in seconds. */
  duration?: number;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  /** The direction the animation plays (normal, reverse, alternate). */
  direction?: AnimationDirection;
  /** Number of times the animation repeats. Use `INFINITE_ANIMATION_ITERATIONS` for endless looping. */
  iterationCount?: number | typeof INFINITE_ANIMATION_ITERATIONS;
}

/** Base properties shared by all map markers. */
export interface BaseMarker {
  /** Optional CSS animation applied to the marker. */
  animation?: MapMarkerAnimation;
  /** Geographic coordinates where the marker is placed. */
  position: LatLng;
  /** A lightweight `<div>`-based icon instead of an image. Useful for fully custom markers. */
  divIcon?: DivIcon;
  /** URL or emoji string used as the marker icon. */
  icon: string;
  /** The pixel offset `[x, y]` of the icon anchor relative to its top-left corner. */
  iconAnchor?: [number, number];
  /** Width and height `[w, h]` of the marker icon in pixels. */
  size: [number, number];
  /** Text displayed inside the marker tooltip. */
  title?: string;
  /** Inline CSS styles applied to the marker icon element. */
  iconStyle?: string;
  /** Inline CSS styles applied to the tooltip title text. */
  titleStyle?: string;
  /** Inline CSS styles applied to the tooltip container. */
  tooltipStyle?: string;
  /** Inline CSS styles applied to the tooltip tip (small arrow/triangle). */
  tooltipTipStyle?: string;
  /** Inline CSS styles applied to the tooltip close button. */
  closeButtonStyle?: string;
  /** Enables the "X" close button inside the tooltip. @default false */
  closeButton?: boolean;
  /** Closes the tooltip when the user clicks anywhere on the map. @default false */
  closeOnClick?: boolean;
  /** Automatically closes this tooltip when another marker's tooltip is opened. @default false */
  autoClose?: boolean;
}

/** A map marker identified by a unique ID. */
export interface MapMarker extends BaseMarker {
  /** Unique identifier for this marker. Used to reference it in events. */
  id: string;
}

/** Configuration for a map layer (tile, image, video, or WMS). */
export interface MapLayer {
  /** Attribution text displayed on the map (e.g. "© OpenStreetMap contributors"). */
  attribution?: string;
  /** Prefix text shown before the attribution (e.g. "Leaflet"). Set to `''` to remove. */
  attributionPrefix?: string;
  /** Whether this layer is a base layer (only one base layer is visible at a time). */
  baseLayer?: boolean;
  /** Whether this base layer is selected by default in the layer control. */
  baseLayerIsChecked?: boolean;
  /** Display name for this base layer in the layer control. */
  baseLayerName?: string;
  /** Geographical bounds to restrict the layer to a specific area. */
  bounds?: LatLngBounds;
  /** Unique identifier for this layer. */
  id?: string;
  /** The type of map layer (TileLayer, ImageOverlay, etc.). */
  layerType?: MapLayerType;
  /** Opacity of the layer, from `0` (fully transparent) to `1` (fully opaque). */
  opacity?: number;
  /** The Leaflet map pane where this layer is rendered. */
  pane?: string;
  /** Sub-layer identifier, used for WMS layers. */
  subLayer?: string;
  /** URL template for the layer tiles or resource (e.g. `'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'`). */
  url?: string;
  /** Stack order of the layer. Higher values are rendered on top. */
  zIndex?: number;
  /** Minimum zoom level at which this layer is visible. */
  minZoom?: number;
  /** Maximum zoom level at which this layer is visible. */
  maxZoom?: number;
  /** Controls visibility of the zoom controls on the map. */
  zoomControl?: boolean;
  /** Controls visibility of the attribution control on the map. */
  attributionControl?: boolean;
  /** Enables or disables marker clustering on this layer. */
  useMarkerClustering?: boolean;
}

/** Configuration for a geometric shape drawn on the map. */
export interface MapShape {
  /** Array of coordinates defining the shape bounds (used for rectangles). */
  bounds?: LatLng[];
  /** Center point of the shape (used for circles and circle markers). */
  center?: LatLng;
  /** Stroke/fill color of the shape (any valid CSS color string). */
  color?: string;
  /** Unique identifier for this shape. */
  id?: string;
  /** Array of coordinates defining the shape vertices (used for polylines and polygons). Nested arrays represent multi-polylines/polygons. */
  positions?: LatLng[] | LatLng[][];
  /** Radius of the shape in meters (for `Circle`) or pixels (for `CircleMarker`). */
  radius?: number;
  /** The geometric type of this shape. */
  shapeType: MapShapeType;
}

/** Message payload sent to the Leaflet WebView to update the map state. */
export interface MapMessage {
  /** Array of map layers to render (tiles, images, etc.). */
  mapLayers?: MapLayer[];
  /** Array of markers to display on the map. */
  mapMarkers?: MapMarker[];
  /** Array of geometric shapes to draw on the map. */
  mapShapes?: MapShape[];
  /** The center position of the map. */
  mapCenterPosition?: LatLng;
  /** A special marker representing the user's own location. */
  ownPositionMarker?: OwnPositionMarker;
  /** Desired zoom level of the map (1–19). */
  zoom?: number;
  /** Enables or disables marker clustering. @default true */
  useMarkerClustering?: boolean;
  /** Controls visibility of the zoom controls on the map. */
  zoomControl?: boolean;
  /** Controls visibility of the attribution control on the map. */
  attributionControl?: boolean;
}

/** Data payload included in messages received from the Leaflet WebView. */
export interface WebviewLeafletMessagePayload {
  /** Current visible bounds of the map. */
  bounds?: LatLngBounds;
  /** Current center position of the map. */
  mapCenterPosition: LatLng;
  /** ID of the marker that was clicked (if the event is marker-related). */
  mapMarkerID?: string;
  /** Geographic coordinates where the user clicked/tapped on the map. */
  touchLatLng?: LatLng;
  /** Current zoom level of the map. */
  zoom?: number;
}

/** Message received from the Leaflet WebView, describing a map event or error. */
export interface WebviewLeafletMessage {
  /** The event type that triggered this message (e.g. `'onMapClicked'`, `'onZoomEnd'`). */
  event?: string;
  /** A general-purpose message string. */
  msg?: string;
  /** Error message, if the event represents an error. */
  error?: string;
  /** Data payload with map state and event details. */
  payload?: WebviewLeafletMessagePayload;
}

/** A special marker representing the user's own position. Extends `BaseMarker` with an optional ID. */
export interface OwnPositionMarker extends BaseMarker {
  /** Optional ID override. Defaults to `OWN_POSITION_MARKER_ID`. */
  id?: string;
}
