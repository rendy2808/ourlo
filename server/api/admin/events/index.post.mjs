import { createEvent } from '../../../database/repositories/events.mjs'
import { withDatabase } from '../../../utils/database.mjs'
import { parseEventInput } from '../../../utils/event-input.mjs'
import { serializeEvent } from '../../../utils/event-output.mjs'
import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3'
import { requireAdmin } from '../../../utils/admin-auth.mjs'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const input = parseEventInput(await readBody(event))

  try {
    const created = withDatabase(database => createEvent(database, input))
    setResponseStatus(event, 201)
    return { event: serializeEvent(created) }
  } catch (error) {
    if (String(error?.message).includes('UNIQUE constraint failed: events.slug')) {
      throw createError({ statusCode: 409, statusMessage: 'That event URL is already in use.' })
    }
    throw error
  }
})
