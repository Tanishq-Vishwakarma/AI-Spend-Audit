export type Plan = {
  name: string
  monthlyPricePerSeat: number
}

export type Tool = {
  id: string
  name: string
  plans: Record<string, Plan>
}

export type UserToolInput = {
  toolId: string
  planId: string
  seats: number
  monthlySpend: number
}

export type FormInput = {
  teamSize: number
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed'
  tools: UserToolInput[]
}

export type ToolRecommendation = {
  toolName: string
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan: string | null
  savings: number
  reason: string
}

export type AuditResult = {
  teamSize: number
  useCase: string
  tools: UserToolInput[]
  totalMonthlySpend: number
  totalSavings: number
  totalAnnualSavings: number
  recommendations: ToolRecommendation[]
  topRecommendation: string
  showCredexCta: boolean
  isOptimal: boolean
}

// ── Pricing Data ─────────────────────────────────────────────
// All prices verified from official pricing pages
// Full citations in PRICING_DATA.md

export const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 0, // custom pricing
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 0, // custom
  },
  chatgpt: {
    plus: 20,
    team: 30,
    enterprise: 0, // custom
  },
  anthropic_api: {
    payg: 0, // pay as you go, no flat fee
  },
  openai_api: {
    payg: 0, // pay as you go, no flat fee
  },
  gemini: {
    free: 0,
    pro: 20,
    ultra: 0, // custom
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 35,
  },
}

const TOOL_NAMES: Record<string, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
}

// ── Redundancy Groups ─────────────────────────────────────────
// Tools in the same group do overlapping jobs
const REDUNDANCY_GROUPS: string[][] = [
  ['cursor', 'github_copilot', 'windsurf'], // coding assistants
  ['claude', 'chatgpt', 'gemini'],           // general LLMs
  ['anthropic_api', 'openai_api'],           // API direct
]

// ── Core Engine ───────────────────────────────────────────────

export function runAuditEngine(input: FormInput): AuditResult {
  const recommendations: ToolRecommendation[] = []
  let totalMonthlySpend = 0
  let totalSavings = 0

  for (const userTool of input.tools) {
    const { toolId, planId, seats, monthlySpend } = userTool
    const toolName = TOOL_NAMES[toolId] || toolId
    const planPrice = PRICING[toolId]?.[planId] ?? 0
    const expectedSpend = planPrice * seats

    totalMonthlySpend += monthlySpend

    // Check 1: Over-seated plan
    // e.g. Claude Team requires min 5 seats — if team is 2, recommend Pro
    if (toolId === 'claude' && planId === 'team' && input.teamSize < 5) {
      const proSpend = PRICING.claude.pro * input.teamSize
      const saving = monthlySpend - proSpend
      if (saving > 0) {
        recommendations.push({
          toolName,
          currentPlan: planId,
          currentSpend: monthlySpend,
          recommendedAction: 'downgrade',
          recommendedPlan: 'pro',
          savings: saving,
          reason: `Claude Team is designed for 5+ seats. Your team of ${input.teamSize} would pay less on individual Pro plans ($${proSpend}/mo vs $${monthlySpend}/mo).`,
        })
        totalSavings += saving
        continue
      }
    }

    // Check 2: GitHub Copilot Individual vs Business over-spend
    if (toolId === 'github_copilot' && planId === 'business' && input.teamSize <= 3) {
      const individualSpend = PRICING.github_copilot.individual * seats
      const saving = monthlySpend - individualSpend
      if (saving > 0) {
        recommendations.push({
          toolName,
          currentPlan: planId,
          currentSpend: monthlySpend,
          recommendedAction: 'downgrade',
          recommendedPlan: 'individual',
          savings: saving,
          reason: `For a team of ${input.teamSize}, Copilot Individual ($10/seat) covers the same core features as Business ($19/seat). Business extras (org policies, audit logs) are unnecessary at this size.`,
        })
        totalSavings += saving
        continue
      }
    }

    // Check 3: Redundant coding tools
    const codingTools = ['cursor', 'github_copilot', 'windsurf']
    const userCodingTools = input.tools.filter(t =>
      codingTools.includes(t.toolId)
    )
    if (
      codingTools.includes(toolId) &&
      userCodingTools.length > 1 &&
      input.useCase !== 'writing' &&
      input.useCase !== 'research'
    ) {
      // Find the cheapest coding tool the user has
      const cheapest = userCodingTools.reduce((a, b) =>
        (PRICING[a.toolId]?.[a.planId] ?? 0) * a.seats <
        (PRICING[b.toolId]?.[b.planId] ?? 0) * b.seats
          ? a
          : b
      )
      if (cheapest.toolId !== toolId) {
        recommendations.push({
          toolName,
          currentPlan: planId,
          currentSpend: monthlySpend,
          recommendedAction: 'eliminate',
          recommendedPlan: null,
          savings: monthlySpend,
          reason: `You're paying for ${userCodingTools.length} coding assistants simultaneously. ${TOOL_NAMES[cheapest.toolId]} covers the same use case. Consolidating saves $${monthlySpend}/mo.`,
        })
        totalSavings += monthlySpend
        continue
      }
    }

    // Check 4: Redundant LLM tools
    const llmTools = ['claude', 'chatgpt', 'gemini']
    const userLlmTools = input.tools.filter(t => llmTools.includes(t.toolId))
    if (llmTools.includes(toolId) && userLlmTools.length > 1) {
      const cheapest = userLlmTools.reduce((a, b) =>
        (PRICING[a.toolId]?.[a.planId] ?? 0) * a.seats <
        (PRICING[b.toolId]?.[b.planId] ?? 0) * b.seats
          ? a
          : b
      )
      if (cheapest.toolId !== toolId) {
        recommendations.push({
          toolName,
          currentPlan: planId,
          currentSpend: monthlySpend,
          recommendedAction: 'consolidate',
          recommendedPlan: TOOL_NAMES[cheapest.toolId],
          savings: monthlySpend,
          reason: `You're paying for multiple general-purpose LLMs. Most teams pick one. Consolidating to ${TOOL_NAMES[cheapest.toolId]} saves $${monthlySpend}/mo with no capability loss for ${input.useCase} tasks.`,
        })
        totalSavings += monthlySpend
        continue
      }
    }

    // Check 5: Already optimal
    recommendations.push({
      toolName,
      currentPlan: planId,
      currentSpend: monthlySpend,
      recommendedAction: 'keep',
      recommendedPlan: planId,
      savings: 0,
      reason: `${toolName} ${planId} is well-suited for your team size and use case. No changes recommended.`,
    })
  }

  const topRecommendation =
    recommendations
      .filter(r => r.savings > 0)
      .sort((a, b) => b.savings - a.savings)[0]?.reason ||
    'Your current AI stack is well optimized.'

  const isOptimal = totalSavings === 0
  const showCredexCta = totalSavings > 500

  return {
    teamSize: input.teamSize,
    useCase: input.useCase,
    tools: input.tools,
    totalMonthlySpend,
    totalSavings,
    totalAnnualSavings: totalSavings * 12,
    recommendations,
    topRecommendation,
    showCredexCta,
    isOptimal,
  }
}