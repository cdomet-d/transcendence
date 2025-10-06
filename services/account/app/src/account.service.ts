import { Database } from "sqlite";

export async function checkUsernameUnique(db: Database, username: string): Promise< boolean > {
	try {
		console.log(1);
		const query = `
			SELECT username FROM usersAuth WHERE username = ? 
			`
		console.log(2);
		const result = await db.all(query, username);
		console.log(3);
		
		//true == username taken, false == username available
		return (!!result);
	} catch (error) {
		console.log(4);

		console.log(`Error fetching username availability for  ${username}: `, error)
		throw (error);
	}
};