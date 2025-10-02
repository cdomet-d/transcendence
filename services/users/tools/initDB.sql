CREATE TABLE userProfile (
  userID INTEGER PRIMARY AUTOINCREMENT KEY NOT NULL,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  profileColor TEXT,
  activityStatus INTEGER,
  lastConnexion DATETIME
);

CREATE TABLE userStats (
  userID INTEGER PRIMARY KEY NOT NULL,
  longestMatch INTEGER,
  shorestMatch INTEGER,
  totalMatch INTEGER,
  totalWins INTEGER,
  winStreak INTEGER,
  averageMatchDuration INTEGER, --time in secondes
  highestScore INTEGER
);
