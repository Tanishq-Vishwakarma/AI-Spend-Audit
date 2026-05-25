const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function submitAudit(formData: {
  teamSize: number
  useCase: string
  tools: { toolId: string; planId: string; seats: number; monthlySpend: number }[]
}) {
  const res = await fetch(`${BACKEND_URL}/api/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error('Failed to submit audit')
  return res.json()
}

export async function getAudit(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/audit/${id}`)
  if (!res.ok) throw new Error('Audit not found')
  return res.json()
}

export async function submitLead(leadData: {
  auditId: string
  email: string
  companyName?: string
  role?: string
  teamSize?: number
}) {
  const res = await fetch(`${BACKEND_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData),
  })
  if (!res.ok) throw new Error('Failed to submit lead')
  return res.json()
}