#!/bin/sh

SCRIPT_DIR=$(dirname "$0")

DB_DIR="../data"
DB_FILE="$DB_DIR/testDB.db"

SEED_FILE="$SCRIPT_DIR/seed.sql"
INIT_FILE="$SCRIPT_DIR/initDB.sql"

mkdir -p "$DB_DIR"

if [ ! -f "$DB_FILE" ]; then
    echo "Creating TEST database at $DB_FILE..."
    sqlite3 "$DB_FILE" < "$INIT_FILE"
    echo "TEST database created successfully!"
else
    echo "TEST database already exists at $DB_FILE."
fi

sqlite3 "$DB_FILE" < "$SEED_FILE" 2> ../data/test_seed_error.logs

