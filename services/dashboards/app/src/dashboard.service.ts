import { Database } from "sqlite";
import type { Match, Tournament } from "./routes.js";

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