#!/bin/bash

# Waiting for Vault to be ready
while [ ! -f /setup/vault_token ]; do
    echo "Waiting for Vault to finish startup..."
    sleep 2
done

# Fetch ROLE_ID
#VAULT_ROLE_ID=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
#    --request GET \
#    $VAULT_ADDR/v1/auth/approle/role/django-role/role-id | jq -r '.data.role_id')

# Fetch SECRET_ID
#VAULT_SECRET_ID=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" \
#    --request POST \
#    $VAULT_ADDR/v1/auth/approle/role/django-role/secret-id | jq -r '.data.secret_id')

#export VAULT_ROLE_ID
#export VAULT_SECRET_ID

export VAULT_KEYS=$(cat /setup/vault_keys)
export VAULT_TOKEN=$(cat /setup/vault_token)

rm /setup/vault_keys
rm /setup/vault_token

# Start the application
sh -c "
python -m pip install Pillow &&
pip install django-cors-headers && 
pip install channels &&  
python manage.py makemigrations &&
python manage.py migrate &&
python manage.py createsuperuser --no-input &&
python manage.py runserver 0.0.0.0:8000" 
