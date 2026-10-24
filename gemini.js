// Server-side Gemini calls. The key never reaches the browser.
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

async function callGemini({ system, contents, maxTokens = 400, json = false }) {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    const e = new Error('GEMINI_API_KEY is not set on the server (server/.env).')
    e.status = 503
    throw e
  }
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const generationConfig = { temperature: 0.4, maxOutputTokens: maxTokens }
  // Stop 2.5 models spending the whole budget on hidden "thinking" (empty replies)
  if (model.includes('2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }
  if (json) generationConfig.responseMimeType = 'application/json'

  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      ...(system && { systemInstruction: { parts: [{ text: system }] } }),
      contents,
      generationConfig,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const e = new Error(`Gemini error ${res.status}: ${body.slice(0, 200)}`)
    e.status = 502
    throw e
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim()
  if (!text) {
    const e = new Error('Gemini returned an empty reply.')
    e.status = 502
    throw e
  }
  return text
}

const CHAT_SYSTEM = `You are Pip, a friendly health buddy chatting with a child (about 8-12 years old).
- Short sentences, simple warm words.
- You are NOT a doctor: never diagnose, never give medicine doses.
- Only general safe tips (rest, water, tell a grown-up).
- If anything sounds serious or you are unsure, tell them to get a grown-up or doctor now.
- 2-5 short sentences, at most one follow-up question. Never scary.`

const RX_SYSTEM = `You read photos of medical prescriptions and explain them simply for a family.
Rules:
- Only write what you can actually read. If a word is unclear, write "unclear" — never guess a medicine name or dose.
- Do not add medical advice that is not on the paper.
Return JSON: {"doctor": string|null, "date": string|null, "diagnosis": string|null,
"medicines": [{"name": string, "dose": string, "when": string, "days": string}],
"bullets": [string] (short plain points, one per medicine plus any advice),
"followUp": string|null, "unclear": boolean}`

const EXPLAIN_SYSTEM = `Explain this medical note for a family in plain, simple words.
Use 3-6 short bullet points starting with "- ". Do not diagnose or add new medical advice.
End with: "- Ask your doctor if anything is unclear."`

module.exports = { callGemini, CHAT_SYSTEM, RX_SYSTEM, EXPLAIN_SYSTEM }
