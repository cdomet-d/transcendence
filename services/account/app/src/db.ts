import sqlite3 from 'sqlite3';

const dbpath = '/usr/data/account.db';
const dbAccount = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the users.db SQLite database');
  }
});

export { dbAccount };