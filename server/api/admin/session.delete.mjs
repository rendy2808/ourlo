import { deleteAdminSession } from '../../database/repositories/admins.mjs'
import { withDatabase } from '../../utils/database.mjs'
import { ADMIN_SESSION_COOKIE, sessionCookieOptions } from '../../utils/admin-auth.mjs'
import { defineEventHandler, deleteCookie, getCookie } from 'h3'

export default defineEventHandler((event) => {
  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  withDatabase(database => deleteAdminSession(database, token))
  deleteCookie(event, ADMIN_SESSION_COOKIE, sessionCookieOptions(event, 0))
  return { ok: true }
})
