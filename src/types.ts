export interface Hospital {
  id: string;
  name: string;
  category: 'Trauma Center Level 1' | 'Cardiac Emergency' | 'Pediatric ER' | 'General Hospital';
  distance: string;
  driveTime: string;
  erWaitTime: string;
  icuBedsAvailable: number;
  totalBeds: number;
  address: string;
  phone: string;
  coordinates: { x: number; z: number }; // 3D coordinates on map
  latLong: { lat: number; lng: number };
  status: 'Open 24/7' | 'Busy' | 'Diverting';
  specialties: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  notifiedStatus?: 'idle' | 'sending' | 'delivered';
}

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  category: 'Lab Report' | 'Vaccination' | 'Physician Note' | 'Prescription';
  isEncrypted: boolean;
  summary: string;
  doctor: string;
  encryptedPayload?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  iconName: string;
  estimatedTime: string;
  hasMetronome?: boolean;
  bpm?: number;
  steps: {
    number: number;
    title: string;
    description: string;
    caution?: string;
  }[];
}

export interface AEDLocation {
  id: string;
  name: string;
  locationDetails: string;
  distance: string;
  accessStatus: '24/7 Public Access' | 'Mall Hours' | 'Subway Station';
  coordinates: { x: number; z: number };
}
