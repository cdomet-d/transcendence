all: stop
	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Building vanilla images..."
	@docker compose build

backup: stop
	@docker compose build

re: fclean all

reback: fclean backup

clean: stop
	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Removing stale logs..."
	@rm -rf ./logs
	@docker system prune -f

fclean: clean
	@docker system prune -a -f
	@docker volume rm db-data wp-data || true

run: stop all
	@docker compose up -d
	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Generating logs, please hold..."
	@sleep 2
	@sh .scripts/genlog.sh

stop:
	@docker compose stop
	@docker compose down

# setenv:
# 	@printf "$(BG)\n%-8s$(RE) %s\n" "[INFO]" "Running environnement deployment script..."
# 	@sh .scripts/setenv.sh

help:
	@printf "\n$(BB)%s$(RE)\n" "Welcome to Inception!"
	@printf "$(BU)%s$(RE)\n\n" "Make Rules:"
	@printf "$(BG)%-15s$(RE) %s\n" "all"       "create default images"
	@printf "$(BG)%-15s$(RE) %s\n" "backup"    "create images based on a database dump - the dump file should be named dump.sql and placed at the root of the user's session"
	@printf "$(BG)%-15s$(RE) %s\n" "re"        "rebuild all the containers with default configuration after deleting the local volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "reback"    "rebuild all the containers with database dump configuration after deleting the local volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "clean"     "stop containers, removes logs, stopped containers, dangling images and unused networks & build cache"
	@printf "$(BG)%-15s$(RE) %s\n" "fclean"    "see clean, except it also deletes all the cache & all images without a container associated and the content of the volumes"
	@printf "$(BG)%-15s$(RE) %s\n" "run"       "ups the containers in detached mode: (docker compose up -d) and generates the logs"
	@printf "$(BG)%-15s$(RE) %s\n" "stop"      "stops & downs containers"

.PHONY: help all re clean fclean run stop backup reback

# Bold blue
BB:=\033[1;34m

# Bold and underline 
BU:=\033[1;4m

# Bold green (for rule names)
BG:=\033[1;32m

# Reset all formatting and color
RE:=\033[0m