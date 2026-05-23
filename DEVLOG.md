## Day 1 — 2025-05-20
**Hours worked:** 3
**What I did:** Read and analyzed the full assignment brief carefully. 
Identified all 6 MVP features and mapped out what each requires. 
Researched Supabase, Resend, and Gemini API to understand free tier 
limits. Decided on tech stack: Next.js frontend, Express backend, 
Supabase DB, Gemini for AI summary. Made notes on pricing data sources 
I'll need to verify for PRICING_DATA.md.
**What I learned:** The assignment evaluates entrepreneurial thinking 
(GTM, ECONOMICS, USER_INTERVIEWS) as heavily as code — 25 points vs 
15 for engineering. Adjusted my time allocation plan accordingly.
**Blockers / what I'm stuck on:** Anthropic API has no free tier — 
minimum $5 top-up. Decided to use Gemini free tier instead and 
document the reasoning in PROMPTS.md.
**Plan for tomorrow:** Set up monorepo folder structure, initialize 
Next.js and Express, install all packages, connect Supabase.

## Day 2 — 2025-05-21
**Hours worked:** 4
**What I did:** Set up the full monorepo structure with frontend/ 
and backend/ folders. Initialized Next.js with TypeScript and 
Tailwind v3 (downgraded from v4 for compatibility). Initialized 
Express backend with TypeScript. Installed all required packages 
for both. Created Supabase project, ran SQL to create audits and 
leads tables. Connected Supabase in backend and verified the 
/health endpoint returns db: connected.
**What I learned:** Tailwind v4 ships by default with 
create-next-app now — had to manually uninstall and reinstall v3. 
The Supabase anon key is safe for frontend exposure via NEXT_PUBLIC_ 
prefix but service role key must stay backend only.
**Blockers / what I'm stuck on:** Resend free tier only allows 
sending from onboarding@resend.dev without a custom domain. 
Acceptable for this assignment.
**Plan for tomorrow:** Initialize git repo, push to GitHub, set up 
CI with GitHub Actions.

## Day 3 — 2025-05-22
**Hours worked:** 3
**What I did:** Initialized git repo, created .gitignore to exclude 
.env files and node_modules. Created GitHub Actions CI workflow in 
.github/workflows/ci.yml. Had to write a placeholder test so CI 
wouldn't fail on empty test suite. Fixed TypeScript config — added 
jest and node to types array in tsconfig.json so Jest globals 
(describe, it, expect) were recognized. First commit pushed and 
CI went green.
**What I learned:** GitHub Actions now warns about Node.js 20 
deprecation — updated workflow to use Node 22. TypeScript requires 
explicit types array in tsconfig when using Jest, otherwise it 
doesn't recognize test runner globals.
**Blockers / what I'm stuck on:** CI was failing due to missing 
test files — solved by adding placeholder test first, then replacing 
with real tests.
**Plan for tomorrow:** Build the core audit engine with full pricing 
logic and replace placeholder test with real tests covering all 
edge cases.

## Day 4 — 2025-05-23
**Hours worked:** 5
**What I did:** Built the complete audit engine in 
backend/src/lib/auditEngine.ts. Implemented 5 audit checks: 
Claude Team overkill for small teams, GitHub Copilot Business 
overkill for small teams, redundant coding tools detection, 
redundant LLM tools detection, and already-optimal detection. 
Added full pricing data for all 8 required tools. Wrote 6 Jest 
tests covering all major engine behaviors. Fixed a TypeScript 
error in the reduce() comparisons — missing comparison operator 
caused "Type Number has no call signatures" error. All 6 tests 
passing. Built backend routes, controllers, AI service (Gemini), 
email service (Resend), and wired everything together in index.ts.
**What I learned:** The audit engine should be a pure function 
with no side effects — this makes it trivially testable. Keeping 
AI out of the audit math and only using it for the summary 
paragraph was the right call — deterministic rules are 
auditable and defensible.
**Blockers / what I'm stuck on:** Need to verify all pricing 
URLs are current before submission — prices may have changed.
**Plan for tomorrow:** Build the frontend — input form with 
localStorage persistence, results page, lead capture form.