stop:
	docker compose stop
	docker compose down

run:
	docker compose build
	docker compose up -d