#!/bin/sh

DB_DIR="/usr/src/app/data"
DB_FILE="$DB_DIR/app.db"

# Create data directory if it doesn't exist
mkdir -p "$DB_DIR"

# Initialize database if it doesn't exist
if [ ! -f "$DB_FILE" ]; then
    echo "Creating SQLite database at $DB_FILE..."
    sqlite3 "$DB_FILE" < /usr/src/app/init_db.sql
    echo "Database created successfully!"
	.data/testdb.sh
else
    echo "Database already exists at $DB_FILE"
fi

# Execute the command passed to the container (keeps it running)
exec "$@"