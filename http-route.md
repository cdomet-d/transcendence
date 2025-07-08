# API Routes and endpoint documentation

This document aims to list project features and their associated endpoints. It will serve as a work document to ensure a good project structure.

The routes are defined in the Fastify server, in the following way:

```js
    // Declare a route
    fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})

```

Each route will call its own internal logic through the Fastify framework.

Fastify being made to build independant services, these routes might belong to different microservices. Here we will simply list all features and their associated endpoints.

## Features

### Main application goal

Provide a customizable pong game tournament, complete with user management and leaderboard.

### Tournament and matchmaking

#### 1. Request a game
Request 

### 2. Objective / Purpose
_Briefly explain why this feature exists and what problem it solves._

### 3. Description
_A detailed explanation of what the feature does, including its main actions and behaviors._

### 4. Actors / Users
_List the types of users or system components that will interact with this feature._

### 5. Preconditions
_List any conditions that must be met before this feature can be used (e.g., user must be logged in)._

### 6. Functional Flow / Steps
_Describe the step-by-step process or user journey for this feature._

### 7. Inputs
_Specify what data or actions are required to trigger this feature._

### 8. Outputs
_Describe the results, changes, or data produced by this feature._

### 9. Business Rules / Constraints
_List any rules, validations, or constraints that apply to this feature._

### 10. Exceptions / Error Handling
_Describe how the system should respond to errors or exceptions related to this feature._

### 11. Priority
_Indicate the importance (e.g., Must-have, Should-have, Nice-to-have)._

### 12. Acceptance Criteria
_List the conditions that must be met for this feature to be considered complete and accepted._

- Request game
  - Starts the matchmaking logic

### Pong game

## Documentation

- [Building Web APIs](https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/)
- [Set up a Node.js API](https://dev.to/micaelmi/setting-up-a-nodejs-api-90j)
- [Building backends](https://slashdev.io/-guide-to-building-fast-backends-in-fastify-in-2024)
- [REST APIS best practices and patterns](https://dev.to/kelvincode1234/ultimate-guide-to-rest-api-design-best-practices-and-patterns-1hia)