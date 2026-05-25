import { Metadata } from 'next'
import AuditClient from './AuditClient'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

async function getAuditData(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/audit/${id}`, {
      next: { revalidate: 3600 }
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const audit = await getAuditData(id)

  if (!audit) {
    return {
      title: 'AI Spend Audit',
      description: 'Free AI tool spend auditor for startups',
    }
  }

  const savings = audit.total_savings
  const annual = savings * 12
  const title = savings > 0
    ? `I could save $${savings}/mo on AI tools — here's my audit`
    : 'My AI stack is already optimized — here\'s the breakdown'
  const description = savings > 0
    ? `Found $${savings}/month ($${annual}/year) in potential AI tool savings. See the full breakdown.`
    : 'Got a free AI spend audit. Turns out my stack is well optimized.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'AI Spend Audit',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function AuditPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return <AuditClient id={id} />
}