FROM nginx:latest

COPY Certificates/localhost.key /etc/ssl/private
COPY Certificates/localhost.crt /etc/ssl/certs
COPY default.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]