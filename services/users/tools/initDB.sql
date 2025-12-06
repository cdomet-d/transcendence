CREATE TABLE userProfile (
  ID INTEGER PRIMARY KEY NOT NULL UNIQUE,
  userID TEXT,
  username TEXT,
  avatar TEXT,
  biography TEXT,
  profileColor TEXT,
  activityStatus BOOLEAN,
  userRole INTEGER,
  since TEXT,
  lang TEXT
);

CREATE TABLE userStats (
  ID INTEGER PRIMARY KEY NOT NULL,
  userID TEXT,
  longestMatch INTEGER,
  shortestMatch INTEGER,
  totalMatch INTEGER,
  totalWins INTEGER,
  winStreak INTEGER,
  averageMatchDuration INTEGER, --time in secondes
  longuestPass INTEGER --time in secondes
);
