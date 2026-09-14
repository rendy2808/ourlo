export function serializeEvent(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    eventType: row.event_type,
    eventDate: row.event_date,
    activeFrom: row.active_from,
    activeUntil: row.active_until,
    timezone: row.timezone,
    guestCount: row.guest_count,
    maxPhotosPerPass: row.max_photos_per_pass,
    maxAiPerPass: row.max_ai_per_pass,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}
