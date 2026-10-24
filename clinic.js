// Two routers over the same static data:
//  doctorApi -> what a doctor's office system would expose (needs x-api-key)
//  appApi    -> what the Pip website calls with a patient code
const express = require('express')
const { PATIENTS } = require('./data')

const find = (id) => PATIENTS.find((p) => p.id === String(id || '').trim().toUpperCase())

// Human-friendly bullet points for one prescription
function simplify(rx) {
  return rx.medicines.map((m) => `${m.name}: ${m.dose}, ${m.when}, for ${m.days} day${m.days > 1 ? 's' : ''}`)
}

const patientView = (p) => ({
  patientId: p.id, name: p.name, age: p.age, gender: p.gender,
  clinic: p.clinic, doctor: p.doctor, allergies: p.allergies,
})
const prescriptionsOf = (p) => p.prescriptions.map((rx) => ({
  ...rx, patientId: p.id, doctor: p.doctor, clinic: p.clinic.name, simplified: simplify(rx),
}))
const appointmentsOf = (p) => p.appointments.map((a) => ({
  ...a, patientId: p.id, doctor: p.doctor, clinic: p.clinic.name, address: p.clinic.address,
}))

// ----- Doctor-side API -----
const doctorApi = express.Router()
doctorApi.use((req, res, next) => {
  const key = process.env.DOCTOR_API_KEY || 'demo-doctor-key'
  if (req.get('x-api-key') !== key) return res.status(401).json({ error: 'Missing or wrong x-api-key header.' })
  next()
})
doctorApi.get('/patients', (req, res) => res.json(PATIENTS.map(patientView)))
doctorApi.get('/patients/:id', (req, res) => {
  const p = find(req.params.id)
  if (!p) return res.status(404).json({ error: 'Patient not found' })
  res.json(patientView(p))
})
doctorApi.get('/patients/:id/prescriptions', (req, res) => {
  const p = find(req.params.id)
  if (!p) return res.status(404).json({ error: 'Patient not found' })
  res.json(prescriptionsOf(p))
})
doctorApi.get('/patients/:id/appointments', (req, res) => {
  const p = find(req.params.id)
  if (!p) return res.status(404).json({ error: 'Patient not found' })
  res.json(appointmentsOf(p))
})
doctorApi.get('/appointments/upcoming', (req, res) => {
  const within = Number(req.query.withinDays || 7)
  const today = new Date().toISOString().slice(0, 10)
  const limit = new Date(Date.now() + within * 86400000).toISOString().slice(0, 10)
  const list = PATIENTS.flatMap(appointmentsOf)
    .filter((a) => a.status === 'scheduled' && a.date >= today && a.date <= limit)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  res.json(list)
})

// ----- App-side API (used by the Pip website) -----
const appApi = express.Router()
appApi.get('/patients/:id', (req, res) => {
  const p = find(req.params.id)
  if (!p) return res.status(404).json({ error: 'No patient with that code. Try PT-1001 to PT-1010.' })
  res.json({ patientId: p.id, name: p.name, clinic: p.clinic.name, doctor: p.doctor })
})
appApi.get('/patients/:id/sync', (req, res) => {
  const p = find(req.params.id)
  if (!p) return res.status(404).json({ error: 'No patient with that code. Try PT-1001 to PT-1010.' })
  res.json({ patient: patientView(p), prescriptions: prescriptionsOf(p), appointments: appointmentsOf(p) })
})

module.exports = { doctorApi, appApi }
