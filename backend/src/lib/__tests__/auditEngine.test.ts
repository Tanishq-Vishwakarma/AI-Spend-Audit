import { runAuditEngine, FormInput } from '../../services/auditEngine'

describe('Audit Engine', () => {

    // Test 1
    it('detects Claude Team overkill for small teams', () => {
        const input: FormInput = {
            teamSize: 2,
            useCase: 'writing',
            tools: [{ toolId: 'claude', planId: 'team', seats: 2, monthlySpend: 60 }],
        }
        const result = runAuditEngine(input)
        expect(result.totalSavings).toBeGreaterThan(0)
        expect(result.recommendations[0].recommendedAction).toBe('downgrade')
    })

    // Test 2
    it('returns zero savings for already optimal setup', () => {
        const input: FormInput = {
            teamSize: 1,
            useCase: 'coding',
            tools: [{ toolId: 'cursor', planId: 'hobby', seats: 1, monthlySpend: 0 }],
        }
        const result = runAuditEngine(input)
        expect(result.totalSavings).toBe(0)
        expect(result.isOptimal).toBe(true)
    })

    // Test 3
    it('flags redundant coding tools', () => {
        const input: FormInput = {
            teamSize: 3,
            useCase: 'coding',
            tools: [
                { toolId: 'cursor', planId: 'pro', seats: 3, monthlySpend: 60 },
                { toolId: 'github_copilot', planId: 'individual', seats: 3, monthlySpend: 30 },
            ],
        }
        const result = runAuditEngine(input)
        const eliminated = result.recommendations.find(r => r.recommendedAction === 'eliminate')
        expect(eliminated).toBeDefined()
        expect(result.totalSavings).toBeGreaterThan(0)
    })

    // Test 4
    it('sets showCredexCta true when savings exceed $500', () => {
        const input: FormInput = {
            teamSize: 10,
            useCase: 'coding',
            tools: [
                { toolId: 'cursor', planId: 'pro', seats: 10, monthlySpend: 200 },
                { toolId: 'github_copilot', planId: 'business', seats: 10, monthlySpend: 190 },
                { toolId: 'windsurf', planId: 'pro', seats: 10, monthlySpend: 150 },
                { toolId: 'claude', planId: 'pro', seats: 10, monthlySpend: 200 },
                { toolId: 'chatgpt', planId: 'plus', seats: 10, monthlySpend: 200 },
            ],
        }
        const result = runAuditEngine(input)
        expect(result.totalSavings).toBeGreaterThan(500)
        expect(result.showCredexCta).toBe(true)
    })

    // Test 5
    it('calculates annual savings as exactly 12x monthly', () => {
        const input: FormInput = {
            teamSize: 2,
            useCase: 'writing',
            tools: [{ toolId: 'claude', planId: 'team', seats: 2, monthlySpend: 60 }],
        }
        const result = runAuditEngine(input)
        expect(result.totalAnnualSavings).toBe(result.totalSavings * 12)
    })

    // Test 6
    it('flags redundant LLM tools', () => {
        const input: FormInput = {
            teamSize: 3,
            useCase: 'writing',
            tools: [
                { toolId: 'claude', planId: 'pro', seats: 3, monthlySpend: 60 },
                { toolId: 'chatgpt', planId: 'plus', seats: 3, monthlySpend: 60 },
            ],
        }
        const result = runAuditEngine(input)
        const consolidated = result.recommendations.find(r => r.recommendedAction === 'consolidate')
        expect(consolidated).toBeDefined()
    })

})