CREATE TABLE account (
	userID INTEGER PRIMARY KEY AUTOINCREMENT,
	hashedPassword TEXT,
	username TEXT UNIQUE,
	userRole INTEGER,
	registerDate TEXT,
	defaultLang TEXT
);