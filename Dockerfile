FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app/pingpong

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code into the container
COPY . .

# Collect the Django static files
RUN python3 manage.py collectstatic --no-input

# Expose the port that the Django app will run on (usually 8000)
EXPOSE 8000

# Set the command to start the Django development server

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 

#CMD ["tail", "-f", "/dev/null"]