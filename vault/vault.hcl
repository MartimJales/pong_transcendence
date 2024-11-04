storage "raft"
{
	path = "/vault/data"
}

listener "tcp"
{
	address = "0.0.0.0:8200"
	tls_cert_file = "/etc/ssl/certs/vault.crt"
	tls_cert_key = "/etc/ssl/private/vault.key"
}

api_addr = "https://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"
disable_mlock = true
