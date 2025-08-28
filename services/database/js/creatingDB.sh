#!/bin/sh
DB_FILE="/usr/src/app/app.db"
if [ ! -f "$DB_FILE" ]; then
    echo "Creating SQLite database..."
    sqlite3 $DB_FILE < /usr/src/app/init_db.sql
fi

# Exec the default CMD or keep the container running. For example:
# If no argument, just keep it running with a shell:
if [ "$#" -eq 0 ]; then
    exec sh
else
    exec "$@"
fi
