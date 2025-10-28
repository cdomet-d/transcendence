CREATE TABLE account (
	userID INTEGER PRIMARY KEY,
	hashedPassword TEXT,
	username TEXT,
	userStatus INTEGER,
	registerDate TEXT,
	defaultLang TEXT
);