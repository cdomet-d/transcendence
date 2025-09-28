CREATE TABLE usersAuth (
  userID INTEGER PRIMARY KEY,
  hashedPassword TEXT,
  username TEXT UNIQUE,
  email TEXT,
  userStatus INTEGER,
  registerDate TEXT
);
