FROM python:3.9-slim

WORKDIR /app/pingpong

COPY ./requirements.txt .
COPY ./Certificates/pac4_ca.crt /usr/share/ca-certificates/
COPY ./Certificates/django.crt /etc/ssl/certs/
COPY ./Certificates/django.key /etc/ssl/private/

RUN pip install --no-cache-dir -r requirements.txt
RUN update-ca-certificates

COPY . /app/

# Collect the Django static files
# RUN python3 manage.py collectstatic --no-input

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
