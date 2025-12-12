# 1. Define the payload (Note: gameID is constant!)
PAYLOAD='{"gameID": "race-condition-test-01", "localGame": true, "player1": "eeee", "player2": "cccc", "player1Score": 10, "player2Score": 5, "duration": 60, "startTime": "2025-12-11T12:00:00Z"}'

# 2. Fire 20 requests simultaneously
for i in $(seq 1 20); do
    curl -s -X POST http://dashboard:1515/game \
         -H "Content-Type: application/json" \
         -d "$PAYLOAD" &
done

# 3. Wait for all background jobs to finish
wait
echo "Attack finished."
