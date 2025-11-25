CREATE TABLE gameMatchInfo (
  ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  gameID INTEGER,
  duration INTEGER,
  startTime DATETIME,
  gameStatus INTEGER, --game is still in lobby == 0, game started == 1, game ended == 2
  player1 INTEGER,
  player2 INTEGER,
  tournamentID INTEGER, --zero == no tournament
  localGame BOOLEAN, --zero == local, 1 == remote
  player1Score INTEGER,
  player2Score INTEGER
);

CREATE TABLE tournaments (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    tournamentID INTEGER,
    nbPlayers INTEGER NOT NULL CHECK(nbPlayers = 4 OR nbPlayers = 8), -- Enforces 4 or 8 players
    tournamentStatus INTEGER NOT NULL DEFAULT 0, -- 0: Pending, 1: In Progress, 2: Completed
    winnerID INTEGER, -- The ID of the winning player, NULL until completed
    creationTime DATETIME NOT NULL DEFAULT
);