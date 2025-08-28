# Database structure

## List of the data

* User ID 					=> int
* Avatar					=> string (64 char)
* Bio						=> string (128 char)
* Username					=> string (4-18 char)
* Password					=> string (12-256 char)
* Email						=> string (128 char)
* Profile color				=> string (64 char)
* Rank (== Elo ?)			=> string (32 char)

* Start time of friendship	=> string (32 char)
* Blocked people (map ?)	=> string (username ? id ?)
* Friends (map ?) 			=> string (username ? id ?)

* Start time of a match		=> string (32 char)
* End time of a match		=> string (32 char)
* Duration of a match (sec)	=> int
* Loser of a match			=> string (4-18 char)
* Winner of a match			=> string (4-18 char)
* Match ID					=> int
* Score of a match			=> map of both the players score
* Longest match of a user	=> int
* Longest pass in match		=> int
* Shortest match of a user	=> int
* Total number of matches	=> int
* Total loss of matches		=> int
* Total win of matches		=> int 
* Winstreak (?)				=> int
* Match ID					=> int
* Tournament ID 			=> int
* Tounament winner			=> string (4-18 char)

## Executives decisions :

* A tournament or a regualr 2-players game will be considered the same way database wise to avoid having repeting tables.

## Tables

Do I need a user_ID and a userProfile_ID ? If yes, what would be the difference between the two in terms of definition and usage ?

* userInfo : Primary key : User_ID
	* User_ID
	* Password
	* Email
	* Last_connexion
	* Username
	* Is_connected
	* Register_date

* userProfile : Primary key : User_ID
	* Foreign key: userInfo.User_ID
	* Avatar
	* Bio
	* Profile color

* Friend_list : Primary key : ? 
	--> composite key to guarantee the uniqueness of a frienship ?

* Blocked_list :  Primary key : ?
	--> composite key to guarantee the uniqueness of a unfrienship ?

* Pending_friend_list : Primary key : ?
	--> composite key to guarantee the uniqueness of a request ?

* userStats : Primary key : User_ID
	* User_ID : Foreign key: userInfo.User_ID
	* Longuest_match
	* Shorest_match
	* Nb_match_won
	* Nb_match_lost
	* winstreak
	* averageMatchDuration ?

* gameInfo : Primary key : game_ID
	* game_ID
	* duration
	* creation_date
	* winner_ID : Foreign key : userInfo.User_ID
	* host_ID : Foreign key : userInfo.User_ID

* Game_room : Primary key : gameRoom_ID
	* gameRoom_ID
	* winner_ID  : Foreign key : userInfo.User_ID
	* Nb_players


## Notes :

* Game_room table will probably need addition depending on which matchmaking algorithm we choose to implement
* Still working on composite key for friends, blocked and pending lists
* I saw a different ID for the profile and the actual user in nmilan's database and I'm missing to see the point there, so still WIP
