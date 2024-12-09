#!/bin/bash

# Waiting for Vault to be ready
while [ ! -f /setup/vault_ids_ready ]; do
    echo "Waiting for Vault to generate role and secret IDs..."
    sleep 2
done

# Fetch ROLE_ID
VAULT_ROLE_ID=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
    --request GET \
    $VAULT_ADDR/v1/auth/approle/role/django-role/role-id | jq -r '.data.role_id')

# Fetch SECRET_ID
VAULT_SECRET_ID=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
    --request POST \
    $VAULT_ADDR/v1/auth/approle/role/django-role/secret-id | jq -r '.data.secret_id')

export VAULT_ROLE_ID
export VAULT_SECRET_ID

rm /setup/vault_ids_ready

# Start the application
python manage.py runserver.py 0.0.0.0:8000
