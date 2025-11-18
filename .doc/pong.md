# Pong

## game loop with fixed step
the game loop 
the ball and paddles' steps 

## collisions

## velocity

## reconciliation

## dead reckoning

## interpolation

## Data exchange
### To sync client and server clocks:
**client sends:** timestamp: number \
**server sends back:**  
startObj { \
	clientTimeStamp: number, \
	serverTimeStamp: number, \
	delay: number, \
	ballDir: number, \
}

### To update game
**client sends at a 60FPS rate:** \
reqObj { \
	_ID: number,\
	_keys: keysObj,\
	_timeStamp: number,\
}\
**server sends at a 20FPS rate:**\
repObj {\
	_ID: number,\
	_timestamp: number,\
	_leftPad: coordinates,\
	_rightPad: coordinates,\
	_ball: ballObj,\
}

## Resources
- https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
- https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html
- https://daposto.medium.com/game-networking-2-time-tick-clock-synchronisation-9a0e76101fe5
