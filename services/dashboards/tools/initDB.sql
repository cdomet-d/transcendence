CREATE TABLE game (
  ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  gameID TEXT UNIQUE,
  duration INTEGER,
  startTime DATETIME,
  player1 TEXT,
  player2 TEXT,
  tournamentID TEXT, --zero == no tournament
  localGame BOOLEAN, --zero == local, 1 == remote
  player1Score INTEGER,
  player2Score INTEGER
);

CREATE TABLE tournament (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    tournamentID TEXT UNIQUE,
    nbPlayers INTEGER NOT NULL CHECK(nbPlayers = 4 OR nbPlayers = 8), -- Enforces 4 or 8 players
    tournamentStatus INTEGER NOT NULL DEFAULT 0, -- 0: Pending, 1: In Progress, 2: Completed
    winnerID INTEGER, -- The ID of the winning player, NULL until completed
    creationTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);