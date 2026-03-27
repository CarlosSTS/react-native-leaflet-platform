/** Represents a geographical point with a latitude and longitude. */
export interface LatLng {
  /** Latitude in degrees. */
  lat: number;
  /** Longitude in degrees. */
  lng: number;
}

/** Represents a rectangular geographical area defined by its south-west and north-east corners. */
export interface LatLngBounds {
  /** The south-west corner of the bounding box. */
  southWest: LatLng;
  /** The north-east corner of the bounding box. */
  northEast: LatLng;
}

/** A lightweight icon based on a `<div>` element instead of an image. Useful for fully custom markers. */
export interface DivIcon {
  /** Custom HTML content to render inside the marker `<div>`. */
  html?: string;
  /** CSS class name applied to the marker `<div>`. Defaults to `'leaflet-div-icon'`. */
  className?: string;
}
