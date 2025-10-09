CREATE TABLE usersAuth (
    userID INTEGER PRIMARY KEY,
    hashedPassword TEXT,
    username TEXT,
    userStatus INTEGER,
    registerDate TEXT
);