CREATE TABLE userProfile (
  userID INTEGER PRIMARY KEY  NOT NULL,
  username TEXT UNIQUE,
  avatar TEXT,
  bio TEXT,
  profileColor TEXT,
  activityStatus INTEGER,
  lastConnection DATETIME
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
