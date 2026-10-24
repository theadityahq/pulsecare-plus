import { UserProfile } from '../types';

/**
 * PulseCare+ Demo Data
 * ONLY loaded when explicitly requested via URL parameter (?demo=1).
 * In normal production, the user starts with an empty profile ("Set up your Medical ID").
 */
export const DEMO_USER_PROFILE: UserProfile = {
  accountId: 'demo-user-01',
  name: 'Aditya Sharma',
  age: 22,
  dob: '2004-05-14',
  bloodType: 'O+ Positive',
  organDonor: true, // Self-declared organ donor preference; never marked as clinically verified
  criticalAllergies: ['Penicillin (Severe Anaphylaxis Risk)', 'Peanuts (Moderate)', 'NSAIDs / Ibuprofen'],
  chronicConditions: ['Mild Exercise-Induced Asthma'],
  currentMedications: ['Albuterol Inhaler (90mcg as needed)', 'Cetirizine 10mg (PRN)'],
  emergencyNotes: 'Carries rescue inhaler. Severe penicillin allergy, exercise extreme caution.',
  insurance: {
    provider: 'National Health Assurance Prime',
    policyNumber: 'NHA-9844-DL',
    groupNumber: 'GRP-3390'
  },
  lastUpdated: new Date().toISOString(),
  isEncrypted: false,
  lockScreenCard: {
    isEnabled: true,
    name: 'Aditya Sharma',
    bloodType: 'O+ Positive',
    criticalAllergies: ['Penicillin', 'Peanuts', 'NSAIDs'],
    primaryContactName: 'Dr. Priya Sharma (Mother)',
    primaryContactPhone: '+919876543210',
    emergencyNotes: 'Carries rescue inhaler. Severe penicillin allergy.'
  }
};
