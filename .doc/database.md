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
