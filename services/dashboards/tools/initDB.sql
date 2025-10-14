CREATE TABLE gameMatchInfo (
  gameID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  duration INTEGER,
  startTime DATETIME,
  gameStatus INTEGER, --game is still in lobby, game started, game ended
  winnerID INTEGER,
  loserID INTEGER,
  tournamentID INTEGER, --zero == no tournament 
  localGame BOOLEAN, --zero == local, 1 == remote
  scoreWinner INTEGER,
  scoreLoser INTEGER
);

CREATE TABLE tournamentInfo (
  tournamentID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
  winnerID INTEGER,
  playerIDs TEXT -- Stores a JSON array like '[1, 5, 12, 23]'
);
