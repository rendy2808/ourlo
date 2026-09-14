import { findEventById, updateEvent } from '../../../database/repositories/events.mjs'
import { withDatabase } from '../../../utils/database.mjs'
import { parseEventInput } from '../../../utils/event-input.mjs'
import { serializeEvent } from '../../../utils/event-output.mjs'
import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { requireAdmin } from '../../../utils/admin-auth.mjs'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = getRouterParam(event, 'id')
  const input = parseEventInput(await readBody(event))

  try {
    const updated = withDatabase((database) => {
      if (!findEventById(database, id)) return null
      return updateEvent(database, id, input)
    })
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Event not found.' })
    return { event: serializeEvent(updated) }
  } catch (error) {
    if (String(error?.message).includes('UNIQUE constraint failed: events.slug')) {
      throw createError({ statusCode: 409, statusMessage: 'That event URL is already in use.' })
    }
    throw error
  }
})
