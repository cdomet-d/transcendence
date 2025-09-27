import sqlite3 from 'sqlite3';

const dbpath = '/usr/data/friends.db';
const dbFriends = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the friends.db SQLite database');
  }
});

export { dbFriends };