import { Database } from "sqlite";

export async function checkUsernameUnique(db: Database, username: string): Promise<boolean> {
	try {
		const query = `
			SELECT 1 FROM account WHERE username = ? LIMIT 1
		`;
		const response = await db.all(query, username);

		//true == username taken, false == username available
		return (response.length > 0);
	} catch (error) {
		console.log(4);

		console.log(`[ACCOUNT] Error fetching username availability for  ${username}: `, error)
		throw (error);
	}
};