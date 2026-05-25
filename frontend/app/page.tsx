'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TOOLS, USE_CASES } from '@/lib/constants'
import { submitAudit } from '@/lib/api'

type ToolEntry = {
  toolId: string
  planId: string
  seats: number
  monthlySpend: number
}

const STORAGE_KEY = 'ai_audit_form'

const defaultTool = (): ToolEntry => ({
  toolId: TOOLS[0].id,
  planId: TOOLS[0].plans[0].id,
  seats: 1,
  monthlySpend: 0,
})

export default function Home() {
  const router = useRouter()

  const [teamSize, setTeamSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 1
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).teamSize || 1
    } catch { /* ignore */ }
    return 1
  })

  const [useCase, setUseCase] = useState<string>(() => {
    if (typeof window === 'undefined') return 'coding'
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).useCase || 'coding'
    } catch { /* ignore */ }
    return 'coding'
  })

  const [tools, setTools] = useState<ToolEntry[]>(() => {
    if (typeof window === 'undefined') return [defaultTool()]
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved).tools || [defaultTool()]
    } catch { /* ignore */ }
    return [defaultTool()]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ teamSize, useCase, tools }))
  }, [teamSize, useCase, tools])

  function addTool() {
    setTools(prev => [...prev, defaultTool()])
  }

  function removeTool(index: number) {
    setTools(prev => prev.filter((_, i) => i !== index))
  }

  function updateTool(index: number, field: keyof ToolEntry, value: string | number) {
    setTools(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'toolId') {
        const tool = TOOLS.find(t => t.id === value)
        updated[index].planId = tool?.plans[0].id || ''
        updated[index].monthlySpend = (tool?.plans[0].price || 0) * updated[index].seats
      }

      if (field === 'planId') {
        const tool = TOOLS.find(t => t.id === updated[index].toolId)
        const plan = tool?.plans.find(p => p.id === value)
        if (plan) updated[index].monthlySpend = plan.price * updated[index].seats
      }

      if (field === 'seats') {
        const tool = TOOLS.find(t => t.id === updated[index].toolId)
        const plan = tool?.plans.find(p => p.id === updated[index].planId)
        if (plan) updated[index].monthlySpend = plan.price * Number(value)
      }

      return updated
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await submitAudit({ teamSize, useCase, tools })
      localStorage.removeItem(STORAGE_KEY)
      router.push(`/audit/${result.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Spend Audit</h1>
          <p className="mt-2 text-gray-600">
            Find out exactly where your team is overspending on AI tools.
            Free, instant, no login required.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About Your Team</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size
                </label>
                <input
                  type="number"
                  min={1}
                  value={teamSize === 0 ? '' : teamSize}
                  onChange={e => {
                    const val = e.target.value
                    setTeamSize(val === '' ? 0 : Number(val))
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Use Case
                </label>
                <select
                  value={useCase}
                  onChange={e => setUseCase(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {USE_CASES.map(uc => (
                    <option key={uc.id} value={uc.id}>{uc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your AI Tools</h2>
            {tools.map((tool, index) => {
              const toolDef = TOOLS.find(t => t.id === tool.toolId)
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-900">Tool {index + 1}</span>
                    {tools.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTool(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tool
                      </label>
                      <select
                        value={tool.toolId}
                        onChange={e => updateTool(index, 'toolId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {TOOLS.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plan
                      </label>
                      <select
                        value={tool.planId}
                        onChange={e => updateTool(index, 'planId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {toolDef?.plans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} {p.price > 0 ? `($${p.price}/seat)` : '(Free)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Seats
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={tool.seats === 0 ? '' : tool.seats}
                        onChange={e => updateTool(index, 'seats', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Spend ($)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={e => updateTool(index, 'monthlySpend', Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <button
              type="button"
              onClick={addTool}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl
                         py-4 text-gray-500 hover:border-blue-400 hover:text-blue-500
                         transition-colors"
            >
              + Add Another Tool
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-semibold py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? 'Running your audit...' : 'Run My Free Audit →'}
          </button>

          <p className="text-center text-sm text-gray-500">
            No login required. Results are instant.
          </p>
        </form>
      </div>
    </main>
  )
}