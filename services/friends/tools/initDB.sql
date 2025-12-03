 CREATE TABLE friendship (
  friendshipID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  userID TEXT, --user who asked for the friendship
  friendID TEXT, --receiver of invite for friendship
  statusFriendship BOOLEAN, --false == pending friendship, true == actual friendship
  UNIQUE(userID, friendID)
);
