#!/bin/bash
# Pings IndexNow for the URLs given as arguments.
# Usage: scripts/indexnow.sh https://gavelin.net/en/insights/foo/ [more urls...]
set -euo pipefail

KEY="3f1f8c80737691d9e35e6fd40591fd53"
HOST="gavelin.net"

if [ "$#" -eq 0 ]; then
  echo "usage: indexnow.sh <url> [url...]" >&2
  exit 1
fi

URL_LIST="$(printf '%s\n' "$@" | python3 -c 'import json,sys; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))')"

curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":$URL_LIST}"

echo "IndexNow ping sent for $# url(s)."
