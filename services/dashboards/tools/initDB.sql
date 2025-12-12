CREATE TABLE game (
  ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  gameID TEXT UNIQUE,
  duration INTEGER,
  startTime TEXT,
  player1 TEXT,
  player2 TEXT,
  tournamentID TEXT,
  localGame BOOLEAN,
  player1Score INTEGER,
  player2Score INTEGER
);

CREATE TABLE tournament (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    tournamentID TEXT UNIQUE,
    nbPlayers INTEGER NOT NULL CHECK(nbPlayers = 4),
    tournamentStatus INTEGER NOT NULL DEFAULT 0, 
    winnerID INTEGER,
    creationTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);