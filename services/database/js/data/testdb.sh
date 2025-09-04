#!/bin/sh

DB="app.db"

sqlite3 $DB <<EOF
INSERT INTO usersAuth (userID, hashedPassword, username, email, registerDate) VALUES (1, 'passhash', 'user1', 'user1@example.com', '2025-09-04');
INSERT INTO userProfile (userID, username, avatar, bio, profileColor, inGame, state, isOnline, lastConnexion) VALUES (1, 'user1', 'avatar1.png', 'Bio of user1', 'blue', 0, 1, 1, '2025-09-04 13:00:00');
INSERT INTO userStats (userID, longestMatch, shorestMatch, totalMatch, totalWins, totalLoses, winStreak, averageMatchDuration, highestScore) VALUES (1, 120, 30, 10, 6, 4, 3, 60, 200);
INSERT INTO blockedUsers (blockedID, blockingUserID, blockedUserID) VALUES (1, 1, 2);
INSERT INTO friendship (friendshipID, userID, friendID, startTimeFriendship, status) VALUES (1, 1, 2, '2025-09-01 10:00:00', 1);
INSERT INTO gameMatchInfo (gameID, duration, startTime, status, hostID, winnerID, invitedID) VALUES (1, 90, '2025-09-04 12:00:00', 2, 1, 1, 2);
INSERT INTO gameLobby (lobbyID, status) VALUES (1, 1);
EOF

{
  echo "usersAuth:"
  sqlite3 $DB "SELECT * FROM usersAuth;"

  echo ""
  echo "userProfile:"
  sqlite3 $DB "SELECT * FROM userProfile;"

  echo ""
  echo "userStats:"
  sqlite3 $DB "SELECT * FROM userStats;"

  echo ""
  echo "blockedUsers:"
  sqlite3 $DB "SELECT * FROM blockedUsers;"

  echo ""
  echo "friendship:"
  sqlite3 $DB "SELECT * FROM friendship;"

  echo ""
  echo "gameMatchInfo:"
  sqlite3 $DB "SELECT * FROM gameMatchInfo;"

  echo ""
  echo "gameLobby:"
  sqlite3 $DB "SELECT * FROM gameLobby;"
} > output_log.txt 2>&1
