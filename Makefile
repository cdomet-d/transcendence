help:
	@printf "\n$(BB)%s$(RE)\n" "Welcome to Transcendence!"
	@printf "$(BU)%s$(RE)\n\n" "Make Rules:"
	@printf "$(BG)%-15s$(RE) %s\n" "env"       "creates and populates the .env file"
	@printf "$(BG)%-15s$(RE) %s\n" "all"       "create default images"
	@printf "$(BG)%-15s$(RE) %s\n" "re"        "rebuild all the containers with default configuration after deleting the local volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "clean"     "stop containers, removes log, stopped containers, dangling images and unused networks & build cache"
	@printf "$(BG)%-15s$(RE) %s\n" "fclean"    "see clean, except it also deletes all the cache & all images without a container associated and the content of the volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "run"       "ups the containers in detached mode: (docker compose up -d) and generates the logs"
	@printf "$(BG)%-15s$(RE) %s\n" "stop"      "stops & downs containers"
	@printf "$(BG)%-15s$(RE) %s\n" "watchlog"  "run `docker compose logs -f`"

all: stop
	@docker compose -f docker-compose.yaml build

re: fclean all

clean: stop
	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Removing stale logs..."
	@rm -rf ./.docker-log/
	@docker system prune -f

fclean: clean
	@rm -f ./services/*/data/*.db
	@docker system prune -a -f

run: stop all
	@docker compose up -d

stop:
	@docker compose stop
	@docker compose down --remove-orphans

env: 
	bash .scripts/gen-env.sh

watchlog: 
	@docker compose logs -f


.PHONY: help all re clean fclean run stop  

# Bold blue
BB:=\033[1;34m

# Bold and underline 
BU:=\033[1;4m

# Bold green (for rule names)
BG:=\033[1;32m

# Reset all formatting and color
RE:=\033[0m