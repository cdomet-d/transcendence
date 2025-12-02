import type { FastifyInstance } from 'fastify';

export interface GameInput {
	player1: number;
	player2: number;
	player1Score: number;
	player2Score: number;
	longuestPass: number;
	duration: number;
}

export interface userStats {
	userID: number;
	longestMatch: number;
	shortestMatch: number;
	totalMatch: number;
	totalWins: number;
	winStreak: number;
	averageMatchDuration: number;
	longuestPass: number;
	[key: string]: number;
}

function calculateStats(current: userStats, isWinner: boolean, duration: number, matchLongestPass: number): userStats {
	const newTotalMatches = current.totalMatch + 1;
	const newTotalWins = current.totalWins + (isWinner ? 1 : 0);

	const newWinStreak = isWinner ? (current.winStreak + 1) : 0;

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
		winStreak: newWinStreak,
		averageMatchDuration: newAverageDuration,
		longuestPass: newLongestPass
	};
}

export async function updateUserStats(serv: FastifyInstance, userID: number, isWinner: boolean, gameData: GameInput) {
	if (userID === -1)
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
			winStreak = ?,
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
		newStats.winStreak,
		newStats.averageMatchDuration,
		newStats.longuestPass,
		userID
	];

	await serv.dbUsers.run(query, params);
}