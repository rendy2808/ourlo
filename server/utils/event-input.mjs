import { createError } from 'h3'

const EVENT_TYPES = new Set(['wedding', 'engagement', 'tennis', 'other'])
const EVENT_STATUSES = new Set(['draft', 'ready', 'active', 'ended', 'archived'])

export function parseEventInput(body) {
  const input = {
    name: String(body?.name || '').trim(),
    slug: String(body?.slug || '').trim().toLowerCase(),
    eventType: String(body?.eventType || ''),
    eventDate: String(body?.eventDate || ''),
    activeFrom: String(body?.activeFrom || ''),
    activeUntil: String(body?.activeUntil || ''),
    timezone: String(body?.timezone || 'Asia/Jakarta').trim(),
    guestCount: Number(body?.guestCount),
    maxPhotosPerPass: Number(body?.maxPhotosPerPass),
    maxAiPerPass: Number(body?.maxAiPerPass),
    status: String(body?.status || 'draft')
  }

  if (input.name.length < 2 || input.name.length > 100) fail('Event name must be 2–100 characters.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) || input.slug.length > 80) fail('Use lowercase letters, numbers, and hyphens for the slug.')
  if (!EVENT_TYPES.has(input.eventType)) fail('Choose a valid event type.')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.eventDate)) fail('Choose a valid event date.')
  if (!input.activeFrom || Number.isNaN(Date.parse(input.activeFrom))) fail('Choose a valid start time.')
  if (!input.activeUntil || Number.isNaN(Date.parse(input.activeUntil))) fail('Choose a valid end time.')
  if (Date.parse(input.activeUntil) <= Date.parse(input.activeFrom)) fail('End time must be after start time.')
  if (input.timezone.length < 3 || input.timezone.length > 60) fail('Enter a valid timezone.')
  if (!Number.isInteger(input.guestCount) || input.guestCount < 1 || input.guestCount > 10000) fail('Guest count must be between 1 and 10,000.')
  if (!Number.isInteger(input.maxPhotosPerPass) || input.maxPhotosPerPass < 0 || input.maxPhotosPerPass > 100) fail('Photo allowance must be between 0 and 100.')
  if (!Number.isInteger(input.maxAiPerPass) || input.maxAiPerPass < 0 || input.maxAiPerPass > input.maxPhotosPerPass) fail('AI allowance must be between 0 and the photo allowance.')
  if (!EVENT_STATUSES.has(input.status)) fail('Choose a valid status.')

  return input
}

function fail(message) {
  throw createError({ statusCode: 400, statusMessage: message })
}
