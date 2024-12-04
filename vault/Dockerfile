FROM hashicorp/vault:1.17.6

ARG PACKAGES="	curl \
				jq"

EXPOSE 8200

RUN apk update && apk add $PACKAGES

RUN mkdir -p /etc/vault.d/ca-certificates/
COPY ./vault.hcl /etc/vault.d/
COPY ./Certificates/pac4_ca.crt /etc/vault.d/ca-certificates/
COPY ./Certificates/vault.crt /etc/ssl/certs/
COPY ./Certificates/vault.key /etc/ssl/private/

COPY ./setup_vault.sh /tmp/

ENTRYPOINT ["/bin/sh", "-c", "/tmp/setup_vault.sh"]
