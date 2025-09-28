CREATE TABLE usersAuth (
  userID INTEGER PRIMARY KEY,
  hashedPassword TEXT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  userStatus INTEGER,
  registerDate TEXT --TODO change this to datetime
);
