import sqlite3 from 'sqlite3';

// Get the directory name of the current file
const dbpath = '/usr/data/friends.db';

// This opens your database file for read/write
console.log('Database path used:', dbpath);  // <-- Check this log output in container
const db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the friends.db SQLite database');
  }
});

export { db };