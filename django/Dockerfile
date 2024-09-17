FROM python:3.9-slim

WORKDIR /app/pingpong

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000
# Collect the Django static files
# RUN python3 manage.py collectstatic --no-input

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

#CMD ["tail", "-f", "/dev/null"]
