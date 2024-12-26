FROM python:3.9-slim

ARG PACKAGES="	curl \
				jq" 

WORKDIR /app/pingpong

# Installing packages used by the setup script
RUN apt update && apt install -y $PACKAGES

# Installing all necessary the Django Python module and its dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# SSL certificates for comunicating with other containers in the Docker
# network via HTTPS
COPY ./Certificates/pac4_ca.crt /usr/share/ca-certificates/
COPY ./Certificates/django.crt /etc/ssl/certs/
COPY ./Certificates/django.key /etc/ssl/private/

# Placing all the website files to the correct directory
COPY . /app/

# Fetching Role and Secret ID's to connect to Vault and initializing 
# the website's server
COPY ./setup_django.sh /tmp/
ENTRYPOINT ["/bin/sh", "-c", "/tmp/setup_django.sh"]
