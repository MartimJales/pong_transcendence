FROM python:3.9-slim

WORKDIR /app/pingpong

# Installing all necessary the Django Python module and its dependencies
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# SSL certificates for comunicating with other containers in the Docker
# network via HTTPS
COPY ./Certificates/pac4_ca.crt /usr/local/share/ca-certificates/
COPY ./Certificates/django.crt /etc/ssl/certs/
COPY ./Certificates/django.key /etc/ssl/private/
RUN update-ca-certificates

# Placing all the website files to the correct directory
COPY . /app/

# Initializing the website's server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
