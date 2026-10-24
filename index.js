// Pip API server
//  /                      health check
//  /doctor-api/v1/...     doctor-side dummy API (x-api-key)
//  /api/clinic/...        app pulls a patient's prescriptions + appointments by code
//  /api/chat              Gemini chatbot (key stays here)
//  /api/prescriptions/read  read a prescription photo with Gemini
//  /api/explain           explain a medical note in simple words
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const clinic = require('./clinic')
const { callGemini, CHAT_SYSTEM, RX_SYSTEM, EXPLAIN_SYSTEM } = require('./gemini')

const app = express()
const origins = (process.env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim())
app.use(cors({ origin: origins.includes('*') ? true : origins }))
app.use(express.json({ limit: '8mb' })) // photos come as base64

app.get('/', (req, res) => res.json({ ok: true, service: 'pip-clinic-api', patients: 'PT-1001..PT-1010' }))

app.use('/doctor-api/v1', clinic.doctorApi)
app.use('/api/clinic', clinic.appApi)

// Chatbot
app.post('/api/chat', async (req, res, next) => {
  try {
    const { history = [], message = '', vitals = null } = req.body || {}
    if (!message.trim()) return res.status(400).json({ error: 'Empty message' })
    const vitalsLine = vitals
      ? `\n\n(Latest check-in: symptoms ${vitals.symptoms?.join(', ') || 'none'}, mood ${vitals.mood || '-'}, ` +
        `temperature ${vitals.temperature}°C, heart rate ${vitals.heartRate} bpm)`
      : ''
    // Gemini needs the conversation to start with a user turn
    const turns = history.slice(-12).map((h) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] }))
    while (turns.length && turns[0].role !== 'user') turns.shift()
    turns.push({ role: 'user', parts: [{ text: message + vitalsLine }] })
    const reply = await callGemini({ system: CHAT_SYSTEM, contents: turns, maxTokens: 300 })
    res.json({ reply })
  } catch (e) { next(e) }
})

// Prescription photo -> simple points
app.post('/api/prescriptions/read', async (req, res, next) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body || {}
    if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' })
    const data = imageBase64.replace(/^data:[^;]+;base64,/, '')
    const text = await callGemini({
      system: RX_SYSTEM, json: true, maxTokens: 800,
      contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data } }, { text: 'Read this prescription.' }] }],
    })
    let parsed
    try { parsed = JSON.parse(text) } catch { parsed = { bullets: text.split('\n').filter(Boolean), medicines: [], unclear: true } }
    res.json(parsed)
  } catch (e) { next(e) }
})

// Explain a medical record
app.post('/api/explain', async (req, res, next) => {
  try {
    const { text = '', imageBase64, mimeType = 'image/jpeg' } = req.body || {}
    if (!text.trim() && !imageBase64) return res.status(400).json({ error: 'Send text or an image' })
    const parts = []
    if (imageBase64) parts.push({ inlineData: { mimeType, data: imageBase64.replace(/^data:[^;]+;base64,/, '') } })
    parts.push({ text: text.trim() || 'Explain this medical document.' })
    const explanation = await callGemini({ system: EXPLAIN_SYSTEM, contents: [{ role: 'user', parts }], maxTokens: 500 })
    res.json({ explanation })
  } catch (e) { next(e) }
})

app.use((req, res) => res.status(404).json({ error: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Pip API running on http://localhost:${PORT}`))
