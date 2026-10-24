# Pip Health API (server)

Express API for the Pip health app: a pretend doctor's office with 10 patients
(PT-1001 to PT-1010), plus Gemini for the chatbot and prescription reading.

## Run locally
```bash
npm install
cp .env.example .env      # then put your Gemini key in .env
npm start                 # http://localhost:3001
```
Test: http://localhost:3001/api/clinic/patients/PT-1001/sync

## Deploy on Render
New -> Web Service -> this repo
- Build command: `npm install`
- Start command: `npm start`
- Environment: `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-2.5-flash`, `DOCTOR_API_KEY=demo-doctor-key`, `ALLOWED_ORIGIN=*`
  (later change ALLOWED_ORIGIN to your website URL)

## Endpoints
Doctor side (header `x-api-key: demo-doctor-key`):
- `GET /doctor-api/v1/patients`
- `GET /doctor-api/v1/patients/:id`
- `GET /doctor-api/v1/patients/:id/prescriptions`
- `GET /doctor-api/v1/patients/:id/appointments`
- `GET /doctor-api/v1/appointments/upcoming?withinDays=7`

Used by the website:
- `GET /api/clinic/patients/:id/sync`
- `POST /api/chat`
- `POST /api/prescriptions/read`
- `POST /api/explain`

All data is dummy and lives in `data.js`.
