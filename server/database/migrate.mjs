import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const migrationsDirectory = resolve(process.cwd(), 'server/database/migrations')

export function migrateDatabase(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const applied = new Set(
    database.prepare('SELECT name FROM schema_migrations').all().map(row => row.name)
  )

  const migrations = readdirSync(migrationsDirectory)
    .filter(file => file.endsWith('.sql'))
    .sort()

  for (const migration of migrations) {
    if (applied.has(migration)) continue

    const sql = readFileSync(resolve(migrationsDirectory, migration), 'utf8')
    database.exec('BEGIN IMMEDIATE')

    try {
      database.exec(sql)
      database.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(migration)
      database.exec('COMMIT')
    } catch (error) {
      database.exec('ROLLBACK')
      throw error
    }
  }

  return migrations.filter(migration => !applied.has(migration))
}
