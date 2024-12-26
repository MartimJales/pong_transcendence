# Makefile para gestão de contêineres, imagens e volumes Docker

# Alvo principal
all: gen_image

# Alvo para construir e iniciar o serviço
gen_image:
	docker-compose up --build

# Alvo para parar todos os contêineres em execução
stop_container:
	docker stop $$(docker ps -aq)

# Alvo para remover todos os contêineres parados
clean_container: stop_container
	docker rm $$(docker ps -aq)

# Alvo para remover todas as imagens
clean_image:
	docker rmi $$(docker images -q)

# Alvo para remover todos os volumes
clean_volumes:
	docker volume rm $$(docker volume ls -q)

# Alvo para limpar tudo: contêineres, imagens e volumes
fclean: clean_container clean_volumes

# Alvo para reconstruir tudo
re: fclean all
