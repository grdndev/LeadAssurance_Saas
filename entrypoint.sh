#!/bin/sh

export PGPASSWORD="$POSTGERS_PASSWORD"

until pg_isready -h postgres -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  sleep 2
done

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

exec "$@"
