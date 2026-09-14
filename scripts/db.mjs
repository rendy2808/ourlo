import { createHash, randomUUID } from 'node:crypto'
import { openDatabase, databasePath } from '../server/database/client.mjs'
import { migrateDatabase } from '../server/database/migrate.mjs'
import { createEvent, findEventBySlug } from '../server/database/repositories/events.mjs'
import { upsertAdmin } from '../server/database/repositories/admins.mjs'

const command = process.argv[2] || 'status'
const database = openDatabase()

try {
  const applied = migrateDatabase(database)

  if (command === 'migrate') {
    console.log(applied.length ? `Applied: ${applied.join(', ')}` : 'Database is up to date.')
  } else if (command === 'seed') {
    seedDatabase(database)
    console.log('Seeded local event. Guest pass: demo-pass')
  } else if (command === 'admin') {
    createLocalAdmin(database)
  } else if (command === 'status') {
    printStatus(database)
  } else {
    throw new Error(`Unknown database command: ${command}`)
  }
} finally {
  database.close()
}

function createLocalAdmin(database) {
  const email = String(process.env.OURLO_ADMIN_EMAIL || '').trim()
  const password = String(process.env.OURLO_ADMIN_PASSWORD || '')
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Set OURLO_ADMIN_EMAIL to a valid email address.')
  if (password.length < 12 || password.length > 256) throw new Error('OURLO_ADMIN_PASSWORD must contain 12–256 characters.')
  upsertAdmin(database, email, password)
  console.log(`Local admin ready: ${email}`)
}

function seedDatabase(database) {
  let event = findEventBySlug(database, 'maya-rafi')

  if (!event) {
    event = createEvent(database, {
      slug: 'maya-rafi',
      name: 'Maya & Rafi',
      eventType: 'wedding',
      eventDate: '2027-02-14',
      activeFrom: '2027-02-14T00:00:00+08:00',
      activeUntil: '2027-02-14T23:59:59+08:00',
      timezone: 'Asia/Makassar',
      guestCount: 100,
      maxPhotosPerPass: 10,
      maxAiPerPass: 3,
      status: 'ready'
    })
  }

  const templateId = 'template-photo-strip'
  database.prepare(`
    INSERT OR IGNORE INTO templates (
      id, name, layout_type, slot_count, aspect_ratio, orientation, configuration_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(templateId, 'Photo strip', 'strip', 3, '2:5', 'portrait', JSON.stringify({ gap: 12, border: 20 }))

  database.prepare(`
    INSERT OR IGNORE INTO event_templates (event_id, template_id, sort_order)
    VALUES (?, ?, 0)
  `).run(event.id, templateId)

  database.prepare(`
    INSERT OR IGNORE INTO guest_passes (
      id, event_id, token_hash, label, photo_quota, ai_quota
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    randomUUID(),
    event.id,
    createHash('sha256').update('demo-pass').digest('hex'),
    'Table 08',
    event.max_photos_per_pass,
    event.max_ai_per_pass
  )
}

function printStatus(database) {
  const tables = ['admin_users', 'admin_sessions', 'events', 'guest_passes', 'templates', 'ai_filters', 'photos', 'usage_records']
  console.log(`Database: ${databasePath()}`)
  for (const table of tables) {
    const { count } = database.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get()
    console.log(`${table}: ${count}`)
  }
}
