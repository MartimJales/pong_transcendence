FROM owasp/modsecurity-crs:nginx

USER root

# NGINX configuration
COPY nginx.conf /etc/nginx/
COPY Certificates/ft_transcendence.key /etc/ssl/private/
COPY Certificates/ft_transcendence.crt /etc/ssl/certs/

# WAF/ModSecurity configuration
COPY ModSecurity/ /modsecurity.tmp.d/
RUN /modsecurity.tmp.d/setup_modsecurity.sh
RUN rm -r /modsecurity.tmp.d/

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]