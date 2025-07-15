all:
	docker compose build

run: stop all
	docker compose up -d
	docker logs nginx > nginx-cont.log

stop:
	docker compose stop
	docker compose down