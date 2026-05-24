import { generateAuditSummary } from '../../services/aiService'

// Mock fetch globally
global.fetch = jest.fn()

describe('AI Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('returns fallback summary when Gemini API fails', async () => {
    // Mock fetch to simulate API failure
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ error: { code: 500, message: 'Server error' } }),
    })

    const auditData = {
      teamSize: 3,
      useCase: 'coding',
      totalMonthlySpend: 90,
      totalSavings: 60,
      tools: [{ toolId: 'cursor' }, { toolId: 'github_copilot' }],
      topRecommendation: 'Consolidate coding tools',
    }

    const result = await generateAuditSummary(auditData)

    // Should return fallback string, not throw
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain('3')   // teamSize
    expect(result).toContain('90')  // totalMonthlySpend
  })

  it('returns AI summary when Gemini API succeeds', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'Your team is overspending on AI tools.' }]
          }
        }]
      }),
    })

    const auditData = {
      teamSize: 3,
      useCase: 'coding',
      totalMonthlySpend: 90,
      totalSavings: 60,
      tools: [{ toolId: 'cursor' }],
      topRecommendation: 'Consolidate coding tools',
    }

    const result = await generateAuditSummary(auditData)
    expect(result).toBe('Your team is overspending on AI tools.')
  })
})