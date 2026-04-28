const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

const lookups = sqliteTable('lookups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  query: text('query').notNull(),
  result: text('result'), // Store JSON string of the API result
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

module.exports = { lookups };
