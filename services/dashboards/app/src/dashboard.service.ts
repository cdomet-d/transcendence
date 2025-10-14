import { Database } from "sqlite";

export async function getGame(db: Database, userID: number): Promise< boolean > {
	const query = `
		SELECT
			gameID,
			duration,
			startTime,
			winnerID,
			loserID,
			scoreWinner,
			scoreLoser,
			CASE
				WHEN winnerID = ? THEN loserID
				ELSE winnerID
			END AS opponentID
		FROM
			gameMatchInfo
		WHERE
			(winnerID = ? OR loserID = ?)
			AND gameStatus = 2; -- Ensures you only get completed games
			`;

	const params = [userID, userID, userID];

	const matches = await db.all(query, params);

	return (matches);
};

export async function getGameHistory(db: Database, userID: number): Promise<Match[]> {
    const query = `
        SELECT
            gameID,
            duration,
            startTime,
            winnerID,
            loserID,
            scoreWinner,
            scoreLoser,
            CASE
                WHEN winnerID = ? THEN loserID
                ELSE winnerID
            END AS opponentID
        FROM
            gameMatchInfo
        WHERE
            (winnerID = ? OR loserID = ?)
            AND gameStatus = 2;
    `;

    const params = [userID, userID, userID];
    const matches = await db.all<Match[]>(query, params);

    // ✅ Return the array of matches
    return matches;
};