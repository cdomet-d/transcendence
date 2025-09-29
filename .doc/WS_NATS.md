match:
    -   matchID
    -   users[]:
        -   user1: userObject
        -   user2: userObject

user:
    -   userID
    -   username
    -   tempUser: bool


PreGame -> NATS:

pregame.    local.      2.   create
pregame.    remote.     2.   create

pregame.    remote.     4.   create
pregame.    remote.     8.   create


           ||local  |remote |
-----------------------------
quick      || 1vs1  | 1vs1  |
-----------------------------
tournament || ##### |  4/8  |
-----------------------------


PreGame -> Game:

{
    user:
        -   username
        -   userID
}

{
    match:
    -   matchID
    -   tournamentID <!-- 0 if quick match -->
    -   local: bool
    -   users[]
    -   score 
    -   winner
    -   loser
}


tournament {
    - tournamentID
    - winnerID
    - match[]
}
