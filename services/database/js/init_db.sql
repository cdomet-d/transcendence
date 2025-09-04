CREATE TABLE usersAuth (
  userID INTEGER PRIMARY KEY,
  hashedPassword TEXT,
  username TEXT UNIQUE,
  email TEXT,
  registerDate TEXT
);

CREATE TABLE userProfile (
  userID INTEGER,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  profileColor TEXT,
  inGame BOOLEAN,
  state INTEGER,
  isOnline BOOLEAN,
  lastConnexion DATETIME,
  PRIMARY KEY (userID),
  FOREIGN KEY (userID) REFERENCES usersAuth(userID),
  FOREIGN KEY (username) REFERENCES usersAuth(username) ON UPDATE CASCADE
);

CREATE TABLE userStats (
  userID INTEGER,
  longestMatch INTEGER,
  shorestMatch INTEGER,
  totalMatch INTEGER,
  totalWins INTEGER,
  totalLoses INTEGER,
  winStreak INTEGER,
  averageMatchDuration INTEGER, --time in secondes
  highestScore INTEGER,
  PRIMARY KEY (userID),
  FOREIGN KEY(userID) REFERENCES userProfile(userID),
);

CREATE TABLE blockedUsers (
  blockedID INTEGER,
  blockingUserID INTEGER,
  blockedUserID INTEGER,
  PRIMARY KEY (blockedID),
  FOREIGN KEY (blockingUserID) REFERENCES usersAuth(userID),
  FOREIGN KEY (blockedUserID) REFERENCES usersAuth(userID)
);

CREATE TABLE friendship (
  friendshipID INTEGER,
  userID INTEGER, --user who asked for the friendship
  friendID INTEGER, --receiver of invite for friendship
  startTimeFriendship DATETIME,
  status BOOLEAN, --false == pending friendship, true == actual friendship
  PRIMARY KEY(friendshipID),
  FOREIGN KEY (userID) REFERENCES usersAuth(userID),
  FOREIGN KEY (friendID) REFERENCES usersAuth(userID)
);

CREATE TABLE gameMatchInfo (
  gameID INTEGER,
  duration INTEGER,
  startTime DATETIME,
  status INTEGER, --game is still in lobby, game started, game ended
  hostID INTEGER,
  winnerID INTEGER,
  invitedID INTEGER,
  PRIMARY KEY (gameID),
  FOREIGN KEY (hostID) REFERENCES userProfile(userID),
  FOREIGN KEY (winnerID) REFERENCES userProfile(userID),
  FOREIGN KEY (invitedID) REFERENCES userProfile(userID)
);

CREATE TABLE gameLobby (
  lobbyID INTEGER,
  status BOOLEAN, --false == not ready to start game, true == ready to start game
  PRIMARY KEY (lobbyID)  
);