FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# Optionally, copy static and media directories to the container
# RUN mkdir -p /app/static /app/media
# COPY static/ /app/static/
# COPY media/ /app/media/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]