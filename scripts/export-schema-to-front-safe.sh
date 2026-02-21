#!/usr/bin/env bash

set -u

OUT="./webapp/graphql/schema.graphql"
BACKEND_SCHEMA="./beak/api/gql/schema.graphql"
TMP="$(mktemp)"

cleanup() {
  rm -f "$TMP"
}
trap cleanup EXIT

if strawberry export-schema beak.api.gql.schema:schema >"$TMP"; then
  mv "$TMP" "$OUT"
  exit 0
fi

echo "[warn] schema export failed; trying fallback schema file" >&2
if [ -s "$BACKEND_SCHEMA" ]; then
  cp "$BACKEND_SCHEMA" "$OUT"
  exit 0
fi

echo "[warn] fallback schema file unavailable; keeping existing $OUT" >&2
if [ -s "$OUT" ]; then
  exit 0
fi

echo "[error] schema export failed and no usable schema file found" >&2
exit 1
