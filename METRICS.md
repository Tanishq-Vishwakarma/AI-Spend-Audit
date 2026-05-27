# Metrics

## North Star Metric
**Audits completed per week.**

Not visits, not signups, not emails captured. An audit completed 
means a user got real value from the tool — they saw their savings 
number. Every downstream metric (leads, consultations, revenue) 
is a function of this one. If audits completed grows, everything 
else follows. If it doesn't, nothing else matters.

Why not "emails captured"? Because that's a downstream conversion 
metric — it measures how well we capture value, not how much 
value we create. Optimizing for emails first leads to dark 
patterns (email gate before results). Optimizing for audits 
completed first leads to a better product.

Why not "DAU"? This tool is used once per quarter per team, 
not daily. DAU is the wrong shape for this product entirely.

## 3 Input Metrics That Drive the North Star

**1. Landing page → audit start rate (target: >40%)**
Someone landed on the page. Did they start filling the form? 
If this is low, the hero copy or the form itself is the problem. 
This is a copywriting and UX metric.

**2. Audit start → audit completion rate (target: >70%)**
Someone started the form. Did they finish and submit? 
If this is low, the form is too long, too confusing, or 
asks for information people don't have handy. This is a 
form UX metric.

**3. Audit completion → email capture rate (target: >20%)**
Someone saw their results. Did they give us their email? 
If this is low, the results page isn't compelling enough, 
or the value proposition of the email isn't clear. This is 
a results page design metric.

## What to Instrument First

In priority order:

1. `audit_completed` event — fire when POST /api/audit returns 
   successfully. Include: savings_amount, tools_count, use_case, 
   team_size. This is the North Star event.

2. `email_captured` event — fire when POST /api/leads succeeds. 
   Include: audit_id, savings_amount, show_credex_cta.

3. `credex_cta_clicked` event — fire when the Credex consultation 
   button is clicked. This is the direct revenue signal.

4. `share_url_copied` event — fire when the copy button is clicked. 
   This tracks the viral loop.

5. `audit_started` event — fire when the form first gains focus 
   or the first tool is added. Used to calculate start→completion 
   rate.

Use a simple event log table in Supabase for now — no need for 
a full analytics stack at this stage. PostHog free tier would 
be the next step.

## What Number Triggers a Pivot Decision

If after 500 audits completed:
- Email capture rate < 8% → the results page isn't delivering 
  enough value. Redesign the results page before spending more 
  on distribution.
- Audit completion rate < 40% → the form is broken. Shorten it, 
  add autofill, or reduce required fields.
- Credex CTA click rate < 2% of high-savings audits → the 
  Credex value proposition isn't landing. Rewrite the CTA copy 
  or reconsider the $500 threshold for showing it.

The number that would trigger stopping the tool entirely: 
if consultation booking rate from leads stays below 3% after 
50 consultations, the lead quality from this tool is too low 
to justify Credex's sales team time. At that point, pivot to 
a different lead qualification approach.