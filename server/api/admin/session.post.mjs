import { createAdminSession, findAdminByEmail, verifyPassword } from '../../database/repositories/admins.mjs'
import { withDatabase } from '../../utils/database.mjs'
import { ADMIN_SESSION_COOKIE, sessionCookieOptions } from '../../utils/admin-auth.mjs'
import { createError, defineEventHandler, getRequestIP, readBody, setCookie } from 'h3'

const attempts = new Map()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  const address = getRequestIP(event, { xForwardedFor: true }) || 'local'
  const attempt = attempts.get(address)

  if (attempt?.blockedUntil > Date.now()) {
    throw createError({ statusCode: 429, statusMessage: 'Too many attempts. Try again in a few minutes.' })
  }
  if (!email || password.length < 8 || password.length > 256) return reject(address)

  const result = withDatabase((database) => {
    const admin = findAdminByEmail(database, email)
    if (!admin || !verifyPassword(password, admin.password_hash)) return null
    return { admin, session: createAdminSession(database, admin.id) }
  })

  if (!result) return reject(address)
  attempts.delete(address)
  setCookie(event, ADMIN_SESSION_COOKIE, result.session.token, sessionCookieOptions(event, result.session.maxAge))
  return { admin: { id: result.admin.id, email: result.admin.email } }
})

function reject(address) {
  const previous = attempts.get(address)
  const count = (previous?.count || 0) + 1
  attempts.set(address, { count, blockedUntil: count >= 5 ? Date.now() + 5 * 60 * 1000 : 0 })
  throw createError({ statusCode: 401, statusMessage: 'Email or password is incorrect.' })
}
