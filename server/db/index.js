const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');
const { lookups } = require('./schema');

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

module.exports = { db, lookups };
