#!/bin/ash

# Logging in as root
vault login ${VAULT_DEV_ROOT_TOKEN_ID}

# Enabling the database secrets engine, which will allow us to store
# and create dynamically generated secrets
vault secrets enable database

# Delay to assure that PostgreSQL initializes properly
sleep 5

# Configuring connection to PostgreSQL Database
vault write database/config/my-postgres \
  plugin_name=postgresql-database-plugin \
  allowed_roles="django-role" \
  connection_url="postgresql://{{username}}:{{password}}@db:5432/${DB_NAME}?sslmode=disable" \
  username="${DB_USER}" \
  password="${DB_PASSWORD}"

# Creating a role to enable Django to access dynamically generated
# credentials
vault write database/roles/django-role \
  db_name=my-postgres \
  creation_statements="CREATE USER \"{{name}}\" WITH PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';
                       GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO \"{{name}}\"; \
					   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; \
					   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO \"{{name}}\";" \
  default_ttl="1h" \
  max_ttl="24h"
