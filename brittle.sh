#!/bin/sh
PREBUILDS="brittle/node_modules/bare-sidecar/prebuilds"
HOST="/$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m | sed 's/aarch64/arm64/')"
BARE="$(dirname "$1")/../$PREBUILDS$HOST/bare"

NEXT=0
for arg in "$@"; do
  [ "$arg" = "--" ] && break
  if [ "$NEXT" = "1" ]; then
    [ "$arg" = "node" ] && exec node "$@"
    [ "$arg" = "bare" ] && exec bare "$@"
    NEXT=0
  fi
  [ "$arg" = "--runtime" ] && NEXT=1
done
exec "$BARE" "$@" 3<>/dev/null
