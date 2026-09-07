import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { timing } from 'hono/timing'
import { serveStatic } from 'hono/bun'
import { getDatabase } from './database'
import { config } from './config'
import router from './routes'

const app = new Hono()

// CORS Middleware - Allow all origins for Vercel deployment
app.use('/*', cors({
  origin: '*', // Allow all origins (or specify your frontend domains)
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Client-Version'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
  credentials: false, // Set to false when origin is '*'
}))

app.use('/*', logger())
app.use('/*', timing())

// Health check
app.get('/health', (c) => c.text('OK'))

// API routes - Must come BEFORE static file serving
app.route('/api', router)

// Serve admin static assets (including JS/CSS)
app.use('/admin/*', serveStatic({ 
  root: './public',
}))

// Admin SPA fallback - ONLY for non-file requests (no extension or .html)
app.get('/admin*', async (c) => {
  const path = c.req.path
  
  // If it's a file request (has extension), let serveStatic handle it
  if (path.match(/\.[a-zA-Z0-9]+$/)) {
    return c.notFound()
  }
  
  // Otherwise serve index.html for SPA routing
  const indexFile = Bun.file('./public/admin/index.html')
  if (await indexFile.exists()) {
    return c.html(await indexFile.text())
  }
  return c.notFound()
})

// Serve landing page static assets
app.use('/*', serveStatic({ 
  root: './public/landing',
}))

// Landing page SPA fallback - catch all other routes and serve index.html
app.get('/*', async (c) => {
  // Skip API routes
  if (c.req.path.startsWith('/api') || c.req.path.startsWith('/admin')) {
    return c.notFound()
  }
  
  // If it's a file request (has extension), let serveStatic handle it
  if (c.req.path.match(/\.[a-zA-Z0-9]+$/)) {
    return c.notFound()
  }
  
  const indexFile = Bun.file('./public/landing/index.html')
  if (await indexFile.exists()) {
    return c.html(await indexFile.text())
  }
  return c.notFound()
})

// Error handling
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Start server
if (import.meta.main) {
  const port = Number(process.env.PORT || Bun.env.PORT || 10000)
  
  init()

  const server = Bun.serve({
    fetch: app.fetch,
    port: port,
    hostname: '0.0.0.0', // Important for Render
  })

  console.log(`KEO Hotel API running on port ${port}`)
}

async function init() {
  try {
    await getDatabase()
    console.log('Database connection established')
  } catch (error) {
    console.error('Failed to connect to database:', error)
  }
}

// Only export for testing, not for Bun to auto-serve
export { app }
