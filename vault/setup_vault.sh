#!/bin/ash

# Extra check to ensure Vault knows where to connect
export VAULT_ADDR='http://127.0.0.1:8200'

# Loging in as root
vault login ${VAULT_DEV_ROOT_TOKEN_ID}

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
  creation_statements="CREATE USER \"{{name}}\" WITH PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO \"{{name}}\";" \
  default_ttl="1h" \
  max_ttl="24h"
