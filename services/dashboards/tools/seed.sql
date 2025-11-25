 INSERT INTO tournament (
		tournamentID,
		nbPlayers,
		tournamentStatus,
		winnerID)
	VALUES (94151,
			4,
			2,
			1);
 INSERT INTO game (
		gameID, 
		duration, 
		startTime, 
		player1, 
		player2, 
		tournamentID, 
		localGame, 
		player1Score, 
		player2Score)
	VALUES (
		59625,
		80,
		'2025-09-04 12:00:00',
		1,
		2,
		-1,
		0,
		4,
		2);
