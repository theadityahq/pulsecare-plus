import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  encryptData,
  decryptData,
  saveLocalProfile,
  getLocalProfile,
  saveLockScreenCard,
  getLockScreenCard,
  exportEncryptedBackup,
  importEncryptedBackup,
  closeDatabaseConnection,
  PBKDF2_ITERATIONS
} from '../src/services/db';
import { UserProfile, LockScreenMedicalCard } from '../src/types';

describe('Storage & Cryptographic Vault Security', () => {
  const accountId = 'test-account-01';
  const passphrase = 'SuperSecureEmergencyPassphrase2026!';

  const mockProfile: UserProfile = {
    accountId,
    name: 'Jane Doe',
    age: 28,
    dob: '1998-06-15',
    bloodType: 'B- Negative',
    organDonor: true,
    criticalAllergies: ['Latex', 'Penicillin'],
    chronicConditions: ['Type 1 Diabetes'],
    currentMedications: ['Insulin Lispro'],
    emergencyNotes: 'Carries glucagon pen in backpack.',
    lastUpdated: new Date().toISOString()
  };

  const mockLockScreenCard: LockScreenMedicalCard = {
    isEnabled: true,
    name: 'Jane Doe',
    bloodType: 'B- Negative',
    criticalAllergies: ['Latex', 'Penicillin'],
    primaryContactName: 'Mark Doe (Spouse)',
    primaryContactPhone: '+919876543210',
    emergencyNotes: 'Type 1 Diabetes. Glucagon in bag.'
  };

  afterEach(() => {
    closeDatabaseConnection();
  });

  it('uses at least 600,000 PBKDF2 iterations for NIST/OWASP compliance', () => {
    expect(PBKDF2_ITERATIONS).toBeGreaterThanOrEqual(600000);
  });

  it('correctly encrypts and decrypts payload using AES-GCM 256-bit', async () => {
    const secret = JSON.stringify({ confidential: 'sensitive-clinical-data-987' });
    const encrypted = await encryptData(secret, passphrase);

    expect(encrypted.ciphertext).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();
    expect(encrypted.salt).toBeTruthy();
    expect(encrypted.ciphertext).not.toBe(secret);

    const decrypted = await decryptData(encrypted.ciphertext, encrypted.iv, encrypted.salt, passphrase);
    expect(decrypted).toBe(secret);
  });

  it('fails decryption when provided an incorrect passphrase', async () => {
    const secret = 'Private emergency medical file';
    const encrypted = await encryptData(secret, passphrase);

    await expect(
      decryptData(encrypted.ciphertext, encrypted.iv, encrypted.salt, 'WrongPassphrase!')
    ).rejects.toThrow();
  });

  it('stores and retrieves profile safely in IndexedDB', async () => {
    await saveLocalProfile(mockProfile);
    const retrieved = await getLocalProfile(accountId);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('Jane Doe');
    expect(retrieved?.bloodType).toBe('B- Negative');
    expect(retrieved?.criticalAllergies).toContain('Latex');
  });

  it('stores and retrieves plaintext lock-screen card without requiring a cryptographic passphrase', async () => {
    await saveLockScreenCard(accountId, mockLockScreenCard);
    const retrievedCard = await getLockScreenCard(accountId);

    expect(retrievedCard).not.toBeNull();
    expect(retrievedCard?.bloodType).toBe('B- Negative');
    expect(retrievedCard?.primaryContactPhone).toBe('+919876543210');
  });

  it('exports encrypted backup and imports it back with Zod schema verification', async () => {
    await saveLocalProfile(mockProfile);
    await saveLockScreenCard(accountId, mockLockScreenCard);

    const backupJson = await exportEncryptedBackup(accountId, passphrase);
    expect(backupJson).toContain('encrypted-backup-v2');

    const targetAccount = 'imported-account-02';
    const imported = await importEncryptedBackup(backupJson, passphrase, targetAccount);

    expect(imported.profile.name).toBe('Jane Doe');
    const importedProfile = await getLocalProfile(targetAccount);
    expect(importedProfile?.bloodType).toBe('B- Negative');
  });

  it('rejects tampered or corrupt backup payloads via strict Zod validation', async () => {
    const badBackup = JSON.stringify({
      app: 'PulseCare+',
      format: 'encrypted-backup-v2',
      data: {
        ciphertext: 'fake',
        iv: 'fake',
        salt: 'fake'
      }
    });

    await expect(
      importEncryptedBackup(badBackup, passphrase, 'some-account')
    ).rejects.toThrow();
  });
});
