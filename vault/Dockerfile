FROM hashicorp/vault:latest

EXPOSE 8200

RUN mkdir /etc/vault.d/
COPY ./vault.hcl /etc/vault.d/
COPY ./Certificates/vault.crt /etc/ssl/certs/
COPY ./Certificates/vault.key /etc/ssl/private/
COPY ./setup_vault.sh /tmp/

ENTRYPOINT ["/bin/sh", "-c", "/tmp/setup_vault.sh"]
