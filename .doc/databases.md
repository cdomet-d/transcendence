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

## Accessibility

### General overview

The accessibily container holds the translation for each supported langangues (English, French and Spanish). 
There is only one table in this database : translations

The table has 4 column :
* ID &rarr; integer
* word &rarr; text
* language_code &rarr; text 
* translation &rarr; text

The word column is meant to hold the key or phrase identifier. The language_code column holds the language code (dah), like "en" or "fr". And lastly the translation will hold the translation of the word in it's targeted language code.
So for example we could have :
* word == "hello"
* language_code == "fr"
* translation == "bonjour"

A SQL query to find the translation of a word would look like this :
```
SELECT translation FROM translations WHERE word = 'hello' AND language_code = 'fr';

-- will return "bonjour"
```

The combination betweent the word column and the language_code column is a __natural key__. It's basically an identifier that is formed by the combination of existing data in the table. It has meaning and therefore might be subject of changes in the future.

We have the first column (ID) which I havn't mention yet. The column is there for multiple reasons. First, it is good pratice in SQL to keep an unmutable ID for each row of a table. It's known as a __surrogate key__, which only purpose is to uniquely identify a row in a database. It has absolutely zero meaning data wise. We use this surrogate key because the natural key can change. So having a stable, meaningless ID ensure we can always reliably reference a row in the table, which is mandatory for stability.
It can also be used for easy modification. Since the natural key is a combination of other data in the table, it can be easier to make a SQL query looking for an integer than combination of two texts.
Lasty, even is the table will remain pretty small, being able to make shorter, simpler queries also improves perfomances. It can make sense to simplify queries where we can when we have several databases, to maximise of perfomances for much more daunting tasks.

### Usage and associated functions

TODO :
* get translation of a word by word and language code

## Users

### General overview

The users container holds the data for a user's profile such as the bio, profile picture, online status and so forth.
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
* bio &rarr; text
* profileColor &rarr; text
* activityStatus &rarr; integer 
* lastConnexion &rarr; datetime

userID will match between different table and database and if a general ID for a user.

activityStatus will be used to keep track of whether the user if offline, online or playing. The following value and meaning will be :

| Value  | Meaning |
| ------ |:-------:|
|   0    | offline |
|   1    | online  |
|   2    | playing |

### userStats

This table has the following column :
* userID &rarr; integer (__primary key__)
* longestMatch &rarr; integer
* shorestMatch &rarr; integer
* totalMatch &rarr; integer
* totalWins &rarr; integer
* winStreak &rarr; integer
* averageMatchDuration &rarr; integer
* highestScore &rarr; integer

We don't have totalLosses because it can easily be computed by totalMatch and totalWin so we remove so useless SQL queries by not storing totalLosses.

### Usage and associated functions

TODO :
* userProfile
    * get user stats by userID
    * update last connexion
    * update longest match
    * update shorest match
    * update total match
    * update total wins
    * update win streak 
    * update average match duration
    * update highest score

* userStats
    * get activity status by userID 
    * get profile info (username. avatar, bio, profile color, lastConnexion) by userID
    * get profile info (username. avatar, bio, profile color) by userID
    * get lastConnexion by userID
    * update avatar
    * updata bio
    * update profileColor
    * update activity status
    * update lastConnexion
    * update username ? (TODO : ask is we thing the user should be able to update username as part of customization)

## Account

### General overview

The table has the following column : 
* userID &rarr; integer (__primary key__)
* hashedPassword &rarr; text
* username &rarr; text (__unique__)
* email &rarr; text (__unique__)
* userStatus &rarr; integer
* registerDate &rarr; datetime

The userStatus column stored the role of the user (admin, user). I don't know yet if it will be needed yet.

### Usage and associated functions

## Friends
### General overview
### Usage and associated functions

## Dashboard
### General overview
### Usage and associated functions