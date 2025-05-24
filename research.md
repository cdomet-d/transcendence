# Subject understanding and research outline

## Modules

A minimum of 7 major modules is required to get a 100% grade.

Two minor modules count as one major module.

### Web

- **MAJOR**
  - Use a framework to build the backend
  - Use a framework or toolkit to build the frontend
  - Store the results tournament in the blockchain
  
- **MINOR**
  - Use a database for the backend (is there any other way ?)

### User management

- **MAJOR**
  - Standard User Management, authentication, user persistence across tournaments
  - Implement remote authentication

### Gameplay and user experience

- **MAJOR**
  - Remote players
  - Multiplayer
  - Add another game with user history and matchmaking
  - Live chat

- **MINOR**
  - Game customization options (paddle speed ? arena skins ? bonuses ?)

## AI-Algo
  
- **MAJOR**
  - AI opponent
  - User and game state dashboards (depends on USER MANAGEMENT)

### Cybersec

- **MAJOR**
  - Implement WAF/ModSecurity with hardened configuration & HashiCorp Vault for secret management
  - Implement 2FA & JWT

### Devops

- **MAJOR**
  - Infrastructure setup for log management
  - Backend as microservices

- **MINOR**
  - Monitoring system

### Graphics

- **MAJOR**
  - 3D rendering for Pong 😴

### Accessibility

- **MINOR**
  - Support on all devices
  - Expand browser compatibility
  - Multiple language support
  - Accessibility features for visually impaired users
  - Server-side rendering integration

### Server-side pong

- **MAJOR**
  - Implement an API for server-side pong
  - Enable pong gameplay via CLI against web users with API integration
    - What tf does that mean ?

## Research

- What is a single page application ?
- SQL injections and XSS attacks
- Creating an API
- Protecting API routes
- Hashing algorithms
- What is a framework and what are some examples ?
- What is a frontend toolkit ?
- What is Standard User Management ?
- What is remote authentication ?
- WAF/ModSecurity with hardened configuration & HashiCorp Vault
- 2FA & JWT
- Microservices architecture
- Infrastructure setup for log management
- Webapp monitoring system
- Server-side rendering
- Implementing an API

## Constraints

- MUST use Docker
- MUST be be launched with a single commmand
- The website MUST be a single page application
- MUST be compatible with last stable Mozilla Firefox. CAN be compatible with other browsers.

## Features

- MUST include a live Pong game.
- Users MUST be able to play pong with another user on the same keyboard.
- Players MUST be able to plays against one another. A tournament system SHOULD be avaible.
  - A tournament consists of multiple players taking turns at playing against one another.
  - It MUST clearly display the current players
  - It MUST clearly display the order the matches will take place.
- There MUST be a registration system. The players MUST input aliases at the start of the tournament. If the USER MANAGEMENT module is not implemented, aliases WILL reset at the start of a new tournament.
- There MUST be a matchmaking system for the tournament. It will organize the tournament and announce the next game.
- All players, including bots, MUST have the same paddle speed.

## Security

- If using a database, all passwords MUST be hashed.
- The website MUST be protected against SQL injections and XSS attacks
- HTTPS MUST be enabled whenever applicable
- All user input MUST be sanitized
- The site MUST be secure.
- All credential MUST NOT be publicly stored