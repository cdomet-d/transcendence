CREATE TABLE account (
	userID INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT UNIQUE,
	hashedPassword TEXT,
	userRole INTEGER,
	registerDate TEXT,
	defaultLang TEXT
);