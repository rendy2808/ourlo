import { listEvents } from '../../../database/repositories/events.mjs'
import { withDatabase } from '../../../utils/database.mjs'
import { serializeEvent } from '../../../utils/event-output.mjs'
import { defineEventHandler } from 'h3'
import { requireAdmin } from '../../../utils/admin-auth.mjs'

export default defineEventHandler((event) => {
  requireAdmin(event)
  return { events: withDatabase(database => listEvents(database).map(serializeEvent)) }
})
