import { findAdminBySession } from '../database/repositories/admins.mjs'
import { withDatabase } from './database.mjs'
import { createError, getCookie, getHeader } from 'h3'

export const ADMIN_SESSION_COOKIE = 'ourlo_admin_session'

export function requireAdmin(event) {
  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  const admin = withDatabase(database => findAdminBySession(database, token))
  if (!admin) throw createError({ statusCode: 401, statusMessage: 'Please sign in to continue.' })
  return { id: admin.id, email: admin.email }
}

export function sessionCookieOptions(event, maxAge) {
  const forwardedProtocol = getHeader(event, 'x-forwarded-proto')
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: forwardedProtocol === 'https' || Boolean(event.node.req.socket?.encrypted),
    path: '/',
    maxAge
  }
}
