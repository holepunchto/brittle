#!/bin/sh
PREBUILDS="brittle/node_modules/bare-sidecar/prebuilds"
HOST="/$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/aarch64/arm64/')"
BARE="$(dirname "$1")/../$PREBUILDS$HOST/bare"

for arg in "$@"; do
  [ "$arg" = "--" ] && break
  [ "$arg" = "--node" ] && exec node "$@"
done
exec "$BARE" "$@"