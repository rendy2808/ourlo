import { findEventById } from '../../../database/repositories/events.mjs'
import { withDatabase } from '../../../utils/database.mjs'
import { serializeEvent } from '../../../utils/event-output.mjs'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/admin-auth.mjs'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const row = withDatabase(database => findEventById(database, getRouterParam(event, 'id')))
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Event not found.' })
  return { event: serializeEvent(row) }
})
