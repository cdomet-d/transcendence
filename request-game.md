# Functional Description Template

## 1. Feature Name

Request game

## 2. Objective / Purpose

Allows user to enter the tournament queue and get matched with another player to play a match.

## 3. Description

- Registers the current user in the tournament queue
- Launches the matchmaking process, attempting to match the current user with the one closest in rank with him.
- If an opponent is found, send notification and display match order
- If no opponent is found, output notification display and prompt user to retry.

## 4. Actors / Users

_List the types of users or system components that will interact with this feature._

- **Actors:** player user
- **Components:** Matchmaking service, User Queue, Database

## 5. Preconditions

_List any conditions that must be met before this feature can be used (e.g., user must be logged in)._

- User must have an account and be logged in

## 6. Functional Flow / Steps

- User clicks "play"
- System checks auth and prompts it if error
- User is added to queue and matchmaking starts
- if not logged in, prompt user login
- Send confirmation that user is in queue

## 7. Inputs

_Specify what data or actions are required to trigger this feature._

- Click homepage "play" button

## 8. Outputs

- Loading screen while the model attempts to match the player (code: 102)
- Confirmation screen with opponent login when algorithm has matched (code: 200)
- Error screen if no opponent was found after a timeout (45 seconds ?) (code: 404)
  - Add a prompt for user to rejoin queue with custom timeout, max 5 minutes (?)

## Constraints

## 11. Priority

_Indicate the importance (e.g., Must-have, Should-have, Nice-to-have)._

Must-have
