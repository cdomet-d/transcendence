all: stop
	@docker compose -f docker-compose.yaml build

re: fclean all

test: stop
	@docker compose -f docker-compose-test.yaml build
	@docker compose -f docker-compose-test.yaml up -d

clean: stop
	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Removing stale log..."
	@rm -rf ./.docker-log/
	@docker system prune -f

cleandb:
	@rm services/accessibility/data/*.db
	@rm services/auth/data/*.db
	@rm services/dashboards/data/*.db
	@rm services/friends/data/*.db
	@rm services/users/data/*.db

fclean: clean
	@docker system prune -a -f

run: stop all
	@docker compose up -d

stop:
	@docker compose stop
	@docker compose down

log:
	@mkdir -p ./.docker-log/
	@docker compose logs > .docker-log/cont.log

watchlog: 
	@docker compose logs -f

help:
	@printf "\n$(BB)%s$(RE)\n" "Welcome to Transcendence!"
	@printf "$(BU)%s$(RE)\n\n" "Make Rules:"
	@printf "$(BG)%-15s$(RE) %s\n" "all"       "create default images"
	@printf "$(BG)%-15s$(RE) %s\n" "re"        "rebuild all the containers with default configuration after deleting the local volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "clean"     "stop containers, removes log, stopped containers, dangling images and unused networks & build cache"
	@printf "$(BG)%-15s$(RE) %s\n" "fclean"    "see clean, except it also deletes all the cache & all images without a container associated and the content of the volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "run"       "ups the containers in detached mode: (docker compose up -d) and generates the log"
	@printf "$(BG)%-15s$(RE) %s\n" "stop"      "stops & downs containers"

.PHONY: help all re clean fclean run stop  

# Bold blue
BB:=\033[1;34m

# Bold and underline 
BU:=\033[1;4m

# Bold green (for rule names)
BG:=\033[1;32m

# Reset all formatting and color
RE:=\033[0m