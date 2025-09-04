CREATE TABLE usersAuth (
  userID INTEGER PRIMARY KEY,
  hashedPassword TEXT,
  username TEXT,
  email TEXT,
  registerDate TEXT
);

--CREATE TABLE userProfile(FOREIGN KEY(userID) REFERENCES usersAuth PRIMARY KEY,
--						avatar text NULL,
--						bio VARCHAR NULL,
--						profileColor VARCHAR,
--						inGame boolean,
--						state integer,
--						FOREIGN KEY (username) REFERENCES usersAuth,
--						isOnline boolean,
--						lastConnexion DATETIME);
