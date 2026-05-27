# AI Spend Audit

A free AI spend auditor for startup founders and engineering managers. 
Input your AI tools, plans, and team size — get an instant breakdown 
of where you're overspending and how much you could save monthly and annually.

## Screenshots
*Coming soon — adding after UI is built*

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Run Locally

**Backend:**
cd backend
npm install
cp .env.example .env  # fill in your keys
npm run dev

**Frontend:**
cd frontend
npm install
cp .env.local.example .env.local  # fill in your keys
npm run dev

Backend runs on http://localhost:3001
Frontend runs on http://localhost:3000

### Environment Variables

**backend/.env**
PORT=3001
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
FRONTEND_URL=http://localhost:3000

**frontend/.env.local**
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

## Decisions

1. **Next.js over plain React** — Built-in routing handles the 
   /audit/[id] shareable URL pattern cleanly. File-based routing 
   reduced boilerplate. Trade-off: heavier than needed for a 
   mostly-static form, but the SSR capability helps with Open Graph 
   meta tags on result pages.

2. **Separate Express backend over Next.js API routes** — Wanted 
   the audit engine fully isolated and independently testable with 
   Jest without any Next.js runtime dependencies. Trade-off: two 
   servers to deploy instead of one.

3. **Supabase over Firebase** — Postgres gives proper relational 
   structure for audit→lead foreign key. Supabase's free tier is 
   generous. Trade-off: Firebase has better real-time support but 
   we don't need real-time here.

4. **Hardcoded audit rules over AI for the audit logic** — The 
   audit math needs to be deterministic and defensible. An AI 
   generating savings numbers would be unpredictable and wrong. 
   AI is only used for the summary paragraph where creativity 
   is actually useful.

5. **Gemini over Anthropic API** — Gemini has a genuinely free 
   tier with no credit card required. For an internship assignment 
   generating ~100 word summaries, paying for API access is 
   unnecessary. Trade-off: would switch to Anthropic in production 
   for better output quality.

## Live URL
https://ai-spend-audit-six-self.vercel.app/