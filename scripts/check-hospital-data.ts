/**
 * Audit script for PulseCare+ hospital directory data.
 * Checks:
 * - Stale records (verifiedAt > 6 months ago)
 * - E.164 phone number formatting
 * - Unique phone numbers across facilities
 * - Required provenance source and ISO date
 */

import { ALL_VERIFIED_HOSPITALS } from '../src/data/hospitals';

const E164_REGEX = /^\+[1-9]\d{7,14}$/;
const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000;
const now = Date.now();

let errorsFound = 0;
const seenPhones = new Map<string, string>();

console.log(`[PulseCare+ Audit] Inspecting ${ALL_VERIFIED_HOSPITALS.length} verified hospitals...\n`);

for (const hosp of ALL_VERIFIED_HOSPITALS) {
  // 1. Provenance check
  if (!hosp.source || hosp.source.trim().length === 0) {
    console.error(`❌ [FAIL] Hospital "${hosp.name}" (${hosp.id}) missing provenance source.`);
    errorsFound++;
  }

  if (!hosp.verifiedAt || isNaN(Date.parse(hosp.verifiedAt))) {
    console.error(`❌ [FAIL] Hospital "${hosp.name}" (${hosp.id}) missing or invalid verifiedAt date.`);
    errorsFound++;
  } else {
    const verifiedDate = new Date(hosp.verifiedAt).getTime();
    if (now - verifiedDate > SIX_MONTHS_MS) {
      console.warn(`⚠️ [STALE] Hospital "${hosp.name}" (${hosp.id}) verified over 6 months ago on ${hosp.verifiedAt}. Needs re-verification.`);
    }
  }

  // 2. Phone E.164 check
  if (!E164_REGEX.test(hosp.phone)) {
    console.error(`❌ [FAIL] Hospital "${hosp.name}" (${hosp.id}) phone "${hosp.phone}" does not match E.164 format.`);
    errorsFound++;
  }

  // 3. Unique phone check
  if (seenPhones.has(hosp.phone)) {
    console.error(`❌ [FAIL] Duplicate phone number "${hosp.phone}" shared by "${hosp.name}" and "${seenPhones.get(hosp.phone)}".`);
    errorsFound++;
  } else {
    seenPhones.set(hosp.phone, hosp.name);
  }
}

console.log(`\n[PulseCare+ Audit] Inspection completed with ${errorsFound} error(s).`);
if (errorsFound > 0) {
  process.exit(1);
} else {
  console.log('✅ All verified hospitals have proper provenance, valid E.164 phone numbers, and unique contacts.');
}
