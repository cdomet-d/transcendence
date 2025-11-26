# Databases

There's is a total of 5 databases across the project which are the following :
| Container  | Name of DB |
| ------------- |:-------------:|
| Accessibility | languages.db |
| Users | users.db |
| Account | account.db |
| Friends | friends.db |
| Dashboard | stats.db |

Each database and linked logs has it's own isolated volume and is stored in the data/ directory of each sources files's container locally and in /usr/data inside of each container.
The sources files for database building are in /tools of each container's source directory. That where you will find the tables definition and tests but they will also be presented and explained here for better  readability.

![database.png](assets/database.png "This is a sample image.")

The correct methods for avoiding SQL injections is to NOT USE variable export for the query.
Bad SQL query (dangerous) :
```
	const word;
	const langCode;
sta
	const query = `
		SELECT translation FROM translations WHERE {$word} = ? AND {$language_code} = ?
	`;
	
	const result = await serv.dbLanguage.get(query);
```

Instead a good practice is to set variables in the query direcly when sending the query, not when building it.
It will look like this :
```
	const word;
	const langCode;

	const query = `
		SELECT translation FROM translations WHERE word = ? AND language_code = ?
	`;

	const result = await serv.dbLanguage.get(query, [word, langCode]);
```

## How do perfom a query 101

A query to a database will always be perfomed through a defined route of the API. 
To successfully perfom a query, we need to know a couple of things : 

* The url to query
* The parameters mandatory to provided
* Which reply code or data we expect

It's a function lol

### URLs 

[WIP as we are building the nginx configuration which will set the url format to the routes]

### Parameters

Depending on the format of the expected parameters for a request, a route will accepts them differently. You might see :

- `request.params`
    The parameter will be set in the called url directly. 
    If we want to use :
            
        /internal/users/:userID

    We will call the route like so : 

    ```
        const url = `http://users:2626/internal/users/<userID>/profile`;
    let response: Response
    try {
    	response = await fetch(url)
    } catch (error) {
    	log.error(`[BFF] User service is unreachable: ${error}`);
    	throw new Error('User service is unreachable.');
    }
    ```
    
    You can also export a variable in the url like so :
    `http://users:2626/internal/users/${userID}/profile`


- `request.body`

    ```
	const url = 'http://friends:1616/internal/friends/friendship';
	let response: Response;

	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ senderID, friendID })
		});
	} catch (error) {
		log.error(`[BFF] Friends service (sendrequest) is unreachable: ${error}`);
    }
    ```
    Here, the userIDs are sent as body (a json) in the fetch directly

- `request.query`

    ```
	const url = `http://friends:1616/internal/friends/friendships?userID=${userID}&status=friend`;
	let response: Response;

	try {
		response = await fetch(url);
	} catch (error) {
		log.error(`[BFF] User service is unreachable: ${error}`);
		throw new Error('User service is unreachable.');
	}
    ```

    Lastly, here the parameter are in the query of the request, meaning the parameters are not mandatory. 

## Accessibility

### General overview

The accessibily container holds the translation for each supported langangues (en, French and Spanish). 
There is only one table in this database : translations

The table has 4 column :
* ID &rarr; integer (__primary key__)
* word &rarr; text
* language_code &rarr; text 
* translation &rarr; text

The word column is meant to hold the key or phrase identifier. The language_code column holds the language code (dah), like "en" or "French". And lastly the translation will hold the translation of the word in it's targeted language code.
So for example we could have :
* word == "hello"
* language_code == "French"
* translation == "bonjour"

A SQL query to find the translation of a word would look like this :
```
SELECT translation FROM translations WHERE word = 'hello' AND language_code = 'French';

-- will return "bonjour"
```

The combination betweent the word column and the language_code column is a __natural key__. It's basically an identifier that is formed by the combination of existing data in the table. It has meaning and therefore might be subject of changes in the future.

We have the first column (ID) which I havn't mention yet. The column is there for multiple reasons. First, it is good pratice in SQL to keep an unmutable ID for each row of a table. It's known as a __surrogate key__, which only purpose is to uniquely identify a row in a database. It has absolutely zero meaning data wise. We use this surrogate key because the natural key can change. So having a stable, meaningless ID ensure we can always reliably reference a row in the table, which is mandatory for stability.
It can also be used for easy modification. Since the natural key is a combination of other data in the table, it can be easier to make a SQL query looking for an integer than combination of two texts.
Lasty, even is the table will remain pretty small, being able to make shorter, simpler queries also improves perfomances. It can make sense to simplify queries where we can when we have several databases, to maximise of perfomances for much more daunting tasks.

### Usage and associated functions

This databases won't have a function to update the data via the code. 
To add translation I think the best course of action will be to directly modify the seed.sql which adds data to the database at launch.

## Users

### General overview

The users container holds the data for a user's profile such as the biography, profile picture, online status and so forth.
The goal here is not to hold account info (like password), those informations will be handle in the account microservice.

The tables in this database are pretty straight forward. I will elaborate on a couple column that need explanation in my opinion

We have two tables here :
* userProfile
* userStat

#### userProfile

This table has the following column :
* userID &rarr; integer (__primary key__)
* username &rarr; text
* avatar &rarr; text
* biography &rarr; text
* profileColor &rarr; text
* activityStatus &rarr; boolean 
* lastConnexion &rarr; datetime

userID will match between different table and database and if a general ID for a user.

activityStatus will be used to keep track of whether the user if offline, online or playing. The following value and meaning will be :

| Value  | Meaning |
| ------ |:-------:|
|   0    | offline |
|   1    | online  |

#### userStats

This table has the following column :
* userID &rarr; integer (__primary key__)
* longestMatch &rarr; integer
* shorestMatch &rarr; integer
* totalMatch &rarr; integer
* totalWins &rarr; integer
* winStreak &rarr; integer
* averageMatchDuration &rarr; integer
* longuestPass &rarr; integer

We don't have totalLosses because it can easily be computed by totalMatch and totalWin so we remove so useless SQL queries by not storing totalLosses.

averageMatchDuration will be in seconds.

### Routes

#### GET

* **GET fetch userProfile with userID** : `/internal/users/:userID`

    userID send as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   200    | profile found  |

* **GET fetch userProfile with username** :  `/internal/users`

    userID send as `request.query`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   400    | username not sent with query |
    |   200    | profile found  |

* **GET userStats with userID** : `/internal/users/:userID/stats`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   200    | stats found  |

* **GET userData with userID** : `/internal/users/:userID/userData`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   200    | stats found  |

#### POST 

* **POST fetch multiple userProfile with userIDs** : `/internal/users/profile`

    userIDs sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | userIDs not sent in body |
    |   200    | profile found  |

    _Note_ : We are not sending 404 in this query because we want to fetch a list of profile even if one of the userID doesn't have a linked profile in the database.

* **POST post a userProfile and userStats** : `/internal/users/:userID/profile`

    userID sent as `request.params`
    username sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   409    | username taken |
    |   201    | profile and stats created  |

* **POST fetch userDatas with userIDs (batch query)** : `/internal/users/userDataBatch`

    userIDs sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   200    | profile found  |

    _Note :_ if there is no profile to be found (no userID sent) or none of the provided userID has a profile linked with it, we will sent a empty json

#### PATCH 

* **PATCH patch userProfile (profile settings) with userID** : `/internal/users/:userID`

    userID sent as `request.params`
    settings sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | no paramater to update  |
    |   404    | profile not found |
    |   409    | username taken |
    |   200    | profile updated  |

* **PATCH patch userStats with userID** : `/internal/users/:userID/stats`

    userID sent as `request.params`
    stats sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   200    | stats updated or not stats to update  |

#### DELETE

* **DELETE usersProfile and userStats with userID** : `/internal/users/:userID`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | profile not found |
    |   204    | profile deleted  |

### Usage and associated functions

* userStats
    * ~~get user stats by userID~~
        
        ```curl http://localhost:2626/users/userStats/<userID>```
    * ~~update all game stats~~
    * ~~update longest match~~
    * ~~update shorest match~~
    * ~~update total match~~
    * ~~update total wins~~
    * ~~update win streak~~ 
    * ~~update average match duration~~
    * ~~update highest score~~

* userProfile
    * ~~get activity status by userID~~
        
        ``` curl http://localhost:2626/users/activity/<userID> ```
    * ~~get profile info (username. avatar, biography, profile color, lastConnexion) by userID~~
        
        ``` curl http://localhost:2626/internal/users/profile/<userID> ```
    * ~~get lastConnexion by userID~~
        
        ```curl http://localhost:2626/users/lastConnection/<userID> ```
    * ~~update avatar~~
            
            curl -X POST \
            -H "Content-Type: application/json" \
            -d '{"newAvatar": "<new avatar>"}' \
            http://localhost:2626/users/updateAvatar/<userID>
    * updata biography
        
        ```
        curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"newbiography": "<biography>>"}' \
        http://localhost:2626/users/updatebiography/<userID>
    * update profileColor

        ```
        curl -X POST \  -H "Content-Type: application/json" \
        -d '{"newProfileC": "<new color>"}' \    
        http://localhost:2626/users/updateProfileColor/<userID> 
    * update activity status

        ```
        //newStatus must be a number, between quotes works too :
        curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"newStatus": "<newStatus>"}' \
        http://localhost:2626/users/updateActivityStatus/<userID>
        
        curl -X POST \
        -H "Content-Type: application/json" \
        -d '{"newStatus": <newStatus>}' \  
        http://localhost:2626/users/updateActivityStatus/<userID>
    * update lastConnexion
        
        ```
        curl -X POST \  -H "Content-Type: application/json" \
        -d '{"newConnection": "<DATETIME format YYYY-MM-DD HH:MM:SS>"}' \
        http://localhost:2626/users/updateLastConnection/<userID>
    * update username
        
        ```
        curl -X POST \  -H "Content-Type: application/json" \
        -d '{"newUsername": "<username>"}' \
        http://localhost:2626/users/updateUsername/<userID>

## Account

### General overview

The table has the following column : 
* userID &rarr; integer (__primary key__)
* hashedPassword &rarr; text
* username &rarr; text (__unique__)
* email &rarr; text (__unique__)
* userRole &rarr; integer
* registerDate &rarr; datetime

The userRole column stored the role of the user (admin, user). I don't know yet if it will be needed yet.

### Routes

#### GET

* GET fetch settings of an account with userID : `/internal/account/:userID`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | account not found |
    |   200    | settings found and sent  |

* GET fetch account data for userData interface (front communication) : `/internal/account/:userID/accountData`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | account not found |
    |   200    | account data found and sent  |

#### POST

* POST register an account : `/internal/account/register`

    username and password sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   409    | username taken |
    |   201    | account created  |

* POST login with an account : `/internal/account/login`

    username and password sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | account not found |
    |   401    | password or username invalid |
    |   200    | logged in  |

* POST fetch multiple accounts : `/internal/account/accountBatch`

    userIDs sent as `request.body` (as a json ? TODO check)

    | Reply  | Meaning |
    | ------ |:-------:|
    |   200    | accounts founds  |

We never return 404 because we want to sent the accounts even if one is not found. 
We sent the accountsData of the found accounts and an array of the IDs we didn't found an associated account


#### PATCH

* PATCH account settings with userID

    userID sent as `request.params`
    settings sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | no settings to update |
    |   404    | account not found |
    |   409    | username taken |
    |   200    | settings updated  |


#### DELETE

* DELETE account : `/internal/account`

    userID sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | account not found |
    |   204    | account deleted  |


### Usage and associated functions

TODO :
* register a user
* verify password match for connection to the account
* update password
* verify email for connection
* update username (if we want to allow it)
* get userRole (if we implement admin features)

## Friends

### General overview

This database has only one table. The table has the following column :
* friendshipID &rarr; integer (__primary key__)
* userID &rarr; integer
* friendID &rarr; integer
* statusFriendship &rarr; boolean

In the same way as the language database, we have the friendshipID as a surrogate key.
The actual way to determine the uniqueness of the friendship is the combination of the userID and the friendID.
The userID references the user who initated the friend request, and the friendID is the user on the receiving hand of the friendship request.

For the statusFriendship :

| Value  | Meaning  |
| ------ |:--------:|
| 0      | pending  |
| 1      | accepted |

### Routes

#### GET

* GET fetch relation between two users and get a user friendlist: `/internal/friends/friendship`

    Depending on what parameters we send when calling the route, the outcome will be different.
    If we want the relation between two users we send the userIDs of the users in the `request.query`

    If we want the friendlist (pending or confirmed friendship) we send only one userID and what type of friendship (pending or confirmed )we want to query, also in `request.query`

    For relation between two users :

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | friendship not found |
    |   200    | friendship found and status returned  |


    For a friendlist :

    | Reply  | Meaning |
    | ------ |:-------:|
    |   200    | friendlist found and friends returned  |

#### POST

* POST a friend request : `/internal/friends/friendship` 

    senderID and receiverID sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   409    | request already exists  |
    |   201    | request created  |

#### PATCH

* PATCH accept friend request

    receiverID and friendID sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   409    | friendship already exists  |
    |   400    | friendship could not be accepted  |
    |   200    | friendship accepted  |


#### DELETE

* DELETE a friendshiup between two users : `/internal/friendship`

    userA and userB sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | friendship not found  |
    |   204    | friendship deleted  |

* DELETE every friendship a user is a part of (GRPD) : `/internal/friends/:userID/friendships`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   204    | friendships deleted  |


## Dashboard

### General overview

#### gameMatchInfo

This database has the following tables which has the following column :

* gameID &rarr; integer (__primary key__)
* duration &rarr; integer
* startTime &rarr; datetime
* gameStatus &rarr; integer
* winnerID &rarr; integer 
* loserID &rarr; integer
* tournamentID &rarr; integer
* localGame &rarr; boolean
* scoreWinner &rarr; integer
* scoreLoser &rarr; integer

The gameStatus column might not make the final cut, depending on when we plan on updating the database (throughout the game or only at the end). If we do keep it, the values will have the following meaning :

| Value  |      Meaning     |
| ------ |:----------------:|
|   0    | still in "lobby" |
|   1    |      started     |
|   2    |      ended       |

The tournamentID will allow use the get all the games played in a tournament without having to duplicate data in the tournament table. It can be nulled if a game is not part of a tournament.

localGame's value and meaning are : 

| Value  | Meaning |
| ------ |:-------:|
|   0    | remote  |
|   1    | local   |

There is the question of the local game. If a game is local, the "invited" user is not register as a user, which means not userID. How do we planned on going about it ? We might set the loser/winnerID to null and set a "Invited player" a the game dashboard front wise. TODO : figure that out 

#### tournamentInfo

* tournamentID &rarr; integer (__primary key__)
* winnerID &rarr; integer
* playerIDs &rarr; TEXT

The playersIDs is currently thought of has a JSON array storing the userID of all tournament players. This data format allows for different tournament size and is pretty flexible in the event we implement other tournament size. TODO : Figure out if the JSON array format isn't to complicated and fast enough, and find a replacement if it's not optimized

### Routes

#### GET

* GET all games of a user : `/internal/dashboard/games`

    userID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | userID not provided  |
    |   200    | games found and returned |

#### POST

* POST a game : `/internal/dashboard/games`

    local and tournamentID sent as `request.body`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   201    | game created and gameID returned |

* POST a tournament : `/internal/dashboard/tournaments`

    playerIDs sent as `request baody` (as json ? TODO check)

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | playerIDs not provided  |
    |   201    | tournament created and ID returned  |

#### PATCH

* PATCH update game stats : `/internal/dashboard/games/:gameID`

    gameID sent as `request.params`
    stats sent as `request.body` (as a json ? TODO check)

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | no stats sent to update  |
    |   404    | game not found  |
    |   200    | stats updated  |

* PATCH tournament winner : `/internal/dashboard/tournaments/:tournamentID`

    tournamentID sent as `request.params` 
    winnerID sent as `request.body` 

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | tournamentID not provided |
    |   404    | tournament not found  |
    |   200    | tournament winner updated  |


#### DELETE

* DELETE a game : `/internal/dashboard/games/:gameID`

    gameID sent as `request.params`

    | Reply  | Meaning |
    | ------ |:-------:|
    |   400    | gameID not provided |
    |   404    | game not found  |
    |   204    | game deleted  |

* DELETE a tournament : `/internal/dashboard/tournaments/:tournamentID`

    tournamentID sent as `request.params` 

    | Reply  | Meaning |
    | ------ |:-------:|
    |   404    | tournament not found |
    |   204    | tournament deleted  |

## Miscellaneous

### Information

The UPDATE method can allow use the perfom addition to a column of a row without having to pull the data from the table first. Like so 

```
UPDATE userStats 
SET totalPlayedGame = totalPlayedGame + 1 
WHERE userID = 101;
```

[WIP] DOC NOT UP TO DATE YET (nginx conf not done yet)


* servir traduction      
* envoyer les settings

* supprimer ami                    ✅
* envoyer demande d'ami            ✅
* accepter demande d'ami           ✅
* servir la leaderboard            ✅
* servir les users pour search bar ✅
* servir le profile                ✅
* servir userCard                  ✅
