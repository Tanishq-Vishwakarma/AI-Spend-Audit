import { Request, Response } from 'express'
import { saveLead } from '../services/supabaseService'
import { sendAuditConfirmationEmail } from '../services/emailService'
import { fetchAudit } from '../services/supabaseService'

export async function createLead(req: Request, res: Response) {
  try {
    const { auditId, email, companyName, role, teamSize } = req.body

    if (!auditId || !email) {
      return res.status(400).json({ error: 'auditId and email are required' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    // Save lead
    const lead = await saveLead({
      audit_id: auditId,
      email,
      company_name: companyName,
      role,
      team_size: teamSize,
    })

    // Fetch audit to get savings info for email
    const audit = await fetchAudit(auditId)

    // Send confirmation email (non-blocking)
    if (audit) {
      sendAuditConfirmationEmail(
        email,
        auditId,
        audit.total_savings,
        audit.show_credex_cta
      )
    }

    res.json({ success: true, id: lead.id })

  } catch (error) {
    console.error('createLead error:', error)
    res.status(500).json({ error: 'Failed to save lead' })
  }
}