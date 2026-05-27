# Reflection

## 1. The Hardest Bug

The hardest bug of the week was the Gemini API integration 
failing silently with a fallback every single time, even 
after the service was fully wired up. The symptom was clear 
— the audit result was returning the templated fallback 
string instead of an AI-generated summary — but the cause 
wasn't obvious at first.

My first hypothesis was that the API key was wrong or not 
being read from the .env file. I added a console.log to 
verify the key was loading — it was. Ruled that out.

Second hypothesis was that the request body format was 
wrong — maybe the Gemini API expected a different JSON 
structure. I checked the official docs and the structure 
looked correct. Still failing.

Third hypothesis was a network issue or CORS problem on 
the backend. I checked the raw fetch response by logging 
the full response object. That's when I saw the actual 
error: a 404 NOT_FOUND with the message "models/gemini-2.0-flash 
is not found for API version v1beta." The model name itself 
was the problem.

I then tried gemini-1.5-flash based on older documentation 
— same 404. Finally searched for the current available 
models and found that both gemini-2.0-flash and 
gemini-1.5-flash had been deprecated by Google in early 
2026. The correct model was gemini-2.5-flash. Switching 
the model name in the URL resolved it immediately.

The lesson was specific: never hardcode a model name 
from documentation without verifying it against the 
current available models list. AI provider APIs deprecate 
models faster than documentation gets updated. The fix 
was one word in a URL, but finding it required logging 
the raw response rather than just catching the error — 
which is what the fallback was doing and why it took 
longer to debug than it should have.

---

## 2. A Decision I Reversed Mid-Week

Honestly, there was no major architectural reversal 
mid-week. The stack and approach were clear from Day 1 
after spending the first two days purely on research and 
planning — understanding what Supabase, Resend, and the 
Gemini API each offered before writing a single line of 
code. That upfront time meant most decisions were already 
made before implementation started.

The one thing that changed was smaller: I initially planned 
to write the audit engine on the frontend for speed, 
thinking it would be simpler to keep everything in one 
place. While setting up the test suite I realized there 
was no clean way to write Jest tests against frontend 
code without pulling in Next.js testing infrastructure 
which added complexity. Moving the audit engine to the 
Express backend as a pure TypeScript function made it 
trivially testable with zero additional setup. That 
decision — keeping the audit engine as a pure function 
with no framework dependencies — turned out to be the 
right one for both testability and the separation of 
concerns the assignment was looking for.

---

## 3. What I Would Build in Week 2

The MVP works end to end but there are several directions 
worth pursuing depending on what the data shows.

First priority would be a weekly Slack digest integration. 
An engineering manager who runs an audit once isn't the 
same as one who gets a weekly "your AI spend this week 
was $X, up 12% from last week" message in their team 
Slack. That recurring touchpoint is where the habit forms 
and where Credex stays top of mind when someone's 
contract is up for renewal.

Second would be a CSV or invoice import. Right now users 
manually enter their spend. Several people I interviewed 
mentioned they don't actually know their exact monthly 
spend off the top of their head — they'd have to check 
their billing dashboard. A file upload that parses a 
Stripe invoice or a CSV export from their accounting 
tool would remove that friction entirely and make the 
audit more accurate.

Third would be a benchmark mode: "your AI spend per 
developer is $X — companies your size average $Y." This 
is the feature most likely to get shared on Twitter 
because it gives people a number to compare themselves 
against publicly. The shareable URL already exists — 
adding a benchmark comparison makes it more likely 
someone posts it.

Fourth would be a referral system — share the tool with 
another founder, both get a small Credex credit. This 
closes the viral loop that the shareable URL opens but 
doesn't fully complete.

---

## 4. How I Used AI Tools

I used Claude (free plan) throughout the week as a development
assistant, primarily for things that were completely new to me
or would have taken significant time to research from scratch.

What I used it for: setting up the monorepo structure and
install commands, the CI/CD workflow in .github/workflows/
ci.yml (GitHub Actions was new to me), resolving ESLint errors
I hadn't seen before, the Open Graph meta tag implementation
in Next.js, and general TypeScript patterns I wasn't familiar
with. I also used it for the frontend UI components and the
audit engine logic since I could verify the output made sense,
and for the entrepreneurial md files like GTM and ECONOMICS
where I provided the context and direction.

What I didn't trust it with: the pricing data for all the
tools in the audit engine. I verified every single price
manually against official vendor pricing pages because the
audit's credibility depends entirely on those numbers being
accurate. I also didn't trust it with decisions about the
overall architecture and folder structure — I understood
those well enough to verify they made sense before committing
to them.

One specific time the AI was wrong and I caught it: when I
asked about the Anthropic API it told me it was free — just
sign up and you get access. That was incorrect. The Anthropic
API has no free tier and requires a minimum $5 top-up. I
caught this when I actually went to console.anthropic.com
and saw the billing requirement. This is why I switched to
Gemini's genuinely free tier instead. It also reinforced the
rule: verify anything cost-related yourself, never trust an
AI's answer about pricing.

A second instance: the initial setup commands suggested
installing Tailwind which defaulted to v4, which has
compatibility issues and doesn't apply styling correctly
in many setups. I caught it because I've hit this problem
before and knew to downgrade to v3 immediately.

A third instance discovered during final testing: the email
service was built correctly and the code works as written,
but Resend's free tier resend.dev sender domain can only
deliver emails to the same address used to register the
Resend account. This is a platform restriction I wasn't
warned about and only discovered during live testing on the
deployed URL. In production this would be fixed by verifying
a custom domain on Resend. The AI never flagged this
limitation when helping build the email service — I had
to discover it myself through actual testing.

---

## 5. Self-Ratings

**Discipline: 10/10**
Committed to the repo on every working day across the 
full 7-day window. Started with research and planning 
before writing a single line of code, which paid off 
in fewer wasted decisions later. No days of cramming 
at the end.

**Code quality: 8/10**
The codebase is structured and readable with clear 
separation between routes, controllers, and services. 
TypeScript types are used throughout. The audit engine 
is a pure function which makes it testable and 
predictable. The reason it's not a 9 or 10 is that 
a production-grade version would follow a stricter 
MVC pattern with more formal validation layers and 
significantly higher test coverage. For an MVP built 
in 7 days the quality is solid, but I know where the 
shortcuts are.

**Design sense: 8/10**
The UI is clean, functional, and consistent. The results 
page hierarchy — hero savings number, AI summary, 
per-tool breakdown, CTA — follows a logical flow that 
matches how a user would want to consume the information. 
The reason it's not higher is that the design is 
functional rather than distinctive. It wouldn't get 
screenshotted for its aesthetics, only for its content. 
A stronger visual identity would help with the 
shareability of the result page.

**Problem solving: 10/10**
Every bug that came up this week got resolved. The 
Gemini model deprecation, the TypeScript reduce 
operator error, the ESLint setState in useEffect 
warning, the CI failures on Node.js version — each 
one was debugged systematically by reading the actual 
error output rather than guessing. No blocker lasted 
more than one session.

**Entrepreneurial thinking: 7/10**
The user interviews are genuine — three real people 
with specific, sometimes surprising insights that 
changed the product design in concrete ways. The 
GTM strategy is directionally correct and identifies 
real channels, though I'll be honest that it's based 
on research and pattern-matching from similar tools 
rather than firsthand distribution experience. The 
economics are reasoned estimates with visible 
assumptions rather than real data. A stronger version 
would have already posted in one of those communities 
and reported back with actual numbers.