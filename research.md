# Subject understanding and research outline

## Modules

A minimum of 7 major modules is required to get a 100% grade.
For bonuses, we need 9,5 modules
Two minor modules count as one major module.

### Web

- Build a backend

- **MAJOR**
  - ✅ Use a framework to build the backend
      - CCAS : fastify + node.js
  - ✅ Use a framework or toolkit to build the frontend
      - CCAS : tailwind CSS
  
- **MINOR**
  - ✅ Use a database for the backend (is there any other way ?)
      - CAS: SQL lite

### User management

- **MAJOR**
  - ✅ Standard User Management, authentication, user persistence across tournaments
      - Co
  - ❓Implement remote authentication
      - A

### Gameplay and user experience

- **MAJOR**
  - ✅ Remote players
    - Ch
  - Add another game with user history and matchmaking ~ 
  - ❓Live chat

- **MINOR**
  - ✅ Game customization options (paddle speed ? arena skins ? bonuses ?)
    

## AI-Algo
  
- **MAJOR**
  - ✅ AI opponent
    - Co
  - ✅ User and game state dashboards (depends on USER MANAGEMENT)
    - S

### Cybersec

- **MAJOR**
  - ✅ Implement WAF/ModSecurity with hardened configuration & HashiCorp Vault for secret management
    - ChAS
  - ❓Implement 2FA & JWT
    - Ch

- **MINOR**
  - ✅ GDPR compliance
    - AS

### Devops

- **MAJOR**
  - ✅ Infrastructure setup for log management
    - Co
  - ✅ Backend as microservices
    - Ch

- **MINOR**
  - ✅ Monitoring system
    - S

### Accessibility

- **MINOR**
  -❓Expand browser compatibility
    - A
  - ✅ Multiple language support
    - A
  - ✅ Accessibility features for visually impaired users
    - Co
  - ✅ Server-side rendering integration
    - CoChS

### Server-side pong

- **MAJOR**
  - ✅ Implement an API for server-side pong
    - CoA
  - ✅ Enable pong gameplay via CLI against web users with API integration
    - ChS

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