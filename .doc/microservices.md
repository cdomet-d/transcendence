# List of microservices

## User facing microservices

Each microservice has its own DB
Cybersec is handled into each container

- Account management
  - Account creation and deletion
  - Login/logout
  - Edit information

- Friend management
- Search bar
- Matchmaking
- Gameplay

- Dashboard
  - Leaderboard
  - User game stats

- Accessibility microservices
  - Language
  - Visually impaired thingies

## Infrastructure

- nginx
- Cybersec
- Remote players (?)
- SSR

## Logger

- Monitoring system

```mermaid
---
config:
  layout: elk
  elk:
    mergeEdges: true
    nodePlacementStrategy: BRANDES_KOEPF
---
graph TD;

client
API(API GATEWAY)
server[NGINX]
ssr[SSR]
remotep[Remote players]

client --> API

API --> server

userDB(user-db)
statisticDB(stats-db)
loggerDB(logger-db)

server --> account(Account Management) --> userDB
server --> friends(Friends Management) --> userDB
server --> search(Search) --> userDB
server --> matchmaking(Matchmaking)
server --> game(Gameplay)
server --> stats(Dashboard) --> statisticDB
server --> accessibility(Accessibility) --> accessiblity DB 
server --> logger(Monitoring system) --> loggerDB
```
