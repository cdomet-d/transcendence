# Feature list

## Pong

- Match

- Tournament design
  - Possibilite join la queue pour un tournoi de 4, 8 ou 16, le joueur choisi

  *For starters, one instance of each tournament*
  - Tournois de 16
  - Tournois de 8
  - Tournois de 4
  - Launch tournament when.... (Methode Coco ou Methode Sam ?)
  - [VScode pets waiting screen](https://github.com/tonybaloney/vscode-pets) (for uneven bracket waiting screen)
- Matchmaking
  - Notifications avant un match
  - ELO ranking system for MM
  - Queue system (min. 2 players etc.)

- Fonctionnalite CHALLENGE
  - cliquer sur un autre utilisateur et CHALLENGER
  - ou bien joueur random sur une queue de tournois de deux personnes

- Logique du jeu
  - Regles du jeu
    - Premier a 5 points en 5 minutes maximum
      - Si egalite, balle de match
  - Collisions, etc

- End of game
  - Game stats
- Error handling: disconnected client stops responding, game continues and stats are not affected

### Remote players

## User management

Anymous accounts are allowed and treated like deleted users.

### Features

- Log in
- Log out
- Add friend
- Delete friend
- Accept friend request
- Create account
- Delete account
- See user profile
- Update user information
- Search user

### DB structure

- User info:
  - ID
  - login
  - password (hash)
  - profile picture
- Account create date
- Online status
  - questions de savoir comment qqun est connecte
- Friend list
- Gamestats
  - ELO
  - Nb game win/lost
  - ball saved nb
  - Time stats
  - Match history
    - Date + h
    - Opponent

## Front end

### Site pages

- Home page
  - Play button
    - Validate authentication
      - User is registered -> add to matchmaking queue
      - User is not registered -> prompt registration as persistent or guest account.
- Header:
  - Profile button (redirects to registration page if no account is created)
    - **On profile**
      - Login
      - User dashboard
      - Profile picture
      - ELO
      - Latest match played
      - Last online
  - Home button
  - General leaderboard
  - Search bar (to find user account)
- Matchmaking loading screen
- Bracket page
- Match page
