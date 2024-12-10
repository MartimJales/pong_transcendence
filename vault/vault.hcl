storage "file"
{
	path = "/vault/data"
}

listener "tcp"
{
	address = "0.0.0.0:8200"
	tls_cert_file = "/etc/ssl/certs/vault.crt"
	tls_key_file = "/etc/ssl/private/vault.key"
}

api_addr = "https://vault_container:8200"
disable_mlock = true
