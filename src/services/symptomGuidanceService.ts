/**
 * PulseCare+ Rule-Based Symptom Guidance Engine
 * Strict, deterministic, evidence-based clinical rules.
 * NOT an AI diagnostic tool. No simulated thinking delays or hallucinated citations.
 */

export interface SymptomGuidanceResult {
  isEmergency: boolean;
  category: 'CRITICAL_EMERGENCY' | 'MENTAL_HEALTH_CRISIS' | 'URGENT_FIRST_AID' | 'GENERAL_SUPPORTIVE' | 'DISCLAIMER';
  title: string;
  guidanceText: string;
  actionHint: string;
  recommendedSteps: string[];
  helplines?: { name: string; number: string; description: string }[];
  clinicalReference: { source: string; guideline: string; reviewedDate: string };
  followUpQuestions?: string[];
}

export function evaluateSymptomInput(input: string): SymptomGuidanceResult {
  const trimmed = input.trim();
  const lower = ` ${trimmed.toLowerCase()} `;

  // Helper for negation check
  const hasNegationBefore = (term: string): boolean => {
    const idx = lower.indexOf(term);
    if (idx === -1) return false;
    const prefix = lower.substring(Math.max(0, idx - 25), idx);
    return /\b(no|not|neither|without|never|haven't|don't|hasn't|didn't)\b/.test(prefix);
  };

  // 1. SELF-HARM & MENTAL HEALTH CRISIS ROUTING (PRIORITY #1)
  if (
    lower.includes('suicide') ||
    lower.includes('kill myself') ||
    lower.includes('end my life') ||
    lower.includes('want to die') ||
    lower.includes('self harm') ||
    lower.includes('take my life') ||
    lower.includes('hang myself') ||
    lower.includes('overdose on pills to die')
  ) {
    return {
      isEmergency: true,
      category: 'MENTAL_HEALTH_CRISIS',
      title: 'Immediate Crisis Support & Suicide Prevention',
      guidanceText: 'You are not alone. Compassionate, confidential support is available right now. Please reach out immediately to a trained crisis counselor or emergency services.',
      actionHint: 'Call Tele-MANAS (14416) or Emergency 112 immediately',
      recommendedSteps: [
        'Call Tele-MANAS helpline at 14416 or toll-free 1800 891 4416 (available 24/7 across India in multiple languages).',
        'In immediate danger of self-harm, call 112 or go to the nearest emergency department.',
        'Stay with a family member, trusted friend, or caregiver who can support you right now.',
        'International crisis lines: US/Canada 988, UK 111 / 999, EU 112.'
      ],
      helplines: [
        { name: 'Tele-MANAS (Govt. of India 24/7)', number: '14416', description: 'National Tele Mental Health Programme' },
        { name: 'KIRAN National Mental Health', number: '1800-599-0019', description: 'MoSJE 24/7 Support' },
        { name: 'National Emergency Services', number: '112', description: 'Police & Medical Emergency' }
      ],
      clinicalReference: {
        source: 'Ministry of Health and Family Welfare (MoHFW) India & Tele-MANAS',
        guideline: 'National Suicide Prevention Strategy',
        reviewedDate: '2026-03-01'
      }
    };
  }

  // 2. UNCONSCIOUSNESS & CARDIAC/RESPIRATORY ARREST (PRIORITY #2)
  if (
    lower.includes('unconscious') ||
    lower.includes('unresponsive') ||
    lower.includes('passed out and not waking') ||
    lower.includes('collapsed and not breathing') ||
    (lower.includes('not breathing') && !hasNegationBefore('not breathing')) ||
    lower.includes('stopped breathing') ||
    lower.includes('no pulse')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Cardiac Arrest / Unresponsiveness Protocol',
      guidanceText: 'CRITICAL LIFE THREAT: Person is unresponsive. Immediate CPR and defibrillation are required to prevent permanent brain damage and death.',
      actionHint: 'Call 112 immediately and begin CPR at 100-120 BPM',
      recommendedSteps: [
        'Call 112 or local emergency dispatch immediately on speakerphone.',
        'Send a bystander immediately to retrieve the nearest Automated External Defibrillator (AED).',
        'Place hands in the center of the chest and deliver hard, fast chest compressions at 100-120 BPM (5-6 cm depth). Allow full chest recoil.',
        'Use the built-in PulseCare+ 110 BPM metronome to maintain continuous rhythm until paramedics arrive.'
      ],
      clinicalReference: {
        source: 'American Heart Association (AHA) & European Resuscitation Council (ERC)',
        guideline: 'Basic Life Support (BLS) Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 3. SEVERE ALLERGIC REACTION / ANAPHYLAXIS
  if (
    (lower.includes('anaphylaxis') ||
      lower.includes('epipen') ||
      (lower.includes('allergic') && !hasNegationBefore('allergic') && (lower.includes('throat') || lower.includes('tongue') || lower.includes('lips') || lower.includes('breathe') || lower.includes('swelling')))) &&
    !hasNegationBefore('anaphylaxis')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Severe Anaphylactic Shock Protocol',
      guidanceText: 'CRITICAL EMERGENCY: Anaphylaxis is a rapidly progressing, life-threatening airway and cardiovascular collapse.',
      actionHint: 'Inject Epinephrine Auto-Injector (EpiPen) into outer thigh & Call 112',
      recommendedSteps: [
        'Immediately inject an Epinephrine Auto-Injector into the middle outer thigh at a 90° angle. Hold firmly for 3 seconds.',
        'Call 112 immediately after administering epinephrine.',
        'Keep patient lying completely flat with legs raised. If breathing is difficult, allow patient to sit upright. Never stand the patient up.',
        'If symptoms do not improve within 5 minutes, administer a second auto-injector if available.'
      ],
      clinicalReference: {
        source: 'World Allergy Organization (WAO)',
        guideline: 'Anaphylaxis Management Guidance',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 4. ACUTE CORONARY SYNDROME / HEART ATTACK
  if (
    (lower.includes('heart attack') ||
      (lower.includes('chest pain') && !hasNegationBefore('chest pain')) ||
      (lower.includes('chest pressure') && !hasNegationBefore('chest pressure')) ||
      (lower.includes('chest') && (lower.includes('left arm') || lower.includes('jaw') || lower.includes('radiation')))) &&
    !hasNegationBefore('heart attack')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Acute Coronary Syndrome / Heart Attack Protocol',
      guidanceText: 'EMERGENCY RED FLAG: Central chest heaviness, crushing pressure, or pain radiating to left arm or jaw may indicate acute myocardial infarction.',
      actionHint: 'Call 112 immediately. Do not drive yourself.',
      recommendedSteps: [
        'Call 112 immediately for emergency medical transport with cardiac telemetry.',
        'Rest in a comfortable sitting position with knees bent to reduce workload on the heart.',
        'If instructed by medical dispatch and person has no aspirin allergy or active ulcer, chew one 300mg adult aspirin.',
        'Loosen all tight clothing around neck and waist. Keep patient calm and completely resting.'
      ],
      clinicalReference: {
        source: 'American College of Cardiology (ACC) / AHA',
        guideline: 'STEMI Emergency Response Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 5. HEAT STROKE vs ISCHEMIC STROKE (Accurate clinical distinction)
  if (
    lower.includes('heat stroke') ||
    lower.includes('heat exhaustion') ||
    lower.includes('sunstroke') ||
    (lower.includes('heat') && lower.includes('overheating'))
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Heat Stroke Emergency Cooling Protocol',
      guidanceText: 'EMERGENCY: Heat stroke (body temperature > 40°C with confusion or altered mental state) is life-threatening.',
      actionHint: 'Call 112 and begin rapid evaporative or cold water cooling immediately',
      recommendedSteps: [
        'Move the person immediately to a cool, shaded, or air-conditioned area.',
        'Call 112 for emergency medical transfer.',
        'Cool rapidly: immerse in cool water or spray with cold water while fanning vigorously.',
        'Place wrapped cold ice packs in armpits, groin, and neck.',
        'Do not force fluids if the person is disoriented, vomiting, or semi-conscious.'
      ],
      clinicalReference: {
        source: 'Wilderness Medical Society & NHS',
        guideline: 'Clinical Practice Guidelines for the Prevention and Treatment of Heat Illness',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 6. ACUTE ISCHEMIC STROKE (F.A.S.T.)
  if (
    (lower.includes('stroke') && !lower.includes('heat stroke') && !hasNegationBefore('stroke')) ||
    lower.includes('face droop') ||
    lower.includes('facial droop') ||
    lower.includes('slurred speech') ||
    lower.includes('arm weakness') ||
    lower.includes('sudden numbness on one side')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Acute Stroke Protocol (F.A.S.T.)',
      guidanceText: 'STROKE RED FLAG: Sudden loss of speech, facial weakness, or arm numbness requires immediate emergency stroke hospital transfer.',
      actionHint: 'Call 112 immediately. Note exact time of onset.',
      recommendedSteps: [
        'Check F.A.S.T.: Face (uneven smile), Arms (one arm drifts down), Speech (slurred), Time (call 112 now).',
        'Record the exact time when symptoms were first noticed (critical for thrombolysis window).',
        'Do NOT give food, water, or aspirin (hemorrhagic stroke must be ruled out first via CT scan).',
        'Keep patient resting comfortably on their side if vomiting or saliva accumulates.'
      ],
      clinicalReference: {
        source: 'World Stroke Organization (WSO) & American Stroke Association (ASA)',
        guideline: 'Acute Stroke Management Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 7. NOSEBLEED (EPISTAXIS) vs SEVERE ARTERIAL BLEEDING
  if (
    lower.includes('nosebleed') ||
    lower.includes('nose bleed') ||
    lower.includes('epistaxis') ||
    (lower.includes('nose') && (lower.includes('bleed') || lower.includes('bleeding')))
  ) {
    return {
      isEmergency: false,
      category: 'URGENT_FIRST_AID',
      title: 'Nosebleed (Epistaxis) Management',
      guidanceText: 'Standard first aid for active nosebleeds. Most resolve within 10 to 15 minutes of proper pinch pressure.',
      actionHint: 'Lean forward and pinch soft part of nose for 10-15 minutes',
      recommendedSteps: [
        'Sit upright and lean slightly FORWARD. Do not lean backward (prevents swallowing blood into airway or stomach).',
        'Firmly pinch the soft part of the nose below the bone bridge continuously for 10 to 15 minutes without releasing.',
        'Breathe calmly through the mouth.',
        'Apply a cold ice pack to the bridge of the nose or forehead to promote vasoconstriction.',
        'Seek emergency care at hospital if bleeding does not stop after 20 minutes of firm pressure or if blood loss is profuse.'
      ],
      clinicalReference: {
        source: 'British Association of Otorhinolaryngology (ENT UK)',
        guideline: 'Epistaxis Clinical First Aid Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 8. TRAUMATIC HEMORRHAGE / BLEEDING
  if (
    (lower.includes('bleeding') && !hasNegationBefore('bleeding')) ||
    (lower.includes('hemorrhage') && !hasNegationBefore('hemorrhage')) ||
    lower.includes('spurting blood') ||
    lower.includes('deep cut') ||
    lower.includes('arterial bleed')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Traumatic Hemorrhage Control Protocol',
      guidanceText: 'Active bleeding requires immediate direct hemostatic pressure to prevent hypovolemic shock.',
      actionHint: 'Apply continuous firm direct pressure with clean dressing & Call 112 if severe',
      recommendedSteps: [
        'Call 112 if blood is spurting, pooling rapidly, or will not stop with pressure.',
        'Press hard directly over wound with sterile gauze or clean cloth using two hands.',
        'Maintain continuous pressure without peeking. If gauze soaks through, add more layers on top.',
        'For catastrophic limb hemorrhage not stopped by pressure, apply a commercial tourniquet 5-7 cm above wound.'
      ],
      clinicalReference: {
        source: 'Stop the Bleed (American College of Surgeons)',
        guideline: 'Hemorrhage Control Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 9. SNAKEBITE & ENVENOMATION
  if (lower.includes('snakebite') || lower.includes('snake bite') || lower.includes('bitten by snake')) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Snakebite & Envenomation Emergency Protocol',
      guidanceText: 'CRITICAL EMERGENCY: Venomous snakebites can cause neuromuscular paralysis or severe coagulopathy within hours.',
      actionHint: 'Call 112 immediately. Keep patient completely still.',
      recommendedSteps: [
        'Keep patient calm and completely motionless to slow venom absorption through lymphatics.',
        'Immobilize the bitten limb at or slightly below heart level with a splint or sling.',
        'Remove rings, bracelets, and tight clothing before swelling develops.',
        'DO NOT cut wound, suction venom, apply arterial tourniquets, ice, or chemicals.',
        'Transport immediately to the nearest tertiary hospital equipped with polyvalent antivenom.'
      ],
      clinicalReference: {
        source: 'World Health Organization (WHO) & Govt of India',
        guideline: 'Standard Treatment Guidelines: Snake Envenomation',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 10. ACUTE SEIZURE & CONVULSIONS
  if (
    lower.includes('seizure') ||
    lower.includes('convulsion') ||
    lower.includes('epileptic fit') ||
    lower.includes('shaking uncontrollably')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Acute Seizure & Convulsion Safety Protocol',
      guidanceText: 'Active seizure safety requires preventing secondary traumatic head injuries while maintaining an open airway.',
      actionHint: 'Protect head, do not restrain, Call 112 if > 5 minutes',
      recommendedSteps: [
        'Ease patient gently to floor and cushion their head with a folded jacket or pillow.',
        'Clear sharp furniture and dangerous objects away from the area.',
        'NEVER put anything into their mouth or try to hold down their tongue.',
        'Time the seizure. Call 112 immediately if seizure lasts > 5 minutes or if patient is pregnant or injured.',
        'When convulsions cease, roll patient into the recovery position on their side.'
      ],
      clinicalReference: {
        source: 'Epilepsy Foundation & NICE Clinical Guidelines',
        guideline: 'Seizure First Aid Standards',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 11. POISONING & OVERDOSE
  if (
    lower.includes('poison') ||
    lower.includes('overdose') ||
    lower.includes('swallowed chemical') ||
    lower.includes('drank bleach') ||
    lower.includes('swallowed detergent') ||
    lower.includes('ingested pills')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Toxic Ingestion & Overdose Protocol',
      guidanceText: 'TOXICOLOGY EMERGENCY: Ingestion of corrosive chemicals, prescription drugs, or pesticides requires immediate medical guidance.',
      actionHint: 'Call 112 or National Poison Information Centre (1800 116 117)',
      recommendedSteps: [
        'Call 112 or National Poison Centre (India: 1800 116 117 / AIIMS Poison Control).',
        'DO NOT induce vomiting unless explicitly directed by a poison specialist (vomiting caustic chemicals causes double esophageal burns).',
        'Identify substance, container, estimated quantity, and exact time of ingestion.',
        'If patient is unconscious or breathing abnormally, place in recovery position and start CPR if pulse stops.'
      ],
      clinicalReference: {
        source: 'WHO & National Poison Information Centre (AIIMS)',
        guideline: 'Management of Acute Poisoning Guidelines',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 12. COUGHING BLOOD (HEMOPTYSIS)
  if (
    (lower.includes('coughing blood') || lower.includes('cough up blood') || lower.includes('blood in sputum')) &&
    !hasNegationBefore('blood')
  ) {
    return {
      isEmergency: true,
      category: 'CRITICAL_EMERGENCY',
      title: 'Hemoptysis (Coughing Blood) Emergency Evaluation',
      guidanceText: 'RED FLAG SYMPTOM: Coughing up blood requires urgent clinical investigation to rule out pulmonary embolism, severe respiratory infection, or vascular erosion.',
      actionHint: 'Call 112 or proceed to nearest Emergency Room immediately',
      recommendedSteps: [
        'Rest quietly in a sitting position to aid breathing.',
        'Call 112 if coughing up more than a few teaspoons of blood or if accompanied by chest pain or shortness of breath.',
        'Do not take cough suppressants or aspirin without emergency medical evaluation.',
        'Save expectorated blood in a clean container if possible to show ER clinical staff.'
      ],
      clinicalReference: {
        source: 'British Thoracic Society (BTS)',
        guideline: 'Guidelines for the Management of Hemoptysis',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 13. SEVERE BURNS
  if (
    (lower.includes('burn') || lower.includes('scald') || lower.includes('burned')) &&
    !hasNegationBefore('burn')
  ) {
    return {
      isEmergency: true,
      category: 'URGENT_FIRST_AID',
      title: 'Thermal & Chemical Burn Management',
      guidanceText: 'Immediate cooling stops thermal injury progression and preserves viable tissue.',
      actionHint: 'Cool with clean running water for 20 minutes. Call 112 for severe burns.',
      recommendedSteps: [
        'Cool the burn immediately under cool, clean running water for at least 20 minutes.',
        'Do NOT use ice, iced water, butter, oils, or toothpastes (they worsen necrosis).',
        'Gently remove rings, watches, and restrictive jewelry before swelling begins.',
        'Cover loosely with clean non-stick dressing or plastic wrap.',
        'Call 112 if burn is larger than patient’s palm, involves face/hands/joints, or causes white/charred skin.'
      ],
      clinicalReference: {
        source: 'British Burn Association & American Burn Association',
        guideline: 'Emergency Management of Severe Burns (EMSB)',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // 14. COMMON SYMPTOMS (COUGH, FEVER, COLD)
  if (lower.includes('cough')) {
    return {
      isEmergency: false,
      category: 'GENERAL_SUPPORTIVE',
      title: 'Cough Symptom Guidance',
      guidanceText: 'Cough is a protective airway reflex. Clinical significance depends on duration and red-flag symptoms.',
      actionHint: 'Supportive care. Seek medical care if red flags are present.',
      recommendedSteps: [
        'Stay hydrated with warm water, broths, or decaffeinated teas.',
        'For adults and children over 1 year, 1-2 teaspoons of honey can soothe throat irritation (never give honey to infants under 1 year).',
        'Use steam inhalation or a humidifier to loosen airway secretions.',
        'Seek urgent care if you develop fever > 38.5°C, chest pain, difficulty breathing, or if cough lasts > 3 weeks.'
      ],
      followUpQuestions: [
        'Has your cough lasted longer than 3 weeks?',
        'Are you experiencing any shortness of breath, high fever, or chest pain?',
        'Is the cough dry or producing thick green/yellow mucus?'
      ],
      clinicalReference: {
        source: 'NICE Guidelines & American College of Chest Physicians (ACCP)',
        guideline: 'Diagnosis and Management of Cough',
        reviewedDate: '2026-03-15'
      }
    };
  }

  if (lower.includes('fever') || lower.includes('high temperature')) {
    return {
      isEmergency: false,
      category: 'GENERAL_SUPPORTIVE',
      title: 'Fever Evaluation & Care',
      guidanceText: 'Fever is an immune response to infection. High or persistent fevers require targeted medical investigation.',
      actionHint: 'Hydrate, monitor temperature, and seek care if red flags occur',
      recommendedSteps: [
        'Rest and maintain adequate fluid intake (oral rehydration solution, water, soups).',
        'Wear light clothing and rest in a well-ventilated room.',
        'Antipyretics such as paracetamol can be used per package instructions if recommended by a physician.',
        'Seek immediate ER care if accompanied by stiff neck, confusion, dark purple rash, or persistent vomiting.'
      ],
      followUpQuestions: [
        'What is the measured body temperature?',
        'Does the person have a stiff neck, confusion, or rash?',
        'Is the patient an infant under 3 months old? (Infants under 3 months with fever require immediate ER evaluation).'
      ],
      clinicalReference: {
        source: 'NICE Clinical Guidelines',
        guideline: 'Fever in under 5s: assessment and initial management',
        reviewedDate: '2026-03-15'
      }
    };
  }

  // DEFAULT SAFE RESPONSE
  return {
    isEmergency: false,
    category: 'DISCLAIMER',
    title: 'General Symptom Guidance & Disclaimer',
    guidanceText: 'PulseCare+ provides evidence-based health guidance and first aid protocols based on international medical guidelines. It does not replace professional clinical diagnosis, laboratory evaluation, or medical advice.',
    actionHint: 'In an acute emergency, dial 112 immediately.',
    recommendedSteps: [
      'If you or someone nearby is experiencing severe chest pain, shortness of breath, uncontrollable bleeding, or loss of consciousness, dial 112 immediately.',
      'For non-emergency concerns, consult a licensed general physician or visit your nearest primary healthcare center.',
      'Use the First Aid tab in PulseCare+ for step-by-step verified resuscitation and trauma guides.'
    ],
    clinicalReference: {
      source: 'PulseCare Clinical Audit Board & WHO Health Guidelines',
      guideline: 'Health Guidance and Triage Standards',
      reviewedDate: '2026-03-15'
    }
  };
}
