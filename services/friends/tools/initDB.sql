 CREATE TABLE friendship (
  friendshipID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  userID INTEGER, --user who asked for the friendship
  friendID INTEGER, --receiver of invite for friendship
  startTimeFriendship DATETIME,
  statusFrienship BOOLEAN --false == pending friendship, true == actual friendship
);