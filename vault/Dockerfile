#######################################################################
# HashiCorp Vault is a tool for securely managing secrets such as API #
# keys, passwords, usernames, etc. In our setup, Vault dynamically    #
# generates credentials to our PostgreSQL database, and the only      #
# service that can ask for these credentials is Django.               #
#######################################################################
FROM hashicorp/vault:1.17.6

# Exposing Vault's port to our Docker network
EXPOSE 8200

# The list of packages we use inside our custom "setup_vault.sh"
# script
ARG PACKAGES="	curl \
				jq"

# Updating the repository lists and installing the aforementioned
# packges
RUN apk update && apk add $PACKAGES

# Copying Vault configuration file
COPY ./vault.hcl /etc/vault.d/

# Creating directories for the SSL certificates that will allow us
# to connect to our other containers over an encrypted HTTPS
# connection
COPY ./Certificates/pac4_ca.crt /usr/share/ca-certificates/
COPY ./Certificates/vault.crt /etc/ssl/certs/
COPY ./Certificates/vault.key /etc/ssl/private/

# Copying and initializing our setup script instead of the default
# Vault script, which will allow us to more freely control every
# aspect of our configuration for our specific use cases
COPY ./setup_vault.sh /tmp/
ENTRYPOINT ["/bin/sh", "-c", "/tmp/setup_vault.sh"]
