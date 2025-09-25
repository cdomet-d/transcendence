CREATE TABLE gameMatchInfo (
  gameID INTEGER,
  duration INTEGER,
  startTime DATETIME,
  status INTEGER, --game is still in lobby, game started, game ended
  hostID INTEGER,
  winnerID INTEGER,
  invitedID INTEGER,
  PRIMARY KEY (gameID),
  FOREIGN KEY (hostID) REFERENCES userProfile(userID),
  FOREIGN KEY (winnerID) REFERENCES userProfile(userID),
  FOREIGN KEY (invitedID) REFERENCES userProfile(userID)
);

CREATE TABLE gameLobby (
  lobbyID INTEGER,
  status BOOLEAN, --false == not ready to start game, true == ready to start game
  PRIMARY KEY (lobbyID)  
);