FROM postgres:13

# SSL certificates for comunicating with other containers in the Docker
# network via HTTPS
COPY ./Certificates/pac4_ca.crt /etc/postgresql-common/
COPY ./Certificates/postgres.crt /etc/ssl/certs/
COPY ./Certificates/postgres.key /etc/ssl/private/

# Changing permissions for private key. PostgreSQL requires very
# strict permissions for any permission it uses, so we need to set the
# "postgres" user and group as the owners of the private key while also
# changing its permissions as read and write to only the file owner.
RUN chown postgres:postgres /etc/ssl/private/postgres.key
RUN chmod 0600 /etc/ssl/private/postgres.key

# PostgreSQL configuration files. For the "setup_postgres.sh" to copy
# the configuration files for the correct directory, the files need
# to be owned by the "postgres" user and group.
COPY --chown=postgres:postgres ./postgresql.conf /tmp/
COPY --chown=postgres:postgres ./pg_hba.conf /tmp/

# Startup script, in charge of copying the configuration files to
# the proper locations after the container is properly initialized.
# The "postgres" container image's entrypoint automatically executes
# any script found inside the "/docker-entrypoint-initdb.d" directory.
COPY ./setup_postgres.sh /docker-entrypoint-initdb.d/
