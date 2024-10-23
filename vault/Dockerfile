FROM hashicorp/vault:latest

EXPOSE 8200

COPY ./setup_vault.sh /tmp/

ENTRYPOINT ["/bin/sh", "-c", "vault server -dev -dev-root-token-id=root -dev-listen-address=0.0.0.0:8200 & /tmp/setup_vault.sh && wait"]
