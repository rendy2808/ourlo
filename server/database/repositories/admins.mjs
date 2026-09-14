import { randomUUID, randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto'

const SESSION_LIFETIME_SECONDS = 60 * 60 * 12

export function hashPassword(password) {
  const salt = randomBytes(16)
  const digest = scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('base64url')}$${digest.toString('base64url')}`
}

export function verifyPassword(password, encodedHash) {
  const [algorithm, saltValue, digestValue] = String(encodedHash).split('$')
  if (algorithm !== 'scrypt' || !saltValue || !digestValue) return false

  try {
    const expected = Buffer.from(digestValue, 'base64url')
    const actual = scryptSync(password, Buffer.from(saltValue, 'base64url'), expected.length)
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

export function upsertAdmin(database, email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const existing = database.prepare('SELECT id FROM admin_users WHERE email = ? COLLATE NOCASE').get(normalizedEmail)
  const passwordHash = hashPassword(password)

  if (existing) {
    database.prepare(`
      UPDATE admin_users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(passwordHash, existing.id)
    database.prepare('DELETE FROM admin_sessions WHERE admin_user_id = ?').run(existing.id)
    return existing.id
  }

  const id = randomUUID()
  database.prepare('INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)')
    .run(id, normalizedEmail, passwordHash)
  return id
}

export function findAdminByEmail(database, email) {
  return database.prepare('SELECT * FROM admin_users WHERE email = ? COLLATE NOCASE').get(email.trim())
}

export function createAdminSession(database, adminUserId) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_SECONDS * 1000).toISOString()

  database.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').run(new Date().toISOString())
  database.prepare(`
    INSERT INTO admin_sessions (id, admin_user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(randomUUID(), adminUserId, tokenHash, expiresAt)

  return { token, expiresAt, maxAge: SESSION_LIFETIME_SECONDS }
}

export function findAdminBySession(database, token) {
  if (!token) return null
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const now = new Date().toISOString()
  const row = database.prepare(`
    SELECT admin_users.id, admin_users.email, admin_sessions.id AS session_id
    FROM admin_sessions
    JOIN admin_users ON admin_users.id = admin_sessions.admin_user_id
    WHERE admin_sessions.token_hash = ? AND admin_sessions.expires_at > ?
  `).get(tokenHash, now)

  if (row) {
    database.prepare('UPDATE admin_sessions SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?').run(row.session_id)
  }
  return row || null
}

export function deleteAdminSession(database, token) {
  if (!token) return
  const tokenHash = createHash('sha256').update(token).digest('hex')
  database.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(tokenHash)
}
