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
game.local.1v1.create

game.tournament.2players.create
game.tournament.4players.create


PreGame -> Game:
game.start
    {
        match:
        -   matchID
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