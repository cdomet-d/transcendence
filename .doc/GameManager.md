
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

{
    lobbyInfo:
    -   users[]
    -   remote
    -   tournament
    -   gameSettings
}

{
    user:
    -   username
    -   userID
}


tournament {
    - tournamentID
    - winnerID
    - match[] <!-- THIS IS THE BRACKET -->
}

{
    match:
    -   matchID
    -   tournamentID <!-- 0 if quick match -->
    -   remote: bool
    -   userIDs[]
    -   score 
    -   winner
    -   loser
}


<!-- {
    gameSettings:
    -   paddle speed
    -   ball speed
    -   map
} -->


Lobby >> lobbyInfo >> GM

GM  >> processGameRequest() >> makeBracket + tournamentObj
    >> TrackTournamentState() >> send gameObj 1 by 1 >> PONG