Objects:

    match:
        -   matchID
        -   score
        -   users[]:
            -   user1: user object
            -   user2: user object

    user:
        -   userID
        -   username
        -   rank(?)
        -   temporaryAccount: bool


PreGame -> NATS:
game.   quick.local.2         .create
game.   tournament.remote.4   .create
game.   quick.local.8         .create

game.quick.remote.2.create
game.tournament.remote.4.create
game.tournament.remote.8.create


           ||local  |remote |
-----------------------------
quick      || 1vs1  | 1vs1  |
-----------------------------
tournament || 2/4/8 | 2/4/8 |
-----------------------------



PreGame -> Game:
game.start
    {
        match:
        -   matchID
        -   tournamentID <!-- 0 if quick match -->
        -   local: bool
        -   users[]:
            -   user1:
                -   username
                -   userID
            -   user2:
                -   username
                -   userID
        -   score 
        -   winner
        -   loser
    }

match.userID.score


sessionID
if local >> same sessionID, different userID