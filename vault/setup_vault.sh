#!/bin/ash

# Creating necessary directory set in our Vault config for RAFT storage
mkdir /vault/data/
chmod -R 755 /vault/data/

# Initiate vault server
vault server -config /etc/vault.d/vault.hcl &

# Waiting for Vault to be fully initialized
IDX=0
while [ $IDX -lt 10 ]; do
	if (nc -z localhost:8200); then
		break
	else
		sleep 2
		IDX=$((IDX+1))
	fi
done

if [ $IDX -eq 10 ]; then
	echo "Vault failed to start on time"
	# exit 1
fi

# Enabling the database secrets engine, which will allow us to store
# and create dynamically generated secrets
vault secrets enable database

# Waiting for database to be fully initialized
IDX=0
while [ $IDX -lt 10 ]; do
	if (nc -w 3 -zv $DB_ADDR $DB_PORT); then
		# Configuring connection to PostgreSQL database
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
	exit 1
fi

tail -f "/dev/null"
