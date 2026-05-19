#!/usr/bin/env bash
# ensure the env variables are set
source ./.env
test -n "$POSTGRES_PASSWORD" || exit 1
test -n "$POSTGRES_DB" || exit 1
test -n "$POSTGRES_USER" || exit 1

docker run --name linking-postgres \
  -e POSTGRES_USER="$POSTGRES_USER" \
  -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \
  -e POSTGRES_DB="$POSTGRES_DB" \
  -p 5432:5432 \
  -d postgres:16-alpine
