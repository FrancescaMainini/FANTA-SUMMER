import express from 'express'
import session from 'express-session'
import MemoryStore from 'memorystore'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { registerRoutes } from './routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 5000

// Session configuration
const MemoryStoreSession = MemoryStore(session)
app.use(session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStoreSession({
        checkPeriod: 86400000
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}))

app.use(express.json())

// API routes
await registerRoutes(app)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(join(__dirname, '../client/dist')))

    app.get('*', (req, res) => {
        res.sendFile(join(__dirname, '../client/dist/index.html'))
    })
} else {
    // Development mode - Vite handles the frontend
    const { createServer } = await import('vite')
    const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa'
    })
    app.use(vite.ssrFixStacktrace)
    app.use(vite.middlewares)
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`)
})