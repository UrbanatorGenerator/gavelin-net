#!/bin/bash
# Pinga IndexNow efter publicering av nytt innehåll
# Kör med: bash indexnow-ping.sh

KEY="3f1f8c80737691d9e35e6fd40591fd53"
HOST="gavelin.net"

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"$HOST\",
    \"key\": \"$KEY\",
    \"keyLocation\": \"https://$HOST/$KEY.txt\",
    \"urlList\": [
      \"https://gavelin.net/sv/\",
      \"https://gavelin.net/en/\",
      \"https://gavelin.net/sv/insikter/\",
      \"https://gavelin.net/en/insights/\",
      \"https://gavelin.net/sv/insikter/deal-framework/\",
      \"https://gavelin.net/en/insights/deal-framework/\",
      \"https://gavelin.net/sv/insikter/affarer-fastnar-pa-80/\",
      \"https://gavelin.net/en/insights/deals-stalled-at-80/\",
      \"https://gavelin.net/sv/insikter/dolda-anledningen-kunder-stannar/\",
      \"https://gavelin.net/en/insights/hidden-reason-buyers-stall/\",
      \"https://gavelin.net/sv/insikter/osynliga-kvoten/\",
      \"https://gavelin.net/en/insights/invisible-quota/\",
      \"https://gavelin.net/sv/insikter/fran-timmar-till-minuter/\",
      \"https://gavelin.net/en/insights/from-hours-to-minutes/\"
    ]
  }" && echo "IndexNow ping skickat."
