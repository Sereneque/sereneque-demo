#!/usr/bin/env bash
# Tell the search engines a page is new or changed, instead of waiting to be
# crawled. Run it after a deploy. No arguments = submit everything in the
# sitemap; otherwise pass the URLs you care about.
#
#   tools/indexnow.sh
#   tools/indexnow.sh https://sereneque.com/some-new-article.html
#
# The key is deliberately public -- it is served at the site root, and that is
# how the API checks we own the domain. Do not delete public/<key>.txt.
set -euo pipefail
cd "$(dirname "$0")/.."

KEYFILE=$(ls public/*.txt | grep -E 'public/[0-9a-f]{32}\.txt$' | head -1)
[ -n "$KEYFILE" ] || { echo "No IndexNow key file in public/. Aborting."; exit 1; }
KEY=$(basename "$KEYFILE" .txt)

if [ $# -gt 0 ]; then
  URLS=("$@")
else
  mapfile -t URLS < <(grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's/<[^>]*>//g')
fi
[ ${#URLS[@]} -gt 0 ] || { echo "No URLs to submit."; exit 1; }

LIST=$(printf '"%s",' "${URLS[@]}"); LIST="[${LIST%,}]"
printf 'Submitting %d URL(s) with key %s\n' "${#URLS[@]}" "$KEY"

CODE=$(curl -s -o /tmp/indexnow.out -w '%{http_code}' -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"sereneque.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://sereneque.com/$KEY.txt\",\"urlList\":$LIST}")

case "$CODE" in
  200|202) echo "Accepted (HTTP $CODE)." ;;
  400) echo "HTTP 400 - bad request. Check the URL list."; cat /tmp/indexnow.out; exit 1 ;;
  403) echo "HTTP 403 - key rejected. Is https://sereneque.com/$KEY.txt still live?"; exit 1 ;;
  422) echo "HTTP 422 - a URL does not belong to sereneque.com."; cat /tmp/indexnow.out; exit 1 ;;
  429) echo "HTTP 429 - too many requests. Try later."; exit 1 ;;
  *)   echo "Unexpected HTTP $CODE"; cat /tmp/indexnow.out; exit 1 ;;
esac
rm -f /tmp/indexnow.out
