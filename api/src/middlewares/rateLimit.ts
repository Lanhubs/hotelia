import { Context } from 'hono'

interface WindowEntry {
  count: number
  resetAt: number
}

// In-memory store: ip -> window
const store = new Map<string, WindowEntry>()

/** Sliding-window rate limiter. Returns 429 if limit exceeded. */
export function rateLimit(maxRequests: number, windowMs: number) {
  return async (c: Context, next: () => Promise<void>) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
      c.req.header('cf-connecting-ip') ||
      'unknown'

    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs })
      return next()
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      c.header('Retry-After', String(retryAfter))
      c.header('X-RateLimit-Limit', String(maxRequests))
      c.header('X-RateLimit-Remaining', '0')
      return c.json({ error: 'Too many requests. Please try again later.' }, 429)
    }

    entry.count++
    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(maxRequests - entry.count))
    return next()
  }
}

// Clean up stale entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  store.forEach((entry, ip) => {
    if (now > entry.resetAt) store.delete(ip)
  })
}, 5 * 60 * 1000)
