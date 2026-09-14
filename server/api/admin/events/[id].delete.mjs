import { deleteEvent } from '../../../database/repositories/events.mjs'
import { withDatabase } from '../../../utils/database.mjs'
import { createError, defineEventHandler, getRouterParam } from 'h3'
import { requireAdmin } from '../../../utils/admin-auth.mjs'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const deleted = withDatabase(database => deleteEvent(database, getRouterParam(event, 'id')))
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Event not found.' })
  return { ok: true }
})
