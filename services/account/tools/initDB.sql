CREATE TABLE account (
	userID INTEGER PRIMARY KEY,
	hashedPassword TEXT,
	username TEXT UNIQUE,
	userStatus INTEGER,
	registerDate TEXT,
	defaultLang TEXT
);