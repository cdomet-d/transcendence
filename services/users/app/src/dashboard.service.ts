import type { FastifyInstance } from 'fastify';

export interface GameInput {
	player1: string;
	player2: string;
	player1Score: number;
	player2Score: number;
	longuestPass: number;
	duration: number;
}

export interface userStats {
	userID: string;
	longestMatch: number;
	shortestMatch: number;
	totalMatch: number;
	totalWins: number;
	totalLosses: number;
	winstreak: number;
	averageMatchDuration: number;
	longuestPass: number;
	[key: string]: number | string;
}

function calculateStats(current: userStats, isWinner: boolean, duration: number, matchLongestPass: number): userStats {
	const newTotalMatches = current.totalMatch + 1;
	const newTotalWins = current.totalWins + (isWinner ? 1 : 0);
	const newTotalLosses = current.totalLosses + (isWinner ? 0 : 1)

	const newWinStreak = isWinner ? (current.winstreak + 1) : 0;

	const newLongestMatch = Math.max(current.longestMatch, duration);
	console.log(`${current.shortestMatch}`);

	const newShortestMatch = (current.shortestMatch === 0)
		? duration
		: Math.min(current.shortestMatch, duration);

	const totalTimePlayed = (current.averageMatchDuration * current.totalMatch) + duration;
	const newAverageDuration = Math.floor(totalTimePlayed / newTotalMatches);

	const newLongestPass = Math.max(current.longuestPass, matchLongestPass);

	console.log(`${newShortestMatch}`);
	return {
		userID: current.userID,
		longestMatch: newLongestMatch,
		shortestMatch: newShortestMatch,
		totalMatch: newTotalMatches,
		totalWins: newTotalWins,
		totalLosses: newTotalLosses,
		winstreak: newWinStreak,
		averageMatchDuration: newAverageDuration,
		longuestPass: newLongestPass
	};
}

export async function updateUserStats(serv: FastifyInstance, userID: string, isWinner: boolean, gameData: GameInput) {
	if (userID === "temporary")
		return ;
	
	let currentStats = await serv.dbUsers.get<userStats>(
		'SELECT * FROM userStats WHERE userID = ?',
		[userID]
	);

	if (!currentStats)
		throw new Error(`Stats not found for user ${userID}`);

	const newStats = calculateStats(currentStats, isWinner, gameData.duration, gameData.longuestPass);

	const query = `
		UPDATE userStats SET 
			longestMatch = ?,
			shortestMatch = ?,
			totalMatch = ?,
			totalWins = ?,
			totalLosses = ?,
			winstreak = ?,
			averageMatchDuration = ?,
			longuestPass = ?
		WHERE userID = ?
	`;
	console.log(`${newStats.shortestMatch}`);
	const params = [
		newStats.longestMatch,
		newStats.shortestMatch,
		newStats.totalMatch,
		newStats.totalWins,
		newStats.totalLosses,
		newStats.winstreak,
		newStats.averageMatchDuration,
		newStats.longuestPass,
		userID
	];

	await serv.dbUsers.run(query, params);
}