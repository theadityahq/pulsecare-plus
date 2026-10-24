import { describe, it, expect } from 'vitest';
import { ALL_VERIFIED_HOSPITALS, VERIFIED_REGIONAL_HOSPITALS } from '../src/data/hospitals';

describe('Hospital Directory Integrity & Provenance', () => {
  const E164_REGEX = /^\+[1-9]\d{7,14}$/;

  it('contains verified hospitals across all 6 preset regions', () => {
    expect(Object.keys(VERIFIED_REGIONAL_HOSPITALS)).toEqual([
      'delhi',
      'mumbai',
      'bengaluru',
      'kolkata',
      'london',
      'geneva'
    ]);
    expect(ALL_VERIFIED_HOSPITALS.length).toBeGreaterThanOrEqual(25);
  });

  it('ensures every hospital has provenance source and valid ISO verifiedAt date', () => {
    for (const hosp of ALL_VERIFIED_HOSPITALS) {
      expect(hosp.source, `Hospital ${hosp.name} must have a non-empty source`).toBeTruthy();
      expect(hosp.source.length).toBeGreaterThan(5);
      expect(hosp.verifiedAt, `Hospital ${hosp.name} must have verifiedAt`).toBeTruthy();
      expect(isNaN(Date.parse(hosp.verifiedAt))).toBe(false);
    }
  });

  it('ensures all hospital phone numbers match strict E.164 formatting without spaces or dashes', () => {
    for (const hosp of ALL_VERIFIED_HOSPITALS) {
      expect(
        E164_REGEX.test(hosp.phone),
        `Hospital ${hosp.name} phone ${hosp.phone} must match E.164 format`
      ).toBe(true);
    }
  });

  it('ensures no two hospitals share the same telephone number', () => {
    const seenPhones = new Set<string>();
    for (const hosp of ALL_VERIFIED_HOSPITALS) {
      expect(
        seenPhones.has(hosp.phone),
        `Duplicate phone number found: ${hosp.phone} for hospital ${hosp.name}`
      ).toBe(false);
      seenPhones.add(hosp.phone);
    }
  });

  it('ensures no hospital has 3D-specific coordinates or live ICU beds claims in domain model', () => {
    for (const hosp of ALL_VERIFIED_HOSPITALS) {
      expect((hosp as any).coordinates).toBeUndefined();
      expect((hosp as any).icuBedsAvailable).toBeUndefined();
      expect((hosp as any).erWaitTime).toBeUndefined();
    }
  });
});
