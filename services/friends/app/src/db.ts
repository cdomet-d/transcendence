import sqlite3 from 'sqlite3';

export async function addFriendRequest(fromUser: string, toUser: string) {
  const db = new sqlite3.Database('/usr/data/friends.db', (err) => {
    if (err) {
      console.error('Could not connect to database', err);
      return;
    }
    const now = new Date().toISOString();
    // Insert the friend request row
    db.run(
      'INSERT INTO friendship (friendshipID, userID, friendID, startTimeFriendship, statusFrienship) VALUES (?, ?, ?, ?, ?);',
      [2, fromUser, toUser, now, 0],
      (err) => {
        if (err) {
          console.error('Error inserting data', err);
        } else {
          console.log('Friend request inserted');
        }
        db.close(); // Always close connection after work is done
      }
    );
  });
}
