FROM postgres:13

COPY ./Certificates/pac4_ca.crt /etc/vault/ca-certificates/
COPY ./Certificates/postgres.crt /etc/ssl/certs/
COPY ./Certificates/postgres.key /etc/ssl/private/

COPY ./postgresql.conf /tmp/
COPY ./pg_hba.conf /tmp/
