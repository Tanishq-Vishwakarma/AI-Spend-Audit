# User Interviews

Three conversations conducted during the week of May 20-26, 2025 
with potential users of the AI Spend Audit tool. Each conversation 
was 10-15 minutes via WhatsApp or in person.

---

## Interview 1
**Name:** Tarandeep Singh Khurana
**Role:** Machine Learning Intern 
**Company stage:** Mid-size company (team of 5 on his project)

### Notes
Tarandeep had GitHub Copilot Business access provided by his 
company — he didn't pay for it himself and had no visibility 
into what the company was paying. His entire 5-person project 
team had the same access. He used it exclusively for coding. 
Outside of Copilot, he uses Claude free and ChatGPT free for 
research and web searches — paid for nothing personally.

### Direct Quotes
- "I don't even know what plan we're on — the company just 
  gave us access. I assume it's the good one."
- "I use Claude free for research but it hits the limit pretty 
  fast. I just switch to GPT when that happens."
- "I never thought about whether the company is overpaying. 
  That's not really my problem as an intern."

### Most Surprising Thing
He had zero visibility into what his company was spending on 
his Copilot seat — and didn't consider it his concern. This 
was surprising because the tool is most useful for exactly 
this situation: a company paying for seats where individual 
users have no idea if the spend is justified.

### What It Changed About My Design
Added a "company-provided" option framing to the form — many 
users won't know their exact plan or spend. The audit should 
still work with approximate inputs. Also reinforced that the 
primary target user is the *manager* who bought the seats, 
not the individual using them. The engineering manager who 
provisioned 5 Copilot Business seats at $19/seat is the 
person who needs this tool, not Tarandeep.

---

## Interview 2
**Name:** Lavanya Jain
**Role:** Student / Developer
**Company stage:** Individual (student projects and freelance work)

### Notes
Lavanya had an interesting stack — Gemini Pro from Google's 
free student program (1 year), ChatGPT Pro available free 
in India at the time, and Claude free tier. She was 
effectively paying $0 but using three different AI tools 
with overlapping capabilities. Her use case split was clear: 
GPT and Claude for coding, Gemini specifically for summarizing 
Google Docs and emails.

### Direct Quotes
- "I use GPT and Claude for code because Gemini is not that 
  good at coding in my experience."
- "Gemini is actually really good for summarizing documents 
  and emails — better than the others for that."
- "I didn't realize I was using three different tools for 
  basically the same things. I just use whichever tab 
  is open."

### Most Surprising Thing
She had a clear mental model of which tool was best for 
which task — Gemini for docs, GPT/Claude for code — but 
had never articulated it before the conversation. When I 
asked her why she uses all three, she paused and said 
"I just use whichever tab is open." That gap between 
actual behavior and perceived behavior was interesting.

### What It Changed About My Design
Reinforced the importance of the "primary use case" field 
in the form. A user whose primary use case is "writing/docs" 
should get different recommendations than a coding-focused 
user. Lavanya's case also showed that students and free-tier 
users are not the primary target — the audit is most valuable 
when real money is being spent. Updated the "already optimal" 
result copy to be more useful for zero-spend users: "You're 
not spending anything — here's what to watch as your usage 
grows."

---

## Interview 3
**Name:** Yash Tiwari
**Role:** Senior Frontend Developer
**Company:** Walking Dreamz Technologies

### Notes
Yash was the most technically experienced of the three. He 
had Gemini Pro bundled with his Jio 5G mobile recharge — 
effectively free. He previously used Cursor when it first 
launched on the free plan but stopped using it after 
exhausting the free token allowance. His key insight: 
Cursor's free plan is limited to roughly 3 Gmail accounts 
per device, which he had already cycled through. He was 
specifically positive about Gemini Pro for frontend UI 
design work — long prompts, detailed outputs, no 
context limit issues unlike free tiers of GPT or Claude.

### Direct Quotes
- "Gemini is actually really good for UI design — you can 
  write a massive prompt describing exactly what you want 
  and it handles it. GPT free cuts you off."
- "Cursor was great when it launched but I burned through 
  the free tokens fast. Now I'd have to pay and I'm not 
  sure it's worth it over just using Gemini."
- "I didn't know there was a way to figure out if Cursor 
  Pro was actually worth paying for compared to what I'm 
  already getting free."

### Most Surprising Thing
He didn't know that Cursor Pro at $20/month could be 
compared systematically against his existing free Gemini 
access for the same coding tasks. The idea that a tool 
could surface that comparison for him — "here's what 
you're getting free vs what you'd pay for" — was 
genuinely new to him. He said he'd use the audit before 
deciding whether to pay for Cursor.

### What It Changed About My Design
Added stronger handling for the "free plan" inputs — a 
user comparing a paid option against a free alternative 
they already have is a real and common use case. The audit 
should explicitly surface "you already have X for free 
which covers this use case" as a recommendation, not just 
flag paid-vs-paid redundancy. Also highlighted that 
Gemini's bundling with Jio and other carriers in India 
is a real distribution consideration — many Indian users 
have Gemini Pro effectively free, which changes the 
recommendation logic for that market.