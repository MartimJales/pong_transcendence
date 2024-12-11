#!/bin/bash

# Linking CRS files to a different location and applying custom configuration
ln -s /opt/owasp-crs /usr/local/owasp-crs
mv /modsecurity.tmp.d/crs-setup.conf /usr/local/owasp-crs/

# Renaming example files to be functional
for f in /usr/local/owasp-crs/rules/*.example; do
	mv -- "$f" "${f%.example}"
done

# Applying ModSecurity configuration
mkdir /etc/nginx/modsecurity
ln -s /etc/modsecurity.d/unicode.mapping /etc/nginx/modsecurity/unicode.mapping
mv /modsecurity.tmp.d/main.conf /etc/nginx/modsecurity/
mv /modsecurity.tmp.d/modsecurity.conf /etc/nginx/modsecurity/
