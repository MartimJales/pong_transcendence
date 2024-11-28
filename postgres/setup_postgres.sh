#!/bin/bash

# Wait for PostgreSQL initialization to complete
echo "Waiting for PostgreSQL initialization..."
until pg_isready -h localhost -p 5432 > /dev/null 2>&1; do
    sleep 1
done

echo "PostgreSQL initialized. Applying custom configurations."

# Copy the configuration files to the data directory
cp /tmp/postgresql.conf /var/lib/postgresql/data/postgresql.conf
cp /tmp/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf

echo "Custom configurations applied."

# Restart PostgreSQL to apply changes
pg_ctl reload

# Call the original entrypoint to continue normal operation
exec docker-entrypoint.sh "$@"
