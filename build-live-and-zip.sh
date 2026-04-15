#!/bin/bash

REPO_ROOT="$(pwd)"
BUILDS_DIR="$REPO_ROOT/builds"
mkdir -p "$BUILDS_DIR"

# Create a per-run builds folder so each script invocation gets its own directory
RUN_TS="$(date +%Y-%m-%d_%H-%M-%S)"
RUN_DIR="$BUILDS_DIR/build.$RUN_TS"
mkdir -p "$RUN_DIR"

for dir in */; do
  [ -d "$dir" ] || continue

  if [ ! -f "$dir/package.json" ]; then
    continue
  fi

  SIZE="${dir%/}"
  echo "---- Building $SIZE (live) ----"

# Compute absolute project dir and print actions
  PROJECT_DIR="$(cd "$dir" && pwd)"
  echo "Cleaning caches and previous builds for $PROJECT_DIR"
  rm -rf "$PROJECT_DIR/.parcel-cache" "$PROJECT_DIR/.cache" "$PROJECT_DIR/dist" "$PROJECT_DIR/output" "$(pwd)/.parcel-cache"
  # Try package-provided clean first (if present), then run live build
  (cd "$dir" && (npm run prebuild:live || true) && npm run build:live) || continue

  # Determine actual output directory
  OUT="$dir/dist"

  if [ ! -d "$OUT" ]; then
    echo "No output dir found for $SIZE — skipping zip"
    continue
  fi

  # Flatten the dist folder - if there's a single subfolder, move its contents up
  SUBFOLDER=$(find "$OUT" -maxdepth 1 -type d ! -name "dist" -printf '%f\n' | head -1)
  if [ -n "$SUBFOLDER" ] && [ -d "$OUT/$SUBFOLDER" ]; then
    echo "Flattening structure: moving contents of $OUT/$SUBFOLDER to $OUT"
    mv "$OUT/$SUBFOLDER"/* "$OUT/" 2>/dev/null || true
    rmdir "$OUT/$SUBFOLDER" 2>/dev/null || true
  fi

  # Also ensure any fonts folders under the project or output are removed (robust)
  if [ -d "$PROJECT_DIR/assets/fonts" ]; then
    echo "Deleting folder $PROJECT_DIR/assets/fonts (project-level)"
    rm -rf "$PROJECT_DIR/assets/fonts" || true
  fi
  echo "Searching for any 'fonts' directories under $OUT and removing them"
  find "$OUT" -type d -name 'fonts' -prune -print -exec rm -rf {} + || true

  # Create a timestamp and rename the output folder so each build creates a new folder
  TIMESTAMP="$(date +%H-%M-%S_%d-%m-%y)"
  NEW_OUT="${OUT}.${TIMESTAMP}"
  if [ -e "$NEW_OUT" ]; then
    NEW_OUT="${OUT}.${TIMESTAMP}.$(date +%s)"
  fi

  if mv "$OUT" "$NEW_OUT" 2>/dev/null; then
    OUT="$NEW_OUT"
  else
    echo "Warning: failed to rename $OUT to $NEW_OUT — continuing with original output dir"
  fi

  # Create timestamped zip in run folder (no per-size subfolders)
  ZIP_PATH="$RUN_DIR/${SIZE}.live.${TIMESTAMP}.zip"
  echo "Creating zip: $ZIP_PATH"
  TEMP_ZIP_DIR="$(mktemp -d)"
  cp -r "$OUT/." "$TEMP_ZIP_DIR/$SIZE"
  (cd "$TEMP_ZIP_DIR" && zip -r "$ZIP_PATH" "$SIZE")
  rm -rf "$TEMP_ZIP_DIR"
  if [ -f "$ZIP_PATH" ]; then
    echo "Zip created: $ZIP_PATH"
    echo "Removing output folder: $OUT"
    rm -rf "$OUT" || echo "Warning: failed to remove $OUT" >&2
  else
    echo "Error: zip not found after creation: $ZIP_PATH" >&2
  fi
done

echo "Live builds complete"
