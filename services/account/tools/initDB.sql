  CREATE TABLE usersAuth (
    userID INTEGER PRIMARY KEY,
    hashedPassword TEXT,
    username TEXT UNIQUE,
    userStatus INTEGER,
    registerDate TEXT --TODO change this to datetime
  );
