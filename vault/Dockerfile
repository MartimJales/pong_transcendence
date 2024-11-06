FROM hashicorp/vault:latest

EXPOSE 8200

RUN mkdir -p /etc/vault.d/ca-certificates/
COPY ./vault.hcl /etc/vault.d/
COPY ./Certificates/CA/pac4_ca.crt /etc/vault/ca-certificates/
COPY ./Certificates/SSL/vault.crt /etc/ssl/certs/
COPY ./Certificates/SSL/vault.key /etc/ssl/private/
COPY ./setup_vault.sh /tmp/

ENTRYPOINT ["/bin/sh", "-c", "/tmp/setup_vault.sh"]
