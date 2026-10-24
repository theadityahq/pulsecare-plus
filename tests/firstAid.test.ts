import { describe, it, expect } from 'vitest';
import { FIRST_AID_GUIDES } from '../src/data/mockData';

describe('First Aid Guides Integrity & Clinical Provenance', () => {
  it('contains essential life-support protocols (CPR, Choking, Bleeding, Anaphylaxis, Seizure, Burns)', () => {
    const ids = FIRST_AID_GUIDES.map((g) => g.id);
    expect(ids).toContain('fa-cpr');
    expect(ids).toContain('fa-choking');
    expect(ids).toContain('fa-bleeding');
    expect(ids).toContain('fa-anaphylaxis');
    expect(ids).toContain('fa-seizure');
    expect(ids).toContain('fa-burn');
  });

  it('ensures every CRITICAL protocol begins with calling 112 / emergency dispatch in step 1', () => {
    const criticalGuides = FIRST_AID_GUIDES.filter((g) => g.urgency === 'CRITICAL');
    expect(criticalGuides.length).toBeGreaterThan(0);

    for (const guide of criticalGuides) {
      const step1 = guide.steps[0];
      expect(step1).toBeDefined();
      const combined = `${step1.title} ${step1.description}`.toLowerCase();
      const hasEmergencyCall =
        combined.includes('112') ||
        combined.includes('emergency') ||
        combined.includes('ambulance') ||
        combined.includes('dispatch');
      expect(
        hasEmergencyCall,
        `Guide "${guide.title}" must instruct to call 112/emergency in step 1`
      ).toBe(true);
    }
  });

  it('verifies CPR protocol has a 100-120 BPM metronome configured', () => {
    const cpr = FIRST_AID_GUIDES.find((g) => g.id === 'fa-cpr');
    expect(cpr).toBeDefined();
    expect(cpr?.hasMetronome).toBe(true);
    expect(cpr?.bpm).toBeGreaterThanOrEqual(100);
    expect(cpr?.bpm).toBeLessThanOrEqual(120);
  });

  it('ensures every guide has accredited clinical evidence sources', () => {
    for (const guide of FIRST_AID_GUIDES) {
      expect(guide.sources).toBeDefined();
      expect(guide.sources.length).toBeGreaterThanOrEqual(1);
      expect(guide.sources[0].name).toBeTruthy();
    }
  });

  it('verifies all steps have sequential numbers and non-empty content', () => {
    for (const guide of FIRST_AID_GUIDES) {
      expect(guide.steps.length).toBeGreaterThanOrEqual(2);
      guide.steps.forEach((step, idx) => {
        expect(step.number).toBe(idx + 1);
        expect(step.title.trim().length).toBeGreaterThan(0);
        expect(step.description.trim().length).toBeGreaterThan(0);
      });
    }
  });
});
