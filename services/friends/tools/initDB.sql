CREATE TABLE blockedUsers (
  blockedID INTEGER,
  blockingUserID INTEGER,
  blockedUserID INTEGER,
  PRIMARY KEY (blockedID),
);

CREATE TABLE friendship (
  friendshipID INTEGER,
  userID INTEGER, --user who asked for the friendship
  friendID INTEGER, --receiver of invite for friendship
  startTimeFriendship DATETIME,
  status BOOLEAN, --false == pending friendship, true == actual friendship
  PRIMARY KEY(friendshipID),
);