import { openDatabase } from '../database/client.mjs'
import { migrateDatabase } from '../database/migrate.mjs'

export function withDatabase(callback) {
  const database = openDatabase()
  try {
    migrateDatabase(database)
    return callback(database)
  } finally {
    database.close()
  }
}
