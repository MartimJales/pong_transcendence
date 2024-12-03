storage "raft"
{
	path = "/vault/data"
}

listener "tcp"
{
	address = "0.0.0.0:8200"
	cluster_address = "0.0.0.0:8201"
	tls_cert_file = "/etc/ssl/certs/vault.crt"
	tls_key_file = "/etc/ssl/private/vault.key"
	tls_client_ca_file = "/etc/vault.d/ca-certificates/pac4_ca.crt"
}

api_addr = "https://vault_container:8200"
cluster_addr = "https://vault_container:8201"
disable_mlock = true
