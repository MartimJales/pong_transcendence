#!/bin/bash

# Moving CRS files to correct location and applying custom configuration
mv /opt/owasp-crs/ /usr/local/
# mv crs-setup.conf /usr/local/owasp-crs/

# Renaming example files to be functional
for f in /usr/local/owasp-crs/rules/*.example; do
	mv -- "$f" "${f%.example}"
done

# Applying ModSecurity configuration
mkdir /etc/nginx/modsecurity
# mv modsecurity.conf /etc/nginx/modsecurity/
