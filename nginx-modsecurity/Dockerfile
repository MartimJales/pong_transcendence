FROM owasp/modsecurity-crs:nginx

# For some reason, the "modsecurity-crs" image requires privillege escalation
USER root

# NGINX configuration
COPY nginx.conf /etc/nginx/
COPY Certificates/ft_transcendence.key /etc/ssl/private/
COPY Certificates/ft_transcendence.crt /etc/ssl/certs/

# WAF/ModSecurity configuration
COPY ModSecurity/ /modsecurity.tmp.d/
RUN /modsecurity.tmp.d/setup_modsecurity.sh
RUN rm -r /modsecurity.tmp.d/

EXPOSE 1080

ENTRYPOINT ["nginx", "-g", "daemon off;"]