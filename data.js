// ---------------------------------------------------------------------------
// STATIC DUMMY DATA — pretend "doctor's office" records for 10 patients.
// Dates are worked out from TODAY, so appointments are always in the future.
// No real people. Codes PT-1001 ... PT-1010.
// ---------------------------------------------------------------------------

function daysFromToday(n, time = '10:00') {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return { date: d.toISOString().slice(0, 10), time }
}

const clinics = {
  sunrise: { name: 'Sunrise Kids Clinic', phone: '+91 98100 11111', address: 'Sector 14, Sonipat' },
  green: { name: 'Green Valley Family Care', phone: '+91 98100 22222', address: 'Model Town, Delhi' },
  city: { name: 'City Care Hospital', phone: '+91 98100 33333', address: 'MG Road, Gurugram' },
}

// Each patient: profile + prescriptions + appointments
const PATIENTS = [
  {
    id: 'PT-1001', name: 'Aarav Sharma', age: 9, gender: 'M', clinic: clinics.sunrise, doctor: 'Dr. Meera Kapoor (Pediatrician)',
    allergies: ['Peanuts'],
    prescriptions: [
      { id: 'RX-1001-1', issued: daysFromToday(-3).date, diagnosis: 'Common cold', medicines: [
        { name: 'Paracetamol syrup 250 mg/5 ml', dose: '5 ml', when: 'Every 6 hours if fever', days: 3 },
        { name: 'Saline nasal drops', dose: '2 drops each side', when: 'Three times a day', days: 5 },
      ], advice: 'Warm fluids, rest, no cold drinks.' },
    ],
    appointments: [{ id: 'AP-1001-1', ...daysFromToday(1, '10:30'), reason: 'Follow-up for cold', status: 'scheduled' }],
  },
  {
    id: 'PT-1002', name: 'Diya Verma', age: 11, gender: 'F', clinic: clinics.sunrise, doctor: 'Dr. Meera Kapoor (Pediatrician)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1002-1', issued: daysFromToday(-10).date, diagnosis: 'Mild asthma', medicines: [
        { name: 'Salbutamol inhaler 100 mcg', dose: '1 puff', when: 'When breathless (max 4 times a day)', days: 30 },
      ], advice: 'Carry inhaler to school. Avoid dust and smoke.' },
    ],
    appointments: [{ id: 'AP-1002-1', ...daysFromToday(3, '16:00'), reason: 'Asthma review', status: 'scheduled' }],
  },
  {
    id: 'PT-1003', name: 'Kabir Singh', age: 8, gender: 'M', clinic: clinics.green, doctor: 'Dr. Rohan Mehta (General Physician)',
    allergies: ['Dust'],
    prescriptions: [
      { id: 'RX-1003-1', issued: daysFromToday(-1).date, diagnosis: 'Stomach upset', medicines: [
        { name: 'ORS sachet', dose: '1 sachet in 1 litre water', when: 'Sip through the day', days: 2 },
        { name: 'Probiotic sachet', dose: '1 sachet', when: 'Once a day after lunch', days: 5 },
      ], advice: 'Light food: khichdi, curd, banana.' },
    ],
    appointments: [{ id: 'AP-1003-1', ...daysFromToday(2, '11:00'), reason: 'Check stomach is better', status: 'scheduled' }],
  },
  {
    id: 'PT-1004', name: 'Ananya Iyer', age: 12, gender: 'F', clinic: clinics.city, doctor: 'Dr. Priya Nair (Dermatologist)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1004-1', issued: daysFromToday(-7).date, diagnosis: 'Skin rash (eczema)', medicines: [
        { name: 'Moisturising cream', dose: 'Thin layer', when: 'Twice a day', days: 14 },
        { name: 'Cetirizine syrup 5 mg/5 ml', dose: '5 ml', when: 'At night', days: 7 },
      ], advice: 'Cotton clothes, short lukewarm baths.' },
    ],
    appointments: [{ id: 'AP-1004-1', ...daysFromToday(7, '12:15'), reason: 'Skin check', status: 'scheduled' }],
  },
  {
    id: 'PT-1005', name: 'Vihaan Gupta', age: 10, gender: 'M', clinic: clinics.city, doctor: 'Dr. Arjun Rao (Orthopedist)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1005-1', issued: daysFromToday(-14).date, diagnosis: 'Sprained ankle', medicines: [
        { name: 'Ibuprofen syrup 100 mg/5 ml', dose: '5 ml', when: 'After food, twice a day if pain', days: 3 },
      ], advice: 'Ice pack 15 min, keep foot raised, crepe bandage.' },
    ],
    appointments: [{ id: 'AP-1005-1', ...daysFromToday(5, '09:30'), reason: 'Ankle X-ray review', status: 'scheduled' }],
  },
  {
    id: 'PT-1006', name: 'Saanvi Reddy', age: 7, gender: 'F', clinic: clinics.green, doctor: 'Dr. Kavita Joshi (ENT)',
    allergies: ['Penicillin'],
    prescriptions: [
      { id: 'RX-1006-1', issued: daysFromToday(-2).date, diagnosis: 'Ear pain', medicines: [
        { name: 'Azithromycin syrup 200 mg/5 ml', dose: '4 ml', when: 'Once a day', days: 3 },
        { name: 'Paracetamol syrup 250 mg/5 ml', dose: '4 ml', when: 'If pain or fever', days: 3 },
      ], advice: 'Keep ears dry. No swimming this week.' },
    ],
    appointments: [{ id: 'AP-1006-1', ...daysFromToday(4, '17:30'), reason: 'Ear check', status: 'scheduled' }],
  },
  {
    id: 'PT-1007', name: 'Reyansh Patel', age: 13, gender: 'M', clinic: clinics.sunrise, doctor: 'Dr. Meera Kapoor (Pediatrician)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1007-1', issued: daysFromToday(-20).date, diagnosis: 'Low iron', medicines: [
        { name: 'Iron + folic acid syrup', dose: '5 ml', when: 'Once a day after breakfast', days: 60 },
      ], advice: 'Eat spinach, dates, jaggery, lentils.' },
    ],
    appointments: [{ id: 'AP-1007-1', ...daysFromToday(10, '10:00'), reason: 'Blood test result', status: 'scheduled' }],
  },
  {
    id: 'PT-1008', name: 'Myra Khan', age: 9, gender: 'F', clinic: clinics.city, doctor: 'Dr. Sameer Ali (General Physician)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1008-1', issued: daysFromToday(-4).date, diagnosis: 'Viral fever', medicines: [
        { name: 'Paracetamol syrup 250 mg/5 ml', dose: '5 ml', when: 'Every 6 hours if fever above 38°C', days: 3 },
      ], advice: 'Plenty of water, rest at home 2 days.' },
    ],
    appointments: [
      { id: 'AP-1008-1', ...daysFromToday(0, '18:00'), reason: 'Fever follow-up', status: 'scheduled' },
      { id: 'AP-1008-2', ...daysFromToday(-4, '11:00'), reason: 'Fever visit', status: 'completed' },
    ],
  },
  {
    id: 'PT-1009', name: 'Arjun Nair', age: 11, gender: 'M', clinic: clinics.green, doctor: 'Dr. Rohan Mehta (General Physician)',
    allergies: ['Pollen'],
    prescriptions: [
      { id: 'RX-1009-1', issued: daysFromToday(-6).date, diagnosis: 'Seasonal allergy', medicines: [
        { name: 'Levocetirizine 2.5 mg/5 ml syrup', dose: '5 ml', when: 'At bedtime', days: 10 },
      ], advice: 'Wash face after playing outside.' },
    ],
    appointments: [{ id: 'AP-1009-1', ...daysFromToday(6, '15:00'), reason: 'Allergy review', status: 'cancelled' }],
  },
  {
    id: 'PT-1010', name: 'Ira Malhotra', age: 10, gender: 'F', clinic: clinics.sunrise, doctor: 'Dr. Neha Bansal (Eye specialist)',
    allergies: [],
    prescriptions: [
      { id: 'RX-1010-1', issued: daysFromToday(-30).date, diagnosis: 'Short sight', medicines: [
        { name: 'Lubricating eye drops', dose: '1 drop each eye', when: 'Three times a day', days: 30 },
      ], advice: 'Wear glasses. 20-20-20 rule for screens.' },
    ],
    appointments: [{ id: 'AP-1010-1', ...daysFromToday(14, '11:45'), reason: 'Eye power check', status: 'scheduled' }],
  },
]

module.exports = { PATIENTS }
