 CREATE TABLE friendship (
  friendshipID INTEGER,
  userID INTEGER, --user who asked for the friendship
  friendID INTEGER, --receiver of invite for friendship
  startTimeFriendship DATETIME,
  statusFrienship BOOLEAN, --false == pending friendship, true == actual friendship
  PRIMARY KEY(friendshipID)
);