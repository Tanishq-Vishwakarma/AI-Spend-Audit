# Tests

## How to Run

```bash
cd backend
npm test
```

## Test Suites

### 1. Audit Engine Tests
**File:** `src/lib/__tests__/auditEngine.test.ts`
**How to run:** `cd backend && npm test`

---

#### Test 1 — Claude Team overkill for small teams
**What it covers:** When a user has Claude Team plan with fewer 
than 5 seats, the engine should recommend downgrading to 
individual Pro plans since Team is designed for 5+ seats.
**Input:** teamSize: 2, Claude Team, 2 seats, $60/mo
**Expected:** savings > 0, recommendedAction === 'downgrade'

---

#### Test 2 — Already optimal detection
**What it covers:** A user on Cursor Hobby (free) with 1 seat 
should return zero savings and isOptimal === true. The engine 
should not manufacture fake recommendations.
**Input:** teamSize: 1, Cursor Hobby, 1 seat, $0/mo
**Expected:** totalSavings === 0, isOptimal === true

---

#### Test 3 — Redundant coding tools detection
**What it covers:** A user paying for both Cursor Pro and 
GitHub Copilot Individual simultaneously should have one 
flagged as redundant since both are coding assistants 
covering the same use case.
**Input:** teamSize: 3, Cursor Pro 3 seats $60/mo + 
GitHub Copilot Individual 3 seats $30/mo
**Expected:** at least one recommendation with 
recommendedAction === 'eliminate', totalSavings > 0

---

#### Test 4 — Credex CTA threshold
**What it covers:** When total savings exceed $500/month, 
showCredexCta should be true so the results page surfaces 
the Credex consultation offer.
**Input:** teamSize: 10, Cursor Pro + GitHub Copilot 
Business + Windsurf Pro + Claude Pro + ChatGPT Plus 
across 10 seats
**Expected:** totalSavings > 500, showCredexCta === true

---

#### Test 5 — Annual savings calculation
**What it covers:** totalAnnualSavings must always equal 
exactly totalSavings * 12. Tests that the multiplication 
is correct and not hardcoded or approximated.
**Input:** teamSize: 2, Claude Team, 2 seats, $60/mo
**Expected:** totalAnnualSavings === totalSavings * 12

---

#### Test 6 — Redundant LLM tools detection
**What it covers:** A user paying for both Claude Pro and 
ChatGPT Plus should have one flagged for consolidation 
since both are general-purpose LLMs covering the same 
use case.
**Input:** teamSize: 3, Claude Pro 3 seats $60/mo + 
ChatGPT Plus 3 seats $60/mo
**Expected:** at least one recommendation with 
recommendedAction === 'consolidate'

---

### 2. AI Service Tests
**File:** `src/services/__tests__/aiService.test.ts`
**How to run:** `cd backend && npm test`

---

#### Test 7 — Fallback summary on API failure
**What it covers:** When the Gemini API returns an error 
response (simulated via mocked fetch), the service should 
return the templated fallback string rather than throwing. 
This ensures the audit result is always usable even when 
AI is unavailable.
**Input:** fetch mocked to return error response
**Expected:** result is a non-empty string containing 
the teamSize and totalMonthlySpend values

---

#### Test 8 — Returns AI summary on success
**What it covers:** When the Gemini API returns a valid 
response, the service correctly extracts the text from 
candidates[0].content.parts[0].text and returns it.
**Input:** fetch mocked to return valid Gemini response
**Expected:** result === the mocked text string exactly

---

## CI

All 8 tests run automatically on every push to main via 
`.github/workflows/ci.yml`. Check the Actions tab on GitHub 
for the latest run status.

## Coverage Notes

The audit engine is the most critical path and has the most 
test coverage — 6 of 8 tests cover it directly. The AI service 
tests focus on the fallback behavior since that is the 
safety-critical path (a failed API call must never break 
the audit result for the user).

Areas not covered by automated tests (manual testing only):
- Frontend form localStorage persistence
- Lead capture form submission
- Email delivery via Resend
- End-to-end audit flow from form to results page