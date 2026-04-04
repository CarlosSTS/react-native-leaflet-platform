#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TARGET_FILE="$PROJECT_ROOT/node_modules/react-native-webview/apple/RNCWebViewImpl.m"

if [[ ! -f "$TARGET_FILE" ]]; then
  echo "[webview-patch] arquivo nao encontrado: $TARGET_FILE"
  exit 0
fi

if ! grep -q 'NSString \*navigationTypeString = navigationTypes\[@(navigationType)\] ?: @"other";' "$TARGET_FILE"; then
  perl -0777 -i -pe 's/BOOL hasTargetFrame = navigationAction\.targetFrame != nil;\n/BOOL hasTargetFrame = navigationAction.targetFrame != nil;\n    NSString *navigationTypeString = navigationTypes[@(navigationType)] ?: @"other";\n    NSString *requestURLString = request.URL.absoluteString ?: @"";\n/s' "$TARGET_FILE"
fi

perl -0777 -i -pe 's/\@\{\@"targetUrl": request\.URL\.absoluteString\}/\@{\@"targetUrl": requestURLString}/g' "$TARGET_FILE"
perl -0777 -i -pe 's/\@"url": \(request\.URL\)\.absoluteString,\n\s*\@"navigationType": navigationTypes\[\@\(navigationType\)\]/\@"url": requestURLString,\n                            \@"navigationType": navigationTypeString/g' "$TARGET_FILE"
perl -0777 -i -pe 's/\@"url": request\.URL\.absoluteString,\n\s*\@"navigationType": navigationTypes\[\@\(navigationType\)\]/\@"url": requestURLString,\n                            \@"navigationType": navigationTypeString/g' "$TARGET_FILE"
perl -0777 -i -pe 's/\@"url": \(request\.URL\)\.absoluteString,\n\s*\@"navigationType": navigationTypes\[\@\(navigationType\)\],/\@"url": requestURLString,\n            \@"navigationType": navigationTypeString,/g' "$TARGET_FILE"
perl -0777 -i -pe 's/\@"url": request\.URL\.absoluteString,\n\s*\@"navigationType": navigationTypes\[\@\(navigationType\)\],/\@"url": requestURLString,\n            \@"navigationType": navigationTypeString,/g' "$TARGET_FILE"

if grep -q 'NSString \*navigationTypeString = navigationTypes\[@(navigationType)\] ?: @"other";' "$TARGET_FILE" \
  && ! grep -q '@"navigationType": navigationTypes\[@(navigationType)\]' "$TARGET_FILE" \
  && ! grep -q '@"url": (request.URL).absoluteString' "$TARGET_FILE" \
  && ! grep -q '@"url": request.URL.absoluteString' "$TARGET_FILE" \
  && ! grep -q '@"targetUrl": request.URL.absoluteString' "$TARGET_FILE"; then
  echo "[webview-patch] patch aplicado com sucesso"
else
  echo "[webview-patch] falha ao aplicar patch"
  exit 1
fi
