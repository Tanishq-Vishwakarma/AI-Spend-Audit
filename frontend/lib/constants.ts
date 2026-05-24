export const TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    plans: [
      { id: 'hobby', name: 'Hobby', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'business', name: 'Business', price: 40 },
      { id: 'enterprise', name: 'Enterprise', price: 0 },
    ],
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    plans: [
      { id: 'individual', name: 'Individual', price: 10 },
      { id: 'business', name: 'Business', price: 19 },
      { id: 'enterprise', name: 'Enterprise', price: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'max', name: 'Max', price: 100 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 0 },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    plans: [
      { id: 'plus', name: 'Plus', price: 20 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 0 },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    plans: [
      { id: 'payg', name: 'Pay as you go', price: 0 },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    plans: [
      { id: 'payg', name: 'Pay as you go', price: 0 },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro (Advanced)', price: 20 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 15 },
      { id: 'teams', name: 'Teams', price: 35 },
    ],
  },
]

export const USE_CASES = [
  { id: 'coding', name: 'Coding / Engineering' },
  { id: 'writing', name: 'Writing / Content' },
  { id: 'data', name: 'Data / Analysis' },
  { id: 'research', name: 'Research' },
  { id: 'mixed', name: 'Mixed / General' },
]