import { EmergencyNumberInfo } from '../types';

export const EMERGENCY_NUMBERS: Record<string, EmergencyNumberInfo> = {
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    emergencyNumber: '112',
    ambulanceNumber: '108',
    mentalHealthHelpline: {
      name: 'Tele-MANAS (National Mental Health Helpline)',
      number: '14416',
      available: '24/7 Toll-Free'
    },
    source: 'Ministry of Home Affairs / MoHFW National Health Portal',
    verifiedAt: '2026-04-01'
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    emergencyNumber: '999',
    ambulanceNumber: '112',
    mentalHealthHelpline: {
      name: 'Samaritans',
      number: '116123',
      available: '24/7 Free'
    },
    source: 'UK National Health Service (NHS) & Home Office',
    verifiedAt: '2026-04-01'
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    emergencyNumber: '911',
    ambulanceNumber: '911',
    mentalHealthHelpline: {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      available: '24/7 Toll-Free'
    },
    source: 'Federal Communications Commission (FCC) / SAMHSA',
    verifiedAt: '2026-04-01'
  },
  CH: {
    countryCode: 'CH',
    countryName: 'Switzerland',
    emergencyNumber: '112',
    ambulanceNumber: '144',
    mentalHealthHelpline: {
      name: 'Die Dargebotene Hand / La Main Tendue',
      number: '143',
      available: '24/7'
    },
    source: 'Swiss Federal Office of Communications (OFCOM)',
    verifiedAt: '2026-04-01'
  },
  EU: {
    countryCode: 'EU',
    countryName: 'European Union',
    emergencyNumber: '112',
    ambulanceNumber: '112',
    mentalHealthHelpline: {
      name: 'European Mental Health Support',
      number: '116123',
      available: 'Where active'
    },
    source: 'European Commission (Single European Emergency Number 112)',
    verifiedAt: '2026-04-01'
  }
};

export const DEFAULT_EMERGENCY_NUMBER: EmergencyNumberInfo = EMERGENCY_NUMBERS.IN;

export function getEmergencyNumberForLocation(lat: number, lng: number): EmergencyNumberInfo {
  // Approximate bounding box heuristics for verified regions
  if (lat >= 50.0 && lat <= 59.0 && lng >= -8.0 && lng <= 2.0) {
    return EMERGENCY_NUMBERS.GB;
  }
  if (lat >= 45.8 && lat <= 47.8 && lng >= 5.9 && lng <= 10.5) {
    return EMERGENCY_NUMBERS.CH;
  }
  if (lat >= 24.0 && lat <= 49.0 && lng >= -125.0 && lng <= -66.0) {
    return EMERGENCY_NUMBERS.US;
  }
  if (lat >= 6.0 && lat <= 36.0 && lng >= 68.0 && lng <= 98.0) {
    return EMERGENCY_NUMBERS.IN;
  }
  return DEFAULT_EMERGENCY_NUMBER;
}
