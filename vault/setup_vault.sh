#!/bin/ash

# Logging in as root
vault login ${VAULT_DEV_ROOT_TOKEN_ID}

# Enabling the database secrets engine, which will allow us to store
# and create dynamically generated secrets
vault secrets enable database

# Loop to ensure the database in only accessed when its container is
# fully initialized
IDX=0
while [ $IDX -lt 10 ]; do
	if (nc -w 3 -zv $DB_ADDR $DB_PORT); then
		# Configuring connection to PostgreSQL Database
		vault write database/config/my-postgres \
		  plugin_name=postgresql-database-plugin \
		  allowed_roles="django-role" \
		  connection_url="postgresql://{{username}}:{{password}}@db:5432/${DB_NAME}?sslmode=disable" \
		  username="${DB_USER}" \
		  password="${DB_PASSWORD}"

		# Creating a role to enable Django to access dynamically 
		# generated credentials
		vault write database/roles/django-role \
		  db_name=my-postgres \
		  creation_statements="CREATE USER \"{{name}}\" WITH PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';
							   GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO \"{{name}}\"; \
							   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; \
							   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO \"{{name}}\";" \
		  default_ttl="1h" \
		  max_ttl="24h"

		break
	else
		sleep 1
		IDX=$((IDX+1))
	fi
done

if [ $IDX -eq 10 ]; then
	echo "Failed to access database"
fi

mkdir /vault/data/

# Initiate vault development server
# WARNING: This current server setup is for testing purposes only, it's
# not intended to be run like this in the final project
vault server -dev -dev-root-token-id=root -dev-listen-address=0.0.0.0:8200
