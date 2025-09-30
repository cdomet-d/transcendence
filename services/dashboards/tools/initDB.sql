CREATE TABLE gameMatchInfo (
  gameID INTEGER AUTOINCREMENT,
  duration INTEGER,
  startTime DATETIME,
  gameStatus INTEGER, --game is still in lobby, game started, game ended
  winnerID INTEGER,
  loserID INTEGER,
  tournamentID INTEGER,
  localGame BOOLEAN, --zero == local, 1 == remote
  scoreWinner INTEGER,
  scoreLoser INTEGER,
  PRIMARY KEY (gameID)
);

CREATE TABLE tournamentInfo {
  tournamentID INTEGER PRIMARY AUTOINCREMENT NOT NULL, 
  winnerID INTEGER,
  playerIDs TEXT -- Stores a JSON array like '[1, 5, 12, 23]'
}
