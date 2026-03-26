#!/bin/sh
# Copies leaflet.html from @carlossts/react-native-leaflet-platform into the
# consumer project's public/ directory (required for web/iframe rendering).

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LEAFLET_HTML="$SCRIPT_DIR/../android/app/src/main/assets/leaflet.html"
DEST="$(pwd)/public"

if [ ! -f "$LEAFLET_HTML" ]; then
  echo "Error: leaflet.html not found at $LEAFLET_HTML"
  exit 1
fi

mkdir -p "$DEST"
cp "$LEAFLET_HTML" "$DEST/leaflet.html"
echo "leaflet.html copied to $DEST/leaflet.html"
