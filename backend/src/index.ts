import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { supabase } from './services/supabaseService'
import auditRoutes from './routes/audit'
import leadRoutes from './routes/leads'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}))
app.use(express.json())

// Routes
app.use('/api/audit', auditRoutes)
app.use('/api/leads', leadRoutes)

// Health check
app.get('/health', async (req, res) => {
  const { error } = await supabase.from('audits').select('id').limit(1)
  if (error) {
    return res.status(500).json({ status: 'DB connection failed', error: error.message })
  }
  res.json({ status: 'ok', db: 'connected' })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})