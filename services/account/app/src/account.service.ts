import { Database } from "sqlite";

export async function checkUsernameUnique(db: Database, username: string): Promise< boolean > {
	try {
		const query = `
			SELECT 1 FROM usersAuth WHERE username = ? LIMIT 1
		`;
		const result = await db.all(query, username);
		
		//true == username taken, false == username available
		return (result.length > 0);
	} catch (error) {
		console.log(4);

		console.log(`Error fetching username availability for  ${username}: `, error)
		throw (error);
	}
};