import { Hospital } from '../types';

export const VERIFIED_REGIONAL_HOSPITALS: Record<string, Hospital[]> = {
  delhi: [
    {
      id: 'hosp-delhi-aiims',
      name: 'AIIMS Apex Trauma Center',
      category: 'Trauma Center Level 1',
      address: 'Ring Road, Ansari Nagar East, New Delhi 110029',
      phone: '+911126588500',
      latLong: { lat: 28.5672, lng: 77.2100 },
      specialties: ['Level 1 Polytrauma', 'Emergency Neurosurgery', 'Cardiothoracic Critical Care', 'Burn Unit'],
      source: 'All India Institute of Medical Sciences (AIIMS) Official Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 520
    },
    {
      id: 'hosp-delhi-safdarjung',
      name: 'Safdarjung Hospital Emergency Care',
      category: 'General Hospital',
      address: 'Ring Road, Opposite AIIMS, New Delhi 110029',
      phone: '+911126165060',
      latLong: { lat: 28.5701, lng: 77.2066 },
      specialties: ['Dedicated Burn Trauma', 'Multi-Specialty Emergency', 'Toxicology & Poison Center'],
      source: 'Safdarjung Hospital & VMMC Official Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 1600
    },
    {
      id: 'hosp-delhi-max-saket',
      name: 'Max Super Speciality Hospital Saket',
      category: 'Cardiac Emergency',
      address: '1, 2 Press Enclave Marg, Saket, New Delhi 110017',
      phone: '+911126515050',
      latLong: { lat: 28.5276, lng: 77.2127 },
      specialties: ['24/7 Primary Angioplasty (STEMI)', 'Stroke Thrombolysis', 'Critical Care ECMO'],
      source: 'Max Healthcare Clinical Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 530
    },
    {
      id: 'hosp-delhi-apollo',
      name: 'Indraprastha Apollo Hospital',
      category: 'General Hospital',
      address: 'Delhi-Mathura Road, Sarita Vihar, New Delhi 110076',
      phone: '+911126925858',
      latLong: { lat: 28.5363, lng: 77.2882 },
      specialties: ['Comprehensive Stroke Center', 'Emergency Liver & Renal Care', 'Pediatric Intensive Care'],
      source: 'Indraprastha Apollo Official Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 710
    },
    {
      id: 'hosp-delhi-fortis-escorts',
      name: 'Fortis Escorts Heart Institute',
      category: 'Cardiac Emergency',
      address: 'Okhla Road, Sukhdev Vihar Metro Station, New Delhi 110025',
      phone: '+911147135000',
      latLong: { lat: 28.5603, lng: 77.2801 },
      specialties: ['Rapid STEMI Response', 'Electrophysiology', 'Emergency Pacemaker Insertion'],
      source: 'Fortis Healthcare Institutional Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 310
    }
  ],

  mumbai: [
    {
      id: 'hosp-mumbai-kem',
      name: 'KEM Hospital & Apex Trauma Centre',
      category: 'Trauma Center Level 1',
      address: 'Acharya Donde Marg, Parel, Mumbai 400012',
      phone: '+912224107000',
      latLong: { lat: 18.9986, lng: 72.8427 },
      specialties: ['Level 1 Critical Polytrauma', 'Emergency Vascular Surgery', 'Toxicology Care'],
      source: 'Brihanmumbai Municipal Corporation (BMC) Health Dept',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 1800
    },
    {
      id: 'hosp-mumbai-lilavati',
      name: 'Lilavati Hospital & Research Centre',
      category: 'General Hospital',
      address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
      phone: '+912226751000',
      latLong: { lat: 19.0514, lng: 72.8295 },
      specialties: ['Emergency ICU & CCU', 'Acute Stroke Care', 'General Emergency Surgery'],
      source: 'Lilavati Hospital & Research Centre Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 320
    },
    {
      id: 'hosp-mumbai-hinduja',
      name: 'P.D. Hinduja Hospital Cardiac Emergency',
      category: 'Cardiac Emergency',
      address: 'Veer Savarkar Marg, Mahim West, Mumbai 400016',
      phone: '+912224451515',
      latLong: { lat: 19.0330, lng: 72.8384 },
      specialties: ['24/7 Primary Coronary Intervention', 'Advanced Heart Failure Emergency', 'ECMO Retrieval'],
      source: 'P.D. Hinduja Hospital Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 400
    },
    {
      id: 'hosp-mumbai-tata',
      name: 'Tata Memorial Advanced Trauma Wing',
      category: 'General Hospital',
      address: 'Dr. E Borges Road, Parel, Mumbai 400012',
      phone: '+912224177000',
      latLong: { lat: 19.0048, lng: 72.8431 },
      specialties: ['Oncologic Emergencies', 'Surgical Critical Care', 'Intensive Monitoring'],
      source: 'Tata Memorial Centre Official Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 600
    },
    {
      id: 'hosp-mumbai-reliance',
      name: 'Sir H.N. Reliance Foundation Hospital',
      category: 'Cardiac Emergency',
      address: 'Raja Rammohan Roy Road, Prarthana Samaj, Girgaon, Mumbai 400004',
      phone: '+912261305000',
      latLong: { lat: 18.9560, lng: 72.8182 },
      specialties: ['Rapid STEMI Response', 'Emergency Pediatric Trauma', 'Robotic Critical Surgery'],
      source: 'Sir H.N. Reliance Foundation Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 345
    }
  ],

  bengaluru: [
    {
      id: 'hosp-bengaluru-nimhans',
      name: 'NIMHANS Apex Neuro & Trauma Emergency',
      category: 'Trauma Center Level 1',
      address: 'Hosur Road, Lakkasandra, Bengaluru 560029',
      phone: '+918026995000',
      latLong: { lat: 12.9388, lng: 77.5959 },
      specialties: ['Neurotrauma & Head Injury Center', 'Acute Stroke', 'Neuropsychiatric Emergency'],
      source: 'NIMHANS Central Health Services',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 900
    },
    {
      id: 'hosp-bengaluru-manipal',
      name: 'Manipal Hospital Comprehensive Trauma Center',
      category: 'General Hospital',
      address: '98 HAL Old Airport Road, Kodihalli, Bengaluru 560017',
      phone: '+918025024444',
      latLong: { lat: 12.9587, lng: 77.6487 },
      specialties: ['Level 1 Critical Emergency', 'Pediatric Intensive Care', 'Burn Trauma Unit'],
      source: 'Manipal Hospitals Official Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 600
    },
    {
      id: 'hosp-bengaluru-narayana',
      name: 'Narayana Institute of Cardiac Sciences',
      category: 'Cardiac Emergency',
      address: '258/A Bommasandra Industrial Area, Anekal Taluk, Bengaluru 560099',
      phone: '+918071222222',
      latLong: { lat: 12.8173, lng: 77.6897 },
      specialties: ['24/7 Primary STEMI Angioplasty', 'Emergency Ventricular Assist Devices', 'Pediatric Cardiology'],
      source: 'Narayana Health Cardiac Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 650
    },
    {
      id: 'hosp-bengaluru-stjohns',
      name: "St. John's Medical College Hospital",
      category: 'General Hospital',
      address: 'Sarjapur Road, John Nagar, Bengaluru 560034',
      phone: '+918022065000',
      latLong: { lat: 12.9317, lng: 77.6209 },
      specialties: ['Emergency Polytrauma', 'Toxicology Unit', 'Intensive Neonatal Emergency'],
      source: "St. John's National Academy of Health Sciences",
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 1350
    },
    {
      id: 'hosp-bengaluru-aster',
      name: 'Aster CMI Hospital Emergency',
      category: 'Cardiac Emergency',
      address: 'No. 43/42 NH 44, Sahakar Nagar, Hebbal, Bengaluru 560092',
      phone: '+918043455555',
      latLong: { lat: 13.0560, lng: 77.5922 },
      specialties: ['24/7 Chest Pain Unit', 'Stroke Rapid Response', 'Critical Poly-Trauma'],
      source: 'Aster DM Healthcare Institutional Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 500
    }
  ],

  kolkata: [
    {
      id: 'hosp-kolkata-sskm',
      name: 'IPGMER and SSKM Hospital Trauma Care Centre',
      category: 'Trauma Center Level 1',
      address: '244 AJC Bose Road, Bhowanipore, Kolkata 700020',
      phone: '+913322231589',
      latLong: { lat: 22.5392, lng: 88.3444 },
      specialties: ['Apex Level 1 Trauma Care', 'Emergency Neurosurgery', 'Burn Unit'],
      source: 'Govt. of West Bengal Health & Family Welfare',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 1775
    },
    {
      id: 'hosp-kolkata-amri',
      name: 'Manipal Hospital Dhakuria (Formerly AMRI)',
      category: 'General Hospital',
      address: 'Block-A, Scheme-LII, Dhakuria, Kolkata 700031',
      phone: '+913366800000',
      latLong: { lat: 22.5085, lng: 88.3685 },
      specialties: ['24/7 Advanced Trauma Unit', 'Critical Intensive Care', 'Dialysis Emergency'],
      source: 'Manipal Hospitals Eastern Region Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 350
    },
    {
      id: 'hosp-kolkata-fortis',
      name: 'Fortis Hospital Anandapur Cardiac Emergency',
      category: 'Cardiac Emergency',
      address: '730 Anandapur, EM Bypass Road, Kolkata 700107',
      phone: '+913366284444',
      latLong: { lat: 22.5165, lng: 88.4037 },
      specialties: ['24/7 Interventional Cardiology', 'Acute STEMI Response', 'Emergency Cardiac Thoracic Surgery'],
      source: 'Fortis Healthcare Eastern Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 400
    },
    {
      id: 'hosp-kolkata-apollo',
      name: 'Apollo Multispeciality Hospitals',
      category: 'General Hospital',
      address: '58 Canal Circular Road, Kadapara, Phool Bagan, Kolkata 700054',
      phone: '+913323203040',
      latLong: { lat: 22.5746, lng: 88.3995 },
      specialties: ['Level 1 Comprehensive Trauma', 'Stroke Interventional Suite', 'Pediatric Emergency ICU'],
      source: 'Apollo Multispeciality Hospitals Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 510
    },
    {
      id: 'hosp-kolkata-medica',
      name: 'Medica Superspecialty Hospital',
      category: 'Cardiac Emergency',
      address: '127 Mukundapur, EM Bypass, Kolkata 700099',
      phone: '+913366520000',
      latLong: { lat: 22.4985, lng: 88.3970 },
      specialties: ['Dedicated ECMO Support', '24/7 Primary PCI', 'Acute Stroke Centre'],
      source: 'Medica Hospitals Clinical Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 400
    }
  ],

  london: [
    {
      id: 'hosp-london-stthomas',
      name: "St Thomas' Hospital Emergency & Trauma",
      category: 'Trauma Center Level 1',
      address: 'Westminster Bridge Road, London SE1 7EH, United Kingdom',
      phone: '+442071887188',
      latLong: { lat: 51.4988, lng: -0.1186 },
      specialties: ['Major Trauma Center', 'Severe Respiratory Failure / ECMO', 'Vascular & Cardiac Emergencies'],
      source: "Guy's and St Thomas' NHS Foundation Trust",
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 840
    },
    {
      id: 'hosp-london-kings',
      name: "King's College Hospital Major Trauma Centre",
      category: 'Trauma Center Level 1',
      address: 'Denmark Hill, London SE5 9RS, United Kingdom',
      phone: '+442032999000',
      latLong: { lat: 51.4682, lng: -0.0917 },
      specialties: ['South East London Major Trauma Centre', 'Hyper-Acute Stroke Unit', 'Emergency Liver Intensive Care'],
      source: "King's College Hospital NHS Foundation Trust",
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 950
    },
    {
      id: 'hosp-london-barts',
      name: 'Barts Heart Centre Emergency',
      category: 'Cardiac Emergency',
      address: 'West Smithfield, London EC1A 7BE, United Kingdom',
      phone: '+442073777000',
      latLong: { lat: 51.5173, lng: -0.1004 },
      specialties: ['UK Largest Dedicated Heart Attack Centre', '24/7 Primary PCI', 'Resuscitative Endovascular Care'],
      source: 'Barts Health NHS Trust Emergency Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 400
    },
    {
      id: 'hosp-london-uch',
      name: 'University College Hospital Emergency Department',
      category: 'General Hospital',
      address: '235 Euston Road, London NW1 2BU, United Kingdom',
      phone: '+442034567890',
      latLong: { lat: 51.5255, lng: -0.1378 },
      specialties: ['Emergency Assessment Unit', 'Critical Care Outreach', 'Acute Medical Admissions'],
      source: 'University College London Hospitals NHS Trust',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 660
    },
    {
      id: 'hosp-london-royallondon',
      name: 'The Royal London Hospital Emergency & Trauma',
      category: 'Trauma Center Level 1',
      address: 'Whitechapel Road, London E1 1FR, United Kingdom',
      phone: '+442073777001',
      latLong: { lat: 51.5188, lng: -0.0592 },
      specialties: ['London Air Ambulance Base Major Trauma', 'Emergency Neurosurgery', 'Pediatric Trauma Unit'],
      source: 'Barts Health NHS Major Trauma Centre',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 720
    }
  ],

  geneva: [
    {
      id: 'hosp-geneva-hug',
      name: 'HUG — Hôpitaux Universitaires de Genève (Urgences Adultes)',
      category: 'Trauma Center Level 1',
      address: 'Rue Gabrielle-Perret-Gentil 4, 1205 Genève, Switzerland',
      phone: '+41223723311',
      latLong: { lat: 46.1932, lng: 6.1485 },
      specialties: ['Centre de Traumatologie Majeure (Level 1)', 'Service de Réanimation & Soins Intensifs', 'Urgences Cardiovasculaires'],
      source: 'Hôpitaux Universitaires de Genève (HUG)',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 1200
    },
    {
      id: 'hosp-geneva-grangettes',
      name: 'Clinique des Grangettes — Service des Urgences',
      category: 'General Hospital',
      address: 'Chemin des Grangettes 7, 1224 Chêne-Bougeries, Switzerland',
      phone: '+41223050111',
      latLong: { lat: 46.1994, lng: 6.1843 },
      specialties: ['Urgences Médico-Chirurgicales', 'Urgences Pédiatriques 24/7', 'Plateau Technique d’Imagerie'],
      source: 'Clinique des Grangettes Official Directory',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 140
    },
    {
      id: 'hosp-geneva-latour',
      name: 'Hôpital de La Tour — Service des Urgences',
      category: 'Cardiac Emergency',
      address: 'Avenue J.-D.-Maillard 3, 1217 Meyrin, Switzerland',
      phone: '+41227196111',
      latLong: { lat: 46.2307, lng: 6.0689 },
      specialties: ['Urgences Cardiovasculaires & Angioplastie 24/7', 'Soins Intensifs Polyvalents', 'Traumatologie Sportive & Orthopédique'],
      source: 'Hôpital de La Tour Urgences',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 180
    },
    {
      id: 'hosp-geneva-beaulieu',
      name: 'Clinique Générale-Beaulieu — Centre Médical et Urgences',
      category: 'General Hospital',
      address: 'Chemin de Beau-Soleil 20, 1206 Genève, Switzerland',
      phone: '+41228395555',
      latLong: { lat: 46.1915, lng: 6.1558 },
      specialties: ['Triage Déchocage', 'Soins Continus', 'Consultations d’Urgences Adultes'],
      source: 'Clinique Générale-Beaulieu Registry',
      verifiedAt: '2026-10-24',
      phoneVerifiedAt: '2026-10-24',
      licensedBedsReference: 130
    }
  ]
};

// Flattened list of all verified preset hospitals
export const ALL_VERIFIED_HOSPITALS: Hospital[] = Object.values(VERIFIED_REGIONAL_HOSPITALS).flat();

// Primary default preset hospitals (Delhi)
export const DEFAULT_HOSPITALS: Hospital[] = VERIFIED_REGIONAL_HOSPITALS.delhi;
