CREATE TABLE usersAuth (
  userID INTEGER PRIMARY KEY,
  hashedPassword TEXT,
  username TEXT UNIQUE,
  email TEXT,
  registerDate TEXT
);