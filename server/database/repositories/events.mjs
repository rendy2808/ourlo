import { randomUUID } from 'node:crypto'

export function listEvents(database) {
  return database.prepare(`
    SELECT id, slug, name, event_type, event_date, active_from, active_until,
           timezone, guest_count, max_photos_per_pass, max_ai_per_pass, status,
           created_at, updated_at
    FROM events
    ORDER BY event_date DESC, created_at DESC
  `).all()
}

export function findEventBySlug(database, slug) {
  return database.prepare('SELECT * FROM events WHERE slug = ? COLLATE NOCASE').get(slug)
}

export function createEvent(database, input) {
  const event = {
    id: randomUUID(),
    timezone: 'Asia/Jakarta',
    maxAiPerPass: 0,
    status: 'draft',
    ...input
  }

  database.prepare(`
    INSERT INTO events (
      id, slug, name, event_type, event_date, active_from, active_until,
      timezone, guest_count, max_photos_per_pass, max_ai_per_pass, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    event.id, event.slug, event.name, event.eventType, event.eventDate,
    event.activeFrom, event.activeUntil, event.timezone, event.guestCount,
    event.maxPhotosPerPass, event.maxAiPerPass, event.status
  )

  return findEventBySlug(database, event.slug)
}
