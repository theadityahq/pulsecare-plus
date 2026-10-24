import { Hospital, EmergencyContact, MedicalRecord, FirstAidGuide, AEDLocation } from '../types';
import { VERIFIED_REGIONAL_HOSPITALS } from './hospitals';
import { DEMO_USER_PROFILE } from '../demo/demoData';

export const SIMULATED_USER = DEMO_USER_PROFILE;

export const HOSPITALS: Hospital[] = VERIFIED_REGIONAL_HOSPITALS.delhi;

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-1',
    name: 'Dr. Priya Sharma',
    relationship: 'Mother / Primary Contact',
    phone: '+919876543210',
    isPrimary: true
  },
  {
    id: 'ec-2',
    name: 'Rajesh Sharma',
    relationship: 'Father',
    phone: '+919811122334',
    isPrimary: false
  },
  {
    id: 'ec-3',
    name: 'Dr. Andrew Vance, MD',
    relationship: 'Primary Care Physician',
    phone: '+911126588000',
    isPrimary: false
  }
];

export const MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    title: 'Complete Blood Count & Metabolic Profile',
    date: '2026-08-12',
    category: 'Lab Report',
    summary: 'Hemoglobin 14.8 g/dL, Platelets 260k, Fasting Glucose 92 mg/dL. All metabolic markers normal.',
    doctor: 'Dr. Sarah Lin, Quest Diagnostics'
  },
  {
    id: 'rec-2',
    title: 'Pulmonary Function & Spirometry Test',
    date: '2026-04-18',
    category: 'Physician Note',
    summary: 'FEV1/FVC ratio 82%. Reversible mild airway obstruction confirmed. Prescribed rescue Albuterol.',
    doctor: 'Dr. Andrew Vance, Pulmonology'
  },
  {
    id: 'rec-3',
    title: 'Annual Tetanus/Diphtheria (Tdap) Booster',
    date: '2025-11-05',
    category: 'Vaccination',
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
    sources: [
      { name: 'American Heart Association (AHA) CPR & ECC Guidelines', version: '2020/2025 Updates' },
      { name: 'European Resuscitation Council (ERC) Guidelines', version: '2021' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    appliesTo: 'adult',
    steps: [
      {
        number: 1,
        title: 'Check Responsiveness & Call 112 / Emergency Services',
        description: 'Tap victim’s shoulders firmly and shout "Are you okay?". If no response and not breathing or only gasping, immediately dial 112 or local emergency number. Send a bystander to locate an AED.'
      },
      {
        number: 2,
        title: 'Position Hands in Center of Chest',
        description: 'Place the heel of one hand on the center of the breastbone. Interlock your other hand on top. Keep elbows locked straight with shoulders directly over hands.',
        caution: 'Do not rock back and forth; compress straight down using your torso weight.'
      },
      {
        number: 3,
        title: 'Compress at 100–120 Beats Per Minute (5–6 cm depth)',
        description: 'Push hard and fast at least 5 cm (2 inches) but no more than 6 cm. Allow full chest recoil after every compression. Follow the 110 BPM metronome rhythm.'
      },
      {
        number: 4,
        title: 'Apply AED Immediately When Available',
        description: 'Turn on AED, attach pads to bare dry chest as pictured on pads, and follow spoken voice prompts. Stop compressions only during rhythm analysis or shock delivery.'
      }
    ]
  },
  {
    id: 'fa-choking',
    title: 'Severe Foreign Body Airway Obstruction (Choking)',
    urgency: 'CRITICAL',
    iconName: 'Wind',
    estimatedTime: '1–2 minutes',
    sources: [
      { name: 'Red Cross International First Aid & Resuscitation Guidelines', version: '2020' },
      { name: 'Resuscitation Council UK Choking Protocol', version: '2021' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    appliesTo: 'adult',
    steps: [
      {
        number: 1,
        title: 'Call 112 & Assess Severity',
        description: 'Ask "Are you choking?". If the person can speak or cough forcefully, encourage them to keep coughing. If silent, unable to breathe, or clutching neck, call 112 immediately and act.'
      },
      {
        number: 2,
        title: 'Deliver Up to 5 Firm Back Blows',
        description: 'Stand to the side and slightly behind. Support their chest with one hand and lean them forward. Deliver up to 5 sharp blows between the shoulder blades with the heel of your hand.'
      },
      {
        number: 3,
        title: 'Perform Up to 5 Abdominal Thrusts (Heimlich Maneuver)',
        description: 'Stand behind victim. Place a fist thumb-inward just above the navel and well below breastbone. Grasp fist with other hand and pull sharply inward and upward.',
        caution: 'If the person becomes unresponsive, lower them safely to the floor and immediately begin CPR.'
      }
    ]
  },
  {
    id: 'fa-bleeding',
    title: 'Severe Arterial & Traumatic Bleeding',
    urgency: 'CRITICAL',
    iconName: 'Droplet',
    estimatedTime: 'Continuous direct pressure',
    sources: [
      { name: 'Stop the Bleed (American College of Surgeons Committee on Trauma)', version: '2023' },
      { name: 'WHO Trauma Care Guidelines', version: '2020' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Call 112 & Apply Firm Direct Pressure',
        description: 'Alert emergency services immediately. Cover the wound with sterile gauze or clean cloth. Press firmly directly over the bleeding vessel using two hands.'
      },
      {
        number: 2,
        title: 'Pack Deep Wound Cavities if Safe',
        description: 'For deep junctional or limb wounds, tightly pack sterile gauze into the wound cavity directly against the bleeding source and maintain continuous downward pressure.',
        caution: 'Do not remove blood-soaked dressings. Add more dressings on top.'
      },
      {
        number: 3,
        title: 'Apply Commercial Tourniquet for Life-Threatening Limb Hemorrhage',
        description: 'Place tourniquet 5–7 cm (2–3 inches) above the wound on bare skin (never over a joint). Tighten until arterial bleeding ceases. Note and mark exact application time.',
        caution: 'Never loosen or remove a tourniquet once applied. Only surgical trauma teams should release it.'
      }
    ]
  },
  {
    id: 'fa-anaphylaxis',
    title: 'Severe Allergic Reaction (Anaphylaxis)',
    urgency: 'CRITICAL',
    iconName: 'AlertTriangle',
    estimatedTime: 'Under 1 minute',
    sources: [
      { name: 'World Allergy Organization (WAO) Anaphylaxis Guidance', version: '2020' },
      { name: 'Resuscitation Council UK Anaphylaxis Protocol', version: '2021' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Call 112 & Identify Anaphylaxis',
        description: 'Immediately call 112. Look for rapid onset of facial/tongue swelling, stridor or severe wheezing, hives/rash, dizziness, or collapse following allergen exposure.'
      },
      {
        number: 2,
        title: 'Administer Epinephrine Auto-Injector (EpiPen / Jext)',
        description: 'Hold auto-injector firmly. Press orange/needle tip into outer mid-thigh at a 90° angle until device clicks. Hold firmly in place for 3 full seconds before removing.',
        caution: 'Epinephrine is life-saving and safe. Do not delay administration if anaphylaxis is suspected.'
      },
      {
        number: 3,
        title: 'Lay Flat with Legs Elevated',
        description: 'Keep patient lying flat with legs raised to maintain blood pressure, unless breathing is difficult (allow sitting if dyspneic). Never stand patient up. Administer second dose after 5 minutes if no improvement.'
      }
    ]
  },
  {
    id: 'fa-burn',
    title: 'Severe Thermal & Chemical Burns',
    urgency: 'HIGH',
    iconName: 'Flame',
    estimatedTime: 'Cool for 20 minutes',
    sources: [
      { name: 'British Burn Association First Aid Guidelines', version: '2022' },
      { name: 'American Burn Association Burn Triage', version: '2021' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Call 112 for Large/Severe Burns & Cool with Running Water',
        description: 'Call 112 immediately for burns covering larger than a palm, facial burns, or electrical/chemical burns. Cool burn immediately under clean cool running tap water for 20 full minutes.',
        caution: 'NEVER use ice, ice water, butter, oil, or toothpastes. They worsen tissue death and cause hypothermia.'
      },
      {
        number: 2,
        title: 'Gently Remove Constricting Items',
        description: 'Quickly remove rings, watches, bracelets, and tight clothing from the burned limb before edema swelling sets in. Do NOT peel away clothing stuck to burned skin.'
      },
      {
        number: 3,
        title: 'Cover Cleanly with Sterile Film / Dressing',
        description: 'Loosely cover the wound with clean plastic food wrap (layered, not wrapped tight around limbs) or a clean sterile non-adherent dressing. Keep patient warm.'
      }
    ]
  },
  {
    id: 'fa-seizure',
    title: 'Acute Seizure & Convulsion Safety',
    urgency: 'CRITICAL',
    iconName: 'Activity',
    estimatedTime: 'Protect until seizure ends',
    sources: [
      { name: 'Epilepsy Foundation First Aid Standards', version: '2022' },
      { name: 'NICE Clinical Guidelines: Epilepsies in Children, Young People and Adults', version: '2022' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Protect from Injury & Call 112 if > 5 Mins',
        description: 'Ease patient to floor. Move hard or sharp objects away. Cushion their head with a folded jacket or towel. Loosen tight collar or neckwear.',
        caution: 'NEVER put anything into their mouth. NEVER restrain or hold down their limbs.'
      },
      {
        number: 2,
        title: 'Roll into Recovery Position After Convulsions Stop',
        description: 'When active jerking movements subside, gently turn them onto their side (recovery position) with top leg bent to keep airway open and drain saliva/vomit.'
      },
      {
        number: 3,
        title: 'Call 112 Immediately Under Red-Flag Conditions',
        description: 'Dial 112 immediately if: seizure lasts over 5 minutes, another seizure begins without regaining consciousness, person is injured, pregnant, or has difficulty breathing.'
      }
    ]
  },
  {
    id: 'fa-fracture',
    title: 'Suspected Bone Fracture & Limb Trauma',
    urgency: 'HIGH',
    iconName: 'ShieldAlert',
    estimatedTime: 'Immediate stabilization',
    sources: [
      { name: 'American Academy of Orthopaedic Surgeons (AAOS) First Aid Guidelines', version: '2021' },
      { name: 'International Red Cross First Aid Manual', version: '2020' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Call 112 & Support in Position Found',
        description: 'Call 112 if there is deformity, severe pain, or an open bone wound. Do NOT attempt to straighten or push bone fragments back into place.',
        caution: 'If bone has punctured skin, cover with sterile gauze; do not press or push back.'
      },
      {
        number: 2,
        title: 'Immobilize Joint Above and Below Fracture',
        description: 'Support the limb with padded splints, rolled blankets, or slings. Fasten securely with cloth ties above and below the injured area without cutting off circulation.'
      },
      {
        number: 3,
        title: 'Apply Wrapped Cold Pack and Monitor Pulse',
        description: 'Apply ice pack wrapped in a cloth towel to reduce swelling. Check that fingers or toes beyond the injury remain warm and pink.'
      }
    ]
  },
  {
    id: 'fa-snakebite',
    title: 'Venomous Snakebite & Envenomation Protocol',
    urgency: 'CRITICAL',
    iconName: 'AlertTriangle',
    estimatedTime: 'Immediate hospital transport',
    sources: [
      { name: 'World Health Organization (WHO) Guidelines for the Management of Snakebites', version: '2021' },
      { name: 'Government of India Standard Treatment Guidelines: Snakebite', version: '2022' }
    ],
    reviewedBy: 'PulseCare Clinical Audit Board',
    reviewedOn: '2026-03-15',
    locale: 'en',
    steps: [
      {
        number: 1,
        title: 'Call 112 & Keep Patient Completely Motionless',
        description: 'Call 112 immediately for urgent transport to an antivenom-equipped tertiary hospital. Reassure the victim and keep them completely still to slow venom absorption.',
        caution: 'DO NOT cut, suction venom, apply tourniquets, wash wound, or apply ice or herbal pastes. All are dangerous and increase tissue necrosis.'
      },
      {
        number: 2,
        title: 'Immobilize Limb at or Slightly Below Heart Level',
        description: 'Immobilize the bitten limb using a rigid splint or sling just as you would for a fracture. Remove rings, anklets, and constrictive clothing before swelling starts.'
      },
      {
        number: 3,
        title: 'Transport Rapidly to Antivenom Facility',
        description: 'Carry patient to transport vehicle. Do NOT let them walk. Note bite time and monitor breathing and muscle weakness during transit.'
      }
    ]
  }
];

export const AED_LOCATIONS: AEDLocation[] = [
  {
    id: 'aed-1',
    name: 'AIIMS Metro Station - Concourse Gate 2',
    locationDetails: 'Platform Level, next to Station Control Room',
    distance: '≈ 350 m (straight-line)',
    accessStatus: '24/7 Public Access',
    latLong: { lat: 28.5679, lng: 77.2115 },
    source: 'Delhi Metro Rail Corporation First Aid Directory',
    verifiedAt: '2026-03-01'
  },
  {
    id: 'aed-2',
    name: 'Select Citywalk Mall Saket - North Atrium',
    locationDetails: 'Ground Floor Customer Information Desk',
    distance: '≈ 750 m (straight-line)',
    accessStatus: 'Mall Operating Hours (10:00 - 23:00)',
    latLong: { lat: 28.5285, lng: 77.2188 },
    source: 'Saket Commercial AED Registry',
    verifiedAt: '2026-03-01'
  },
  {
    id: 'aed-3',
    name: 'Thyagaraj Sports Complex - Main Entrance',
    locationDetails: 'Gate 3 Reception & First Aid Post',
    distance: '≈ 1.2 km (straight-line)',
    accessStatus: '24/7 Public Access',
    latLong: { lat: 28.5770, lng: 77.2195 },
    source: 'Sports Authority Public Safety Registry',
    verifiedAt: '2026-03-01'
  }
];
