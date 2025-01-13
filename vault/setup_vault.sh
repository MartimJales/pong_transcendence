#!/bin/ash

# Creating necessary directory set in our Vault config for storage
# and assigning correct ownership to the "vault" user
mkdir /vault/data/
chmod -R 750 /vault/data/
chown -R vault:vault /vault/data/

# Starting Vault server and sending it to the background since it
# defaults to running on the foreground and would interfere with the
# execution of the rest of the script, while also storing its PID
echo "Initializing Vault server in the background..."
vault server -config=/etc/vault.d/vault.hcl &
VAULT_PID=$!

# Waiting for Vault server initialization since it starts running in
# parallel with this script and killing it if it fails to start on time
for i in {1..10}; do
	if [ vault status &> /dev/null ] ; then
		echo "Vault server is ready"
		break
	fi
	echo "Waiting for Vault initialization..."
	sleep 2
done

if [ ! vault status &> /dev/null ] ; then
	echo "Vault server failed to start on time"
	kill $VAULT_PID
	exit 1
fi

# Initializing Vault's storage backend and storing the command's output
if [ ! -f /vault/init-output.json ]; then
	echo "Initializing Vault..."
	vault operator init -format=json > /vault/init-output.json
	echo "Vault initialized. Output stored in /vault/init-output.json"
else
	echo "Vault is already initialized. Skipping initialization."
fi

# Extracting Vault's unseal keys and root token from the aforementioned
# output
UNSEAL_KEYS=$(jq -r '.unseal_keys_b64[]' /vault/init-output.json)
ROOT_TOKEN=$(jq -r '.root_token' /vault/init-output.json)

# Unsealing Vault in order to modify its default values
echo "Unsealing Vault..."
for key in $UNSEAL_KEYS; do
	vault operator unseal "$key"
done
echo "Vault is now unsealed"

echo "Starting Vault configuration..."
export VAULT_TOKEN=$ROOT_TOKEN

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
			connection_url="postgresql://{{username}}:{{password}}@${DB_ADDR}:${DB_PORT}/${DB_NAME}?sslmode=verify-full&sslcert=/etc/ssl/certs/vault.crt&sslkey=/etc/ssl/private/vault.key&sslrootcert=/usr/share/ca-certificates/pac4_ca.crt" \
			username="${DB_USER}" \
			password="${DB_PASSWORD}"

		# Creating a role to enable Django to access dynamically 
		# generated credentials
		vault write database/roles/django-role \
			db_name=my-postgres \
			creation_statements="CREATE USER \"{{name}}\" WITH PASSWORD '{{password}}' VALID UNTIL '{{expiration}}';
								GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO \"{{name}}\"; \
								GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; \
								GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO \"{{name}}\";"

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

# Storing Vault root token and unseal keys inside a shared volume with
# Django
echo $VAULT_TOKEN > /setup/vault_token
echo $UNSEAL_KEYS > /setup/vault_keys

# Waiting for Django to fetch Vault's token and keys before sealing
# Vault again
while [ -f /setup/vault_token ]; do
	echo "Waiting for Django to fetch Vault token and unseal keys..."
	sleep 1
done

# Sealing Vault back up once the configuration has finished
echo "Sealing Vault..."
vault operator seal

# Removing the output file of the "vault operator init" command
# considering it contains both the Vault's unseal keys and root token
# stored in plain text
rm /vault/init-output.json

# Removing environment variables containing sensitive information
unset DB_ADDR DB_HOST DB_NAME DB_PASSWORD DB_PORT DB_USER 

echo "Setup script has finished successfully. Keeping Vault server running in the background..."

# Keeping the container running since the Vault server execution has
# been sent to the background
wait $VAULT_PID
