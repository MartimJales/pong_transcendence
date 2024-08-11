all: pull_image gen_image run

pull_image:
	docker pull python:3.9-slim

gen_image:
	docker build -t trans .

run:
	docker run -p 8080:8000 --name p1 trans

stop_container:
	docker stop p1

clean_container: stop_container
	docker rm p1

clean_image:
	docker rmi trans

fclean: clean_container clean_image

re: fclean all
