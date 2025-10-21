import { Database } from "sqlite";
import type { Match, Tournament } from "./routes.js";

export async function getGame(db: Database, userID: number): Promise<boolean> {
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

	//TODO : fix that
	return (true);
	//return (matches);
};

export async function getGameHistory(db: Database, userID: number): Promise<Match[]> {
	const query = `
		SELECT
			gameID,
			duration,
			startTime,
			player1,
			player2,
			player1Score,
			player2Score,
			CASE
				WHEN player1 = ? THEN player2
				ELSE player1
			END AS opponentID
		FROM
			gameMatchInfo
		WHERE
			(player1 = ? OR player2 = ?)
			AND gameStatus = 2;
	`;

	const matches = await db.all<Match[]>(query, [userID, userID, userID]);
	return (matches);
};

export async function getTournamentHistory(db: Database, userID: number): Promise<Tournament[]> {
	const query =
		` SELECT
			t.tournamentID,
			t.winnerID
		FROM
			tournaments t
		WHERE
			t.tournamentID IN (
				SELECT DISTINCT
					gm.tournamentID
				FROM
					gameMatchInfo gm
				WHERE
					gm.player1 = ? OR gm.player2 = ?
		)
		ORDER BY
			t.creationTime DESC;
	`;

	const tournaments = await db.all<Tournament[]>(query, [userID, userID]);
	return (tournaments);
}