# Unit Economics

## What a Converted Lead Is Worth to Credex

Credex sells discounted AI infrastructure credits. Based on the 
product description (discounted Cursor, Claude, ChatGPT Enterprise 
credits from companies that overforecast):

- Estimated average deal size: $1,500 one-time credit purchase
- Estimated gross margin on credits: 25-35% (reselling at discount 
  means buying at deeper discount) → ~$400 gross profit per deal
- Estimated repurchase rate: 40% buy again within 6 months
- Blended LTV over 12 months: $400 + (0.40 × $400) = ~$560 per 
  converted customer

These are estimates. The real number depends on Credex's actual 
sourcing discount and deal sizes, which I don't have access to. 
But $500 LTV per converted customer is a reasonable conservative 
floor for the math below.

## Conversion Funnel

Based on typical B2B lead-gen tool benchmarks:

| Stage | Rate | Volume (from 1,000 audits) |
|-------|------|---------------------------|
| Audit completed → email captured | 20% | 200 leads |
| Email captured → consultation booked | 15% | 30 consultations |
| Consultation → credit purchase | 35% | 10-11 purchases |
| Overall: audit → purchase | ~1.1% | 11 purchases |

Revenue from 1,000 audits: 11 × $560 LTV = $6,160
Cost per audit (infrastructure): ~$0.01 (Supabase + Gemini API)
Cost per 1,000 audits: ~$10
Gross profit per 1,000 audits: ~$6,150

## CAC by Channel

| Channel | Effort | Est. Users/Month | CAC |
|---------|--------|-----------------|-----|
| Show HN post | 2 hrs | 150-300 | ~$0 |
| Reddit posts | 1 hr/week | 50-100 | ~$0 |
| Twitter DM outreach | 3 hrs/week | 20-40 | ~$0 |
| Existing Credex customer list | 1 email | 80-120 | ~$0 |
| SEO content (3 month lag) | 5 hrs/week | 200+ | ~$0 |

All channels are $0 paid budget. CAC is purely time cost. At a 
founder's time value of $50/hr, even 10 hrs/week = $2,000/month 
in time cost → break even at ~325 audits/month, which is 
achievable by week 3 of a focused launch.

## What Would Have to Be True for $1M ARR in 18 Months

$1M ARR for Credex means recurring credit purchases totaling 
$1M/year. At $1,500 average deal with 40% repurchase:

Need ~475 active repeat customers by month 18.

Working backwards:
- 475 repeat customers ÷ 0.40 repurchase rate = 1,190 total 
  first-time buyers needed
- 1,190 buyers ÷ 0.35 consultation→purchase rate = 3,400 
  consultations
- 3,400 consultations ÷ 0.15 email→consultation rate = 22,700 
  email captures
- 22,700 emails ÷ 0.20 audit→email rate = 113,500 audits 
  completed over 18 months
- That's ~6,300 audits/month by month 18

Month 1-3: 200-500 audits/month (community launch)
Month 4-9: 1,000-2,000/month (SEO kicks in, word of mouth)
Month 10-18: 5,000-8,000/month (established channel + 
  partnerships with startup accelerators)

This is aggressive but not impossible. The key assumption that 
has to hold: the consultation booking rate stays at 15%. If 
that drops to 5%, the whole model needs 3x the traffic. 
Improving that rate — through better email sequences, faster 
follow-up, and stronger Credex positioning on the results page 
— is the highest-leverage work after launch.

## Sensitivity Analysis

The number that kills this model if wrong: audit→email capture 
rate. If it's 5% instead of 20%, you need 4x the traffic for 
the same output. Everything else is recoverable. This is why 
the results page design and the email gate copy matter more 
than any other product decision.