CREATE TABLE userProfile (
  userID INTEGER,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  profileColor TEXT,
  activityStatus INTEGER
  lastConnexion DATETIME,
  PRIMARY KEY (userID)
);

CREATE TABLE userStats (
  userID INTEGER,
  longestMatch INTEGER,
  shorestMatch INTEGER,
  totalMatch INTEGER,
  totalWins INTEGER,
  winStreak INTEGER,
  averageMatchDuration INTEGER, --time in secondes
  highestScore INTEGER,
  PRIMARY KEY (userID)
);