CREATE TABLE userProfile (
  userID INTEGER PRIMARY KEY NOT NULL UNIQUE,
  username TEXT,
  avatar TEXT,
  biography TEXT,
  profileColor TEXT,
  activityStatus BOOLEAN,
  lastConnection DATETIME,
  userRole INTEGER,
  since TEXT,
  lang TEXT
);

CREATE TABLE userStats (
  userID INTEGER PRIMARY KEY NOT NULL,
  longestMatch INTEGER,
  shortestMatch INTEGER,
  totalMatch INTEGER,
  totalWins INTEGER,
  winStreak INTEGER,
  averageMatchDuration INTEGER, --time in secondes
  longuestPass INTEGER --time in secondes
);
