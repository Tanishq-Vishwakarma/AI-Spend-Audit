import dotenv from 'dotenv'
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function generateAuditSummary(auditData: any): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a financial advisor for tech startups. Write a 100-word personalized audit summary for this team. Be direct and specific — mention their actual tools and numbers. Do not use filler phrases like "it's important to note."

Team size: ${auditData.teamSize}
Primary use case: ${auditData.useCase}
Current monthly AI spend: $${auditData.totalMonthlySpend}
Potential monthly savings: $${auditData.totalSavings}
Tools in use: ${auditData.tools.map((t: any) => t.toolId).join(', ')}
Top recommendation: ${auditData.topRecommendation}

Write in second person. End with one concrete next step. Keep it under 100 words.`
            }]
          }]
        })
      }
    )

    const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    console.log('Gemini raw response:', JSON.stringify(data, null, 2))

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No text in response')
    return text

  } catch (error) {
    console.error('Gemini API failed, using fallback:', error)
    return `Your team of ${auditData.teamSize} is currently spending $${auditData.totalMonthlySpend}/month on AI tools. Based on your usage patterns, you could save up to $${auditData.totalSavings}/month by optimizing your plan selections and eliminating redundant tools. The biggest opportunity is in consolidating overlapping tools. Start by cancelling the lowest-value subscription this week.`
  }
}