import { Router } from 'express'
import { createLead } from '../controllers/leadController'
import rateLimit from 'express-rate-limit'

const router = Router()

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // max 5 lead submissions per IP per hour
  message: { error: 'Too many submissions, please try again later' }
})

router.post('/', leadLimiter, createLead)

export default router