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
game.local.2players.create
game.local.4players.create
game.local.8players.create

game.remote.2players.create
game.remote.4players.create
game.remote.8players.create


PreGame -> Game:
game.start
    {
        match:
        -   matchID
        -   tournamentID <!-- 0 if quick match -->
        -   score
        -   local: bool
        -   users[]:
            -   user1:
                -   username
                -   userID
            -   user2:
                -   username
                -   userID
        -   winner
        -   loser
    }

match.userID.score


sessionID
if local >> same sessionID, different userID