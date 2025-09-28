import sqlite3 from 'sqlite3';

const dbpath = '/usr/data/Stats.db';
const dbStats = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to the Stats.db SQLite database');
  }
});

export { dbStats };