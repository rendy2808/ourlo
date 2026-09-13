import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export function databasePath() {
  return resolve(process.cwd(), process.env.NUXT_LOCAL_DATABASE_PATH || '.data/ourlo.sqlite')
}

export function openDatabase(path = databasePath()) {
  mkdirSync(dirname(path), { recursive: true })

  const database = new DatabaseSync(path)
  database.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;')
  return database
}
