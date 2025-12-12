#!/bin/sh

DB_DIR="/usr/data"
DB_FILE="$DB_DIR/stats.db"

# Create data directory if it doesn't exist
mkdir -p "$DB_DIR"

# Initialize database if it doesn't exist
if [ ! -f "$DB_FILE" ]; then
    echo "Creating SQLite database at $DB_FILE..."
    sqlite3 "$DB_FILE" < /usr/local/bin/initDB.sql
    echo "[STARTUP] Database created successfully!"
else
    echo "[STARTUP] Database already exists at $DB_FILE"
fi

# Execute the command passed to the container (keeps it running)
exec "$@"