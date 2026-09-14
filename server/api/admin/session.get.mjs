import { defineEventHandler } from 'h3'
import { requireAdmin } from '../../utils/admin-auth.mjs'

export default defineEventHandler((event) => ({ admin: requireAdmin(event) }))
