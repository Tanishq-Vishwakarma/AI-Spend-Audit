'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAudit, submitLead } from '@/lib/api'

type Recommendation = {
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan: string | null
  savings: number
  reason: string
}

type AuditData = {
  total_savings: number
  team_size: number
  summary: string
  recommendations: Recommendation[]
  show_credex_cta: boolean
}

export default function AuditPage() {
  const params = useParams()
  const id = params.id as string
  const [audit, setAudit] = useState<AuditData | null>(null)
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadError, setLeadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAudit(id)
      .then(setAudit)
      .catch(() => setError('Audit not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading your audit...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  )

  if (!audit) return null

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLeadError('')
    setLeadLoading(true)
    try {
      await submitLead({
        auditId: id,
        email,
        companyName,
        role,
        teamSize: audit?.team_size,
      })
      setLeadSubmitted(true)
    } catch {
      setLeadError('Something went wrong. Please try again.')
    } finally {
      setLeadLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Spend Audit</h1>

        {/* Hero savings block */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <p className="text-sm text-green-700 font-medium uppercase tracking-wide">
            Potential Savings
          </p>
          <p className="text-5xl font-bold text-green-700 mt-1">
            ${audit.total_savings}/mo
          </p>
          <p className="text-green-600 mt-1">
            ${audit.total_savings * 12}/year
          </p>
        </div>

        {/* AI Summary */}
        {audit.summary && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Personalized Summary</h2>
            <p className="text-gray-700 leading-relaxed">{audit.summary}</p>
          </div>
        )}

        {/* Per tool recommendations */}
        <div className="space-y-4 mb-6">
          <h2 className="font-semibold text-gray-900">Recommendations</h2>
          {audit.recommendations?.map((rec: Recommendation, i: number) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{rec.toolName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {rec.currentPlan} — ${rec.currentSpend}/mo
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{rec.reason}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  {rec.savings > 0 ? (
                    <span className="text-green-600 font-semibold">
                      Save ${rec.savings}/mo
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Optimal</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credex CTA */}
        {audit.show_credex_cta && (
          <div className="bg-blue-600 rounded-xl p-6 text-white mb-6">
            <h2 className="text-xl font-bold mb-2">
              You qualify for a Credex consultation
            </h2>
            <p className="text-blue-100 mb-4">
              Your savings potential is significant. Credex sells discounted AI
              credits from companies that overforecast — you could save even more.
            </p>

            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 font-semibold px-6 py-3 
                         rounded-lg inline-block hover:bg-blue-50 transition-colors"
            >
              Book a Free Consultation →
            </a>
          </div>
        )}

        {/* Lead Capture */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {leadSubmitted ? (
            <div className="text-center py-4">
              <p className="text-2xl mb-2">✓</p>
              <p className="font-semibold text-gray-900">{"You're on the list"}</p>
              <p className="text-sm text-gray-500 mt-1">
                {"Check your inbox — we've sent your full report."}
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-gray-900 mb-1">
                Get this report in your inbox
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {audit.show_credex_cta
                  ? 'A Credex advisor will also reach out about discounted credits.'
                  : 'We\'ll notify you when new optimizations apply to your stack.'}
              </p>
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                {/* Honeypot — hidden from real users, bots fill it */}
                <input
                  type="text"
                  name="website"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <input
                  type="email"
                  required
                  placeholder="Work email *"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Company name"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Your role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {leadError && (
                  <p className="text-red-500 text-sm">{leadError}</p>
                )}
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                     text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {leadLoading ? 'Sending...' : 'Send Me the Report →'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>

        {/* Share URL */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Share this report
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 
                         text-sm text-gray-600 bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm 
                         hover:bg-gray-700 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}