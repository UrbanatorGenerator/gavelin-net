#!/bin/bash
# Publishes one trilingual insight from a JSON spec: generate, build, commit, push, ping.
# The build runs before the commit, so a spec that produces broken Astro never reaches main.
#
# Usage: scripts/publish-insight.sh spec.json [--dry-run]
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

SPEC="${1:?usage: publish-insight.sh spec.json [--dry-run]}"
DRY_RUN="${2:-}"

if [ ! -f "$SPEC" ]; then
  echo "spec not found: $SPEC" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "working tree is dirty, refusing to publish" >&2
  git status --short >&2
  exit 1
fi

git pull --ff-only

if [ "$DRY_RUN" = "--dry-run" ]; then
  node scripts/new-insight.mjs "$SPEC" --dry-run
  echo "dry run: nothing written, nothing pushed"
  exit 0
fi

RESULT="$(node scripts/new-insight.mjs "$SPEC")"
echo "$RESULT"

# A failed build leaves the generated files in place for inspection but pushes nothing.
if ! npm run build >/tmp/insight-build.log 2>&1; then
  echo "build failed, not committing. Log:" >&2
  tail -30 /tmp/insight-build.log >&2
  exit 1
fi

TITLE="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')).articles.en.title)" "$SPEC")"

git add src public
git commit -m "$(cat <<EOF
Publish insight: $TITLE

Generated from the LinkedIn newsletter pipeline in sv/en/es.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
EOF
)"
git push

URLS="$(node -e "
const r=JSON.parse(process.argv[1]); console.log(r.urls.join(' '));" "$RESULT")"
# shellcheck disable=SC2086
scripts/indexnow.sh $URLS || echo "IndexNow ping failed (page is published regardless)" >&2

echo "published:"
for u in $URLS; do echo "  $u"; done
