import { Hospital, EmergencyContact, MedicalRecord, FirstAidGuide, AEDLocation } from '../types';

export const SIMULATED_USER = {
  name: 'Aditya Sharma',
  age: 22,
  dob: '2004-05-14',
  bloodType: 'O+ Positive',
  organDonor: true,
  criticalAllergies: ['Penicillin (Anaphylaxis Risk)', 'Peanuts (Severe)', 'NSAIDs / Ibuprofen'],
  chronicConditions: ['Mild Exercise-Induced Asthma'],
  currentMedications: ['Albuterol Inhaler (90mcg as needed)', 'Cetirizine 10mg (PRN)'],
  emergencyNotes: 'Carries rescue inhaler in bag. Severe penicillin allergy, use cephalosporins with caution.',
  insurance: {
    provider: 'National Health Assurance Prime',
    policyNumber: 'NHA-9844-DL',
    groupNumber: 'GRP-3390'
  }
};

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'AIIMS Apex Trauma Center',
    category: 'Trauma Center Level 1',
    distance: '1.8 km',
    driveTime: '5 mins',
    erWaitTime: '8 mins (Demo)',
    icuBedsAvailable: 7,
    totalBeds: 520,
    address: 'Ring Road, Ansari Nagar East, New Delhi 110029',
    phone: '+91 11 2658 8500',
    coordinates: { x: 14, z: -12 },
    latLong: { lat: 28.5672, lng: 77.2100 },
    status: 'Open 24/7',
    specialties: ['Level 1 Polytrauma', 'Emergency Neurosurgery', 'Cardiothoracic Critical Care', 'Burn Unit']
  },
  {
    id: 'hosp-2',
    name: 'Safdarjung Hospital Emergency Care',
    category: 'General Hospital',
    distance: '2.3 km',
    driveTime: '6 mins',
    erWaitTime: '14 mins (Demo)',
    icuBedsAvailable: 5,
    totalBeds: 1600,
    address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
    phone: '+91 11 2616 5060',
    coordinates: { x: -8, z: 15 },
    latLong: { lat: 28.5701, lng: 77.2066 },
    status: 'Open 24/7',
    specialties: ['Dedicated Burn Trauma', 'Multi-Specialty Emergency', 'Toxicology & Poison Center']
  },
  {
    id: 'hosp-3',
    name: 'Max Super Speciality Hospital Saket',
    category: 'Cardiac Emergency',
    distance: '4.1 km',
    driveTime: '11 mins',
    erWaitTime: '6 mins (Demo)',
    icuBedsAvailable: 4,
    totalBeds: 530,
    address: '1, 2 Press Enclave Marg, Saket, New Delhi 110017',
    phone: '+91 11 2651 5050',
    coordinates: { x: -16, z: -28 },
    latLong: { lat: 28.5276, lng: 77.2127 },
    status: 'Open 24/7',
    specialties: ['24/7 Primary Angioplasty (STEMI)', 'Stroke Thrombolysis', 'Critical Care ECMO']
  },
  {
    id: 'hosp-4',
    name: 'Indraprastha Apollo Hospital',
    category: 'General Hospital',
    distance: '6.5 km',
    driveTime: '15 mins',
    erWaitTime: '10 mins (Demo)',
    icuBedsAvailable: 9,
    totalBeds: 710,
    address: 'Delhi-Mathura Road, Sarita Vihar, New Delhi 110076',
    phone: '+91 11 2692 5858',
    coordinates: { x: 28, z: 24 },
    latLong: { lat: 28.5363, lng: 77.2882 },
    status: 'Open 24/7',
    specialties: ['Comprehensive Stroke Center', 'Emergency Liver & Renal Care', 'Pediatric Intensive Care']
  },
  {
    id: 'hosp-5',
    name: 'Fortis Escorts Heart Institute',
    category: 'Cardiac Emergency',
    distance: '5.2 km',
    driveTime: '12 mins',
    erWaitTime: '5 mins (Demo)',
    icuBedsAvailable: 3,
    totalBeds: 310,
    address: 'Okhla Road, Sukhdev Vihar Metro Station, New Delhi 110025',
    phone: '+91 11 4713 5000',
    coordinates: { x: 22, z: 10 },
    latLong: { lat: 28.5603, lng: 77.2801 },
    status: 'Open 24/7',
    specialties: ['Rapid STEMI Response', 'Electrophysiology', 'Emergency Pacemaker Insertion']
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-1',
    name: 'Dr. Priya Sharma',
    relationship: 'Mother / Primary Contact',
    phone: '+91 98765 43210',
    isPrimary: true,
    notifiedStatus: 'idle'
  },
  {
    id: 'ec-2',
    name: 'Rajesh Sharma',
    relationship: 'Father',
    phone: '+91 98111 22334',
    isPrimary: false,
    notifiedStatus: 'idle'
  },
  {
    id: 'ec-3',
    name: 'Dr. Andrew Vance, MD',
    relationship: 'Primary Care Physician',
    phone: '+91 11 2658 8000',
    isPrimary: false,
    notifiedStatus: 'idle'
  }
];

export const MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    title: 'Complete Blood Count & Metabolic Profile',
    date: '2026-08-12',
    category: 'Lab Report',
    isEncrypted: true,
    summary: 'Hemoglobin 14.8 g/dL, Platelets 260k, Fasting Glucose 92 mg/dL. All metabolic markers normal.',
    doctor: 'Dr. Sarah Lin, Quest Diagnostics'
  },
  {
    id: 'rec-2',
    title: 'Pulmonary Function & Spirometry Test',
    date: '2026-04-18',
    category: 'Physician Note',
    isEncrypted: true,
    summary: 'FEV1/FVC ratio 82%. Reversible mild airway obstruction confirmed. Prescribed rescue Albuterol.',
    doctor: 'Dr. Andrew Vance, Pulmonology'
  },
  {
    id: 'rec-3',
    title: 'Annual Tetanus/Diphtheria (Tdap) Booster',
    date: '2025-11-05',
    category: 'Vaccination',
    isEncrypted: false,
    summary: 'Administered single 0.5mL intramuscular booster. No adverse reactions observed.',
    doctor: 'City Health Immunization Clinic'
  }
];

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  {
    id: 'fa-cpr',
    title: 'Adult Cardiopulmonary Resuscitation (CPR)',
    urgency: 'CRITICAL',
    iconName: 'HeartPulse',
    estimatedTime: 'Continuous until EMS arrives',
    hasMetronome: true,
    bpm: 110,
    steps: [
      {
        number: 1,
        title: 'Check Responsiveness & Call 112',
        description: 'Tap victim’s shoulders firmly and ask loudly "Are you okay?". If no response and not breathing normally, immediately call 112 and send someone for an AED.'
      },
      {
        number: 2,
        title: 'Position Hands in Center of Chest',
        description: 'Place the heel of one hand on the center of the breastbone. Interlock your other hand on top. Keep elbows straight and shoulders directly over hands.',
        caution: 'Do not bend elbows while compressing; use upper body weight.'
      },
      {
        number: 3,
        title: 'Compress at 100–120 Beats Per Minute',
        description: 'Push hard and fast at least 2 inches (5 cm) deep. Allow full chest recoil after each compression. Use the built-in 110 BPM metronome below to match the exact tempo.'
      },
      {
        number: 4,
        title: 'Apply AED as Soon as Available',
        description: 'Power on the AED and follow automated spoken prompts. Do not touch patient during rhythm analysis or shock delivery.'
      }
    ]
  },
  {
    id: 'fa-choking',
    title: 'Severe Airway Obstruction (Heimlich Maneuver)',
    urgency: 'CRITICAL',
    iconName: 'Wind',
    estimatedTime: '1–2 minutes',
    steps: [
      {
        number: 1,
        title: 'Assess Severity',
        description: 'Ask "Are you choking?". If the person can speak, cough forcefully, or breathe, encourage coughing. If unable to make sound or giving universal sign (hands at throat), act immediately.'
      },
      {
        number: 2,
        title: 'Position Behind Victim',
        description: 'Stand behind the person with one foot slightly ahead for balance. Wrap arms around their waist.'
      },
      {
        number: 3,
        title: 'Deliver Abdominal Thrusts',
        description: 'Make a fist with one hand, thumb facing inward, just above the navel and below ribs. Grasp fist with your other hand. Pull sharply inward and upward in rapid j-motions.',
        caution: 'If victim loses consciousness, gently lower to floor and immediately begin CPR.'
      }
    ]
  },
  {
    id: 'fa-bleeding',
    title: 'Severe Arterial & Traumatic Bleeding',
    urgency: 'CRITICAL',
    iconName: 'Droplet',
    estimatedTime: 'Continuous direct pressure',
    steps: [
      {
        number: 1,
        title: 'Apply Direct Unyielding Pressure',
        description: 'Cover wound with clean sterile gauze or cloth. Press firmly with both hands directly over the bleeding vessel.'
      },
      {
        number: 2,
        title: 'Maintain Pressure Without Peeking',
        description: 'Do not remove blood-soaked dressings. Layer additional gauze directly on top and maintain hard manual pressure.'
      },
      {
        number: 3,
        title: 'Apply Commercial Tourniquet if on Extremity',
        description: 'If arterial spurting on limb cannot be controlled, place tourniquet 2–3 inches above wound (never on a joint). Twist windlass until bleeding stops completely; record application time.',
        caution: 'Never loosen or remove a tourniquet once applied; only qualified trauma surgeons should remove it.'
      }
    ]
  },
  {
    id: 'fa-anaphylaxis',
    title: 'Severe Allergic Reaction (Anaphylaxis)',
    urgency: 'CRITICAL',
    iconName: 'AlertTriangle',
    estimatedTime: 'Immediate (under 1 min)',
    steps: [
      {
        number: 1,
        title: 'Recognize Signs',
        description: 'Swelling of lips/tongue, wheezing, hives, dizziness, or sudden difficulty swallowing.'
      },
      {
        number: 2,
        title: 'Inject Epinephrine Auto-Injector (EpiPen)',
        description: 'Firmly press auto-injector into middle-outer thigh at 90-degree angle until it clicks. Hold firmly in place for 3 full seconds, then remove and massage area for 10 seconds.'
      },
      {
        number: 3,
        title: 'Position Patient & Call 112',
        description: 'Keep patient lying flat with legs elevated unless they are vomiting or having severe breathing difficulty (sit upright if breathing is difficult).'
      }
    ]
  },
  {
    id: 'fa-burn',
    title: 'Severe Thermal & Chemical Burns',
    urgency: 'HIGH',
    iconName: 'Flame',
    estimatedTime: 'Cool for 20 minutes',
    steps: [
      {
        number: 1,
        title: 'Cool with Clean Running Water',
        description: 'Immediately hold burned area under cool running water for at least 20 minutes. Do NOT use ice, butter, or ointments which trap heat.',
        caution: 'Never apply ice directly to burns; it can cause tissue frostbite damage.'
      },
      {
        number: 2,
        title: 'Remove Restrictive Items Immediately',
        description: 'Gently remove rings, bracelets, watches, and non-adherent clothing before swelling begins.'
      },
      {
        number: 3,
        title: 'Cover Loosely with Sterile Dressing',
        description: 'Cover area with clean non-stick sterile gauze or clean plastic wrap. Seek emergency medical care for burns larger than patient’s palm or on face/joints.'
      }
    ]
  },
  {
    id: 'fa-seizure',
    title: 'Acute Seizure & Convulsion Safety',
    urgency: 'CRITICAL',
    iconName: 'Activity',
    estimatedTime: 'Protect until seizure ends',
    steps: [
      {
        number: 1,
        title: 'Protect from Injury (Do NOT Restrain)',
        description: 'Gently guide person to the floor. Clear sharp objects, furniture, and hard surfaces. Cushion their head with a soft jacket or folded towel.',
        caution: 'NEVER put anything in their mouth or try to hold down their tongue.'
      },
      {
        number: 2,
        title: 'Turn Person onto Their Side (Recovery Position)',
        description: 'As soon as jerking movements subside, turn person onto their side to keep airway clear and prevent aspiration of saliva or vomit.'
      },
      {
        number: 3,
        title: 'Time the Seizure & Call 112 if > 5 Mins',
        description: 'Note start time. Call 112 immediately if seizure lasts longer than 5 minutes, if multiple seizures occur, if person is pregnant, or if breathing does not normalize.'
      }
    ]
  },
  {
    id: 'fa-fracture',
    title: 'Suspected Bone Fracture & Immobilization',
    urgency: 'HIGH',
    iconName: 'ShieldAlert',
    estimatedTime: 'Immediate stabilization',
    steps: [
      {
        number: 1,
        title: 'Immobilize in Position Found',
        description: 'Do NOT attempt to realign deformed bones or push protruding bone fragments back. Support the injured limb in the exact position found.',
        caution: 'If bone pierces skin (open fracture), cover with sterile moist dressing; do not press.'
      },
      {
        number: 2,
        title: 'Apply Rigid Splint & Cold Pack',
        description: 'Fasten a rigid board, rolled magazine, or sling above and below the injured joint using soft cloth ties. Apply cold pack wrapped in cloth to reduce swelling.'
      },
      {
        number: 3,
        title: 'Check Circulation Beyond Injury',
        description: 'Ensure fingers/toes beyond the splint remain warm and have normal color. If numb or pale, loosen ties immediately.'
      }
    ]
  },
  {
    id: 'fa-snakebite',
    title: 'Venomous Snake & Animal Bite Protocol',
    urgency: 'CRITICAL',
    iconName: 'AlertTriangle',
    estimatedTime: 'Urgent transport to ER',
    steps: [
      {
        number: 1,
        title: 'Keep Patient Calm & Completely Still',
        description: 'Limit all physical movement. Keep bitten limb immobilized at or below heart level to slow venom circulation. Note snake appearance if safe to do so.',
        caution: 'Do NOT cut wound, suck venom, or apply tight arterial tourniquet or ice.'
      },
      {
        number: 2,
        title: 'Apply Broad Pressure Bandage (If Elapid/Neurotoxic)',
        description: 'Apply firm bandage starting from fingers/toes upward to armpit/groin (firm like a sprained ankle, but with pulse still detectable).'
      },
      {
        number: 3,
        title: 'Immediate Transport to Trauma Hospital with Antivenom',
        description: 'Call 112 or transport immediately to the nearest tertiary hospital stocked with polyvalent snake antivenom.'
      }
    ]
  }
];

export const AED_LOCATIONS: AEDLocation[] = [
  {
    id: 'aed-1',
    name: 'AIIMS Metro Station - Concourse Gate 2',
    locationDetails: 'Platform Level, next to Station Control Room',
    distance: '350 meters',
    accessStatus: '24/7 Public Access',
    coordinates: { x: 5, z: 2 }
  },
  {
    id: 'aed-2',
    name: 'Select Citywalk Mall Saket - North Atrium',
    locationDetails: 'Ground Floor Customer Information Desk',
    distance: '750 meters',
    accessStatus: 'Mall Hours',
    coordinates: { x: -8, z: -10 }
  },
  {
    id: 'aed-3',
    name: 'Thyagaraj Sports Complex - Main Entrance',
    locationDetails: 'Gate 3 Reception & First Aid Post',
    distance: '1.2 km',
    accessStatus: '24/7 Public Access',
    coordinates: { x: 18, z: -6 }
  }
];
