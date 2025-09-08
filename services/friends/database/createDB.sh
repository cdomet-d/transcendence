#!/bin/sh

DB_DIR="/usr/src/database"
DB_FILE="$DB_DIR/friends.db"
SEED_FILE="/usr/src/database/seed.sql"

# Create data directory if it doesn't exist
mkdir -p "$DB_DIR"

# Initialize database if it doesn't exist
if [ ! -f "$DB_FILE" ]; then
    echo "Creating SQLite database at $DB_FILE..."
    sqlite3 "$DB_FILE" < /usr/src/database/initDB.sql
    echo "Database created successfully!"
else
    echo "Database already exists at $DB_FILE"
fi

sqlite3 "$DB_FILE" < "$SEED_FILE" 2> /usr/src/database/seed_error.log


# Execute the command passed to the container (keeps it running)
exec "$@"