# LLM Prompts

## AI Provider
Used Google Gemini 2.5 Flash (free tier) instead of Anthropic 
API due to cost constraints during development. The integration 
is structurally identical — switching to Anthropic would require 
only changing the fetch URL, model name, and response parsing. 
The prompt itself would be unchanged.

## Summary Generation Prompt

### Final prompt used in production:

You are a financial advisor for tech startups. Write a 100-word 
personalized audit summary for this team. Be direct and specific 
— mention their actual tools and numbers. Do not use filler 
phrases like "it's important to note."

Team size: {teamSize}
Primary use case: {useCase}
Current monthly AI spend: ${totalMonthlySpend}
Potential monthly savings: ${totalSavings}
Tools in use: {toolList}
Top recommendation: {topRecommendation}

Write in second person ("you", "your team"). End with one 
concrete next step. Keep it under 100 words.

### Why I wrote it this way

The "financial advisor" framing keeps the tone authoritative 
and numbers-focused rather than conversational. Without it, 
early versions produced outputs that felt like a chatbot 
rather than a professional recommendation.

Second person ("you", "your team") makes the summary feel 
personal and actionable rather than a generic report. 
"Your team of 5 is paying for three overlapping tools" 
hits differently than "The team has three overlapping tools."

The explicit instruction to avoid filler phrases came from 
testing — without it, the model would often open with 
"It's important to note that..." or "Based on the provided 
information..." which wasted the limited 100-word budget.

Ending with a concrete next step was added after early 
outputs felt complete but passive. A call to action in the 
summary reinforces the results page CTA.

### What I tried that didn't work

**Asking for bullet points:** Output was structured but felt 
robotic and didn't read naturally in the UI card. Prose works 
better for a personalized summary.

**150 word limit:** Too long for the UI card and users don't 
read it fully. 100 words forces tighter, more useful output.

**Removing the "financial advisor" framing:** Output became 
too casual and used hedging language ("you might want to 
consider..."). The framing adds useful authority.

**Asking for a headline + summary:** The headline was always 
generic ("AI Spend Audit Results") and added no value. 
Dropped it.

### Graceful fallback

When the Gemini API fails (network error, rate limit, 
model unavailable), the service returns a templated string:

"Your team of {teamSize} is currently spending 
${totalMonthlySpend}/month on AI tools. You could save up 
to ${totalSavings}/month by eliminating redundant tools. 
{topRecommendation} Start by cancelling the lowest-value 
subscription this week."

This was triggered during development when the gemini-2.0-flash 
model was called after its deprecation in February 2026. 
The fallback ensured the audit result was still usable 
even with no AI summary.

### Model selection note

Initially used gemini-2.0-flash which returned a 404 NOT_FOUND 
error — the model was deprecated by Google in February 2026. 
Switched to gemini-2.5-flash which resolved the issue. 
Lesson: never hardcode a model name without checking the 
current availability list.