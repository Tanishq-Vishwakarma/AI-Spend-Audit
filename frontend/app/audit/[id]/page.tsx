'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getAudit } from '@/lib/api'

export default function AuditPage() {
  const params = useParams()
  const id = params.id as string
  const [audit, setAudit] = useState<any>(null)
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
          {audit.recommendations?.map((rec: any, i: number) => (
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