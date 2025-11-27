 CREATE TABLE friendship (
  friendshipID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  userID INTEGER, --user who asked for the friendship
  friendID INTEGER, --receiver of invite for friendship
  statusFriendship BOOLEAN, --false == pending friendship, true == actual friendship
  UNIQUE(userID, friendID)
);
