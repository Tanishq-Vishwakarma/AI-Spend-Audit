import { Request, Response } from 'express'
import { runAuditEngine } from '../services/auditEngine'
import { generateAuditSummary } from '../services/aiService'
import { saveAudit, fetchAudit } from '../services/supabaseService'

export async function createAudit(req: Request, res: Response) {
  try {
    const formInput = req.body

    // Validate basic input
    if (!formInput.teamSize || !formInput.useCase || !formInput.tools?.length) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // 1. Run pure audit logic
    const auditResult = runAuditEngine(formInput)

    // 2. Generate AI summary (with fallback built in)
    const summary = await generateAuditSummary(auditResult)

    // 3. Save to Supabase
    const saved = await saveAudit({
      team_size: auditResult.teamSize,
      use_case: auditResult.useCase,
      tools: auditResult.tools,
      total_monthly_spend: auditResult.totalMonthlySpend,
      total_savings: auditResult.totalSavings,
      recommendations: auditResult.recommendations,
      summary,
      show_credex_cta: auditResult.showCredexCta,
      is_optimal: auditResult.isOptimal,
    })

    // 4. Return full result with ID
    res.json({
      id: saved.id,
      ...auditResult,
      summary,
    })

  } catch (error: any) {
    console.error('createAudit error:', error)
    res.status(500).json({ error: 'Failed to create audit' })
  }
}

export async function getAudit(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid audit ID' })
    }
    const audit = await fetchAudit(id)
    if (!audit) return res.status(404).json({ error: 'Audit not found' })
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit' })
  }
}