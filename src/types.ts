/**
 * PulseCare+ Domain Types
 * Strict provenance, clinical accuracy, and zero fake biometrics.
 */

export interface Hospital {
  id: string;
  name: string;
  category: 'Trauma Center Level 1' | 'Cardiac Emergency' | 'Pediatric ER' | 'General Hospital';
  address: string;
  phone: string; // E.164 formatted string (+[country][number])
  latLong: { lat: number; lng: number };
  specialties: string[];
  source: string; // Verified provenance (e.g. "AIIMS Official Directory / Ministry of Health")
  verifiedAt: string; // ISO 8601 date of verification
  phoneVerifiedAt?: string;
  licensedBedsReference?: number; // Static licensed capacity reference, NEVER live availability
  isCommunityUnverified?: boolean; // Set to true if loaded from community crowd-sources like OpenStreetMap
  distance?: string; // Straight-line distance computed at runtime
  driveTime?: string; // Estimated urban speed (30 km/h) straight-line
  distanceKm?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  category: 'Lab Report' | 'Vaccination' | 'Physician Note' | 'Prescription';
  summary: string;
  doctor: string;
  encryptedPayload?: string;
}

export interface FirstAidStep {
  number: number;
  title: string;
  description: string;
  caution?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  iconName: string;
  estimatedTime: string;
  hasMetronome?: boolean;
  bpm?: number;
  steps: FirstAidStep[];
  sources: { name: string; url?: string; version?: string }[];
  reviewedBy?: string;
  reviewedOn?: string;
  locale?: string;
  appliesTo?: 'adult' | 'child' | 'infant';
}

export interface AEDLocation {
  id: string;
  name: string;
  locationDetails: string;
  distance?: string;
  accessStatus: string;
  latLong: { lat: number; lng: number };
  source: string;
  verifiedAt: string;
  isCommunityUnverified?: boolean;
}

export interface EmergencyNumberInfo {
  countryCode: string;
  countryName: string;
  emergencyNumber: string; // E.g. "112"
  ambulanceNumber?: string; // E.g. "108"
  mentalHealthHelpline?: { name: string; number: string; available: string };
  source: string;
  verifiedAt: string;
}

export interface LockScreenMedicalCard {
  isEnabled: boolean;
  name: string;
  bloodType: string;
  criticalAllergies: string[];
  primaryContactName: string;
  primaryContactPhone: string;
  emergencyNotes: string;
}

export interface UserProfile {
  accountId: string;
  name: string;
  age?: number;
  dob?: string;
  bloodType: string;
  organDonor?: boolean;
  criticalAllergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyNotes: string;
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  lastUpdated: string;
  isEncrypted?: boolean;
  lockScreenCard?: LockScreenMedicalCard;
}
