import { describe, it, expect } from 'vitest';
import { evaluateSymptomInput } from '../src/services/symptomGuidanceService';

describe('Rule-Based Symptom Guidance Triage Engine', () => {
  const TEST_CASES: Array<{
    phrase: string;
    expectedCategory: string;
    expectedEmergency: boolean;
    description: string;
  }> = [
    // 1-5: Mental Health & Suicide Crisis
    { phrase: 'I want to kill myself', expectedCategory: 'MENTAL_HEALTH_CRISIS', expectedEmergency: true, description: 'Suicide intent phrase' },
    { phrase: 'thinking about suicide today', expectedCategory: 'MENTAL_HEALTH_CRISIS', expectedEmergency: true, description: 'Suicide ideation' },
    { phrase: 'I want to end my life', expectedCategory: 'MENTAL_HEALTH_CRISIS', expectedEmergency: true, description: 'Ending life statement' },
    { phrase: 'struggling with self harm urges', expectedCategory: 'MENTAL_HEALTH_CRISIS', expectedEmergency: true, description: 'Self harm support' },
    { phrase: 'I feel desperate and want to die', expectedCategory: 'MENTAL_HEALTH_CRISIS', expectedEmergency: true, description: 'Crisis expression' },

    // 6-10: Unconscious & Cardiac Arrest
    { phrase: 'The person is unconscious and not waking up', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Unconscious adult' },
    { phrase: 'He collapsed and stopped breathing', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Respiratory arrest' },
    { phrase: 'Patient is unresponsive on the floor', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Unresponsive patient' },
    { phrase: 'No pulse found on victim', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'No pulse detection' },
    { phrase: 'He passed out and not waking', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Syncope without waking' },

    // 11-15: Chest Pain & Acute Coronary Syndrome
    { phrase: 'Crushing chest pain radiating to my left arm', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Classic STEMI presentation' },
    { phrase: 'I think I am having a heart attack', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Heart attack concern' },
    { phrase: 'Severe heavy chest pressure and jaw pain', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Chest pressure with jaw radiation' },
    { phrase: 'Sudden tight chest pain while climbing stairs', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Exertional chest pain' },
    { phrase: 'Acute chest pain and sweating', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Diaphoretic chest pain' },

    // 16-19: Anaphylaxis
    { phrase: 'My throat is swelling and I am having an allergic reaction', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Anaphylactic airway swelling' },
    { phrase: 'Severe anaphylaxis after eating shellfish', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Shellfish anaphylaxis' },
    { phrase: 'Need help using an EpiPen immediately', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'EpiPen administration guide' },
    { phrase: 'Allergic reaction with tongue swelling and trouble breathing', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Tongue angioedema' },

    // 20-23: Stroke vs Heat Stroke Distinction
    { phrase: 'Sudden face droop and slurred speech', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Ischemic stroke F.A.S.T.' },
    { phrase: 'My grandmother has sudden arm weakness and cannot speak clearly', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Acute stroke symptoms' },
    { phrase: 'Person collapsed in direct sunlight with heat stroke and hot dry skin', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Heat stroke cooling' },
    { phrase: 'Treating heat exhaustion and overheating at the marathon', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Heat exhaustion' },

    // 24-27: Nosebleed vs Hemorrhage
    { phrase: 'My nose is bleeding after dry weather', expectedCategory: 'URGENT_FIRST_AID', expectedEmergency: false, description: 'Routine nosebleed' },
    { phrase: 'How do I stop an active nosebleed?', expectedCategory: 'URGENT_FIRST_AID', expectedEmergency: false, description: 'Epistaxis first aid' },
    { phrase: 'Arterial bleeding from a deep chainsaw cut', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Severe trauma bleed' },
    { phrase: 'Spurting blood from forearm wound', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Spurting hemorrhage' },

    // 28-31: Snakebite & Seizures
    { phrase: 'Bitten by snake in tall grass on ankle', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Snake envenomation' },
    { phrase: 'Venomous snakebite protocol needed', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Snakebite management' },
    { phrase: 'Friend is having an active seizure shaking uncontrollably', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Seizure convulsion safety' },
    { phrase: 'Grand mal epileptic fit started 2 minutes ago', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Epileptic seizure' },

    // 32-35: Poisoning, Overdose & Hemoptysis
    { phrase: 'Toddler swallowed detergent pods', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Pediatric poison ingestion' },
    { phrase: 'Accidental overdose of sleeping pills', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Pharmaceutical overdose' },
    { phrase: 'Drank bleach accidentally', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Caustic chemical ingestion' },
    { phrase: 'I am coughing blood into the sink', expectedCategory: 'CRITICAL_EMERGENCY', expectedEmergency: true, description: 'Hemoptysis red flag' },

    // 36-38: Burns
    { phrase: 'Spilled boiling water on hand and wrist severe burn', expectedCategory: 'URGENT_FIRST_AID', expectedEmergency: true, description: 'Scald burn first aid' },
    { phrase: 'Deep chemical burn from sulfuric acid', expectedCategory: 'URGENT_FIRST_AID', expectedEmergency: true, description: 'Chemical burn' },
    { phrase: 'Severe second degree burn with blistering', expectedCategory: 'URGENT_FIRST_AID', expectedEmergency: true, description: 'Blistered burn' },

    // 39-41: Common Non-Emergency Symptoms
    { phrase: 'I have had a mild dry cough for two days', expectedCategory: 'GENERAL_SUPPORTIVE', expectedEmergency: false, description: 'Mild acute cough' },
    { phrase: 'Low-grade fever 37.8 C and runny nose', expectedCategory: 'GENERAL_SUPPORTIVE', expectedEmergency: false, description: 'Low grade fever' },
    { phrase: 'What home care is recommended for a persistent cough?', expectedCategory: 'GENERAL_SUPPORTIVE', expectedEmergency: false, description: 'Cough supportive care' },

    // 42-45: Negation Handling (Must NOT trigger false emergency alarms)
    { phrase: 'I am not allergic to penicillin', expectedCategory: 'DISCLAIMER', expectedEmergency: false, description: 'Negation: not allergic' },
    { phrase: 'The patient has no chest pain currently', expectedCategory: 'DISCLAIMER', expectedEmergency: false, description: 'Negation: no chest pain' },
    { phrase: 'Wound is clean and not bleeding anymore', expectedCategory: 'DISCLAIMER', expectedEmergency: false, description: 'Negation: not bleeding' },
    { phrase: 'Exam confirmed no stroke symptoms present', expectedCategory: 'DISCLAIMER', expectedEmergency: false, description: 'Negation: no stroke' }
  ];

  it('contains at least 40 rigorous test phrases', () => {
    expect(TEST_CASES.length).toBeGreaterThanOrEqual(40);
  });

  TEST_CASES.forEach(({ phrase, expectedCategory, expectedEmergency, description }, idx) => {
    it(`Case ${idx + 1}: ${description} ("${phrase}")`, () => {
      const res = evaluateSymptomInput(phrase);
      expect(res.category).toBe(expectedCategory);
      expect(res.emergency ?? res.isEmergency).toBe(expectedEmergency);
      expect(res.clinicalReference).toBeDefined();
      expect(res.clinicalReference.source).toBeTruthy();
    });
  });
});
