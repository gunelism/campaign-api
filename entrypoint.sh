#!/bin/sh

echo "Waiting for the database to be ready..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "Database is ready. Running migrations..."
npm run migration

echo "Starting the application..."
npm run dev