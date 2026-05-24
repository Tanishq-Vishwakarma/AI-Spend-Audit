import { Router } from 'express'
import { createAudit, getAudit } from '../controllers/auditController'
import rateLimit from 'express-rate-limit'

const router = Router()

const auditLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 audits per IP per 15 min
  message: { error: 'Too many requests, please try again later' }
})

router.post('/', auditLimiter, createAudit)
router.get('/:id', getAudit)

export default router