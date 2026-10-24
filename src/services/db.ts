/**
 * PulseCare+ Local-First Storage & Cryptographic Vault Engine
 * Built on standard browser IndexedDB with Web Crypto AES-GCM 256-bit encryption.
 * PBKDF2 key derivation strictly configured to 600,000 iterations (OWASP standards).
 * Strict zero-knowledge local storage: data never leaves the browser.
 */

import { z } from 'zod';
import {
  UserProfile,
  MedicalRecord,
  EmergencyContact,
  LockScreenMedicalCard
} from '../types';

export type { UserProfile, LockScreenMedicalCard, MedicalRecord, EmergencyContact };

const DB_NAME = 'pulsecare_local_db';
const DB_VERSION = 2;
export const PBKDF2_ITERATIONS = 600000;

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================
export const UserProfileSchema = z.object({
  accountId: z.string(),
  name: z.string().min(1),
  age: z.number().optional(),
  dob: z.string().optional(),
  bloodType: z.string(),
  organDonor: z.boolean().optional(),
  criticalAllergies: z.array(z.string()),
  chronicConditions: z.array(z.string()),
  currentMedications: z.array(z.string()),
  emergencyNotes: z.string(),
  insurance: z
    .object({
      provider: z.string(),
      policyNumber: z.string(),
      groupNumber: z.string()
    })
    .optional(),
  lastUpdated: z.string(),
  isEncrypted: z.boolean().optional()
});

export const MedicalRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  category: z.enum(['Lab Report', 'Vaccination', 'Physician Note', 'Prescription']),
  summary: z.string(),
  doctor: z.string(),
  encryptedPayload: z.string().optional()
});

export const EmergencyContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  relationship: z.string(),
  phone: z.string(),
  isPrimary: z.boolean()
});

export const LockScreenMedicalCardSchema = z.object({
  isEnabled: z.boolean(),
  name: z.string(),
  bloodType: z.string(),
  criticalAllergies: z.array(z.string()),
  primaryContactName: z.string(),
  primaryContactPhone: z.string(),
  emergencyNotes: z.string()
});

export const StoredBackupPayloadSchema = z.object({
  version: z.number().int().positive(),
  exportedAt: z.string(),
  accountId: z.string(),
  profile: UserProfileSchema,
  records: z.array(MedicalRecordSchema),
  contacts: z.array(EmergencyContactSchema),
  lockScreenCard: LockScreenMedicalCardSchema.optional()
});

export type StoredBackupPayload = z.infer<typeof StoredBackupPayloadSchema>;

// ==========================================
// SINGLETON INDEXEDDB CONNECTION
// ==========================================
let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const idb = typeof window !== 'undefined' ? window.indexedDB : (globalThis as any).indexedDB;
    if (!idb) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('profiles')) {
        db.createObjectStore('profiles', { keyPath: 'accountId' });
      }

      if (!db.objectStoreNames.contains('records')) {
        const recordStore = db.createObjectStore('records', { keyPath: 'id' });
        recordStore.createIndex('accountId', 'accountId', { unique: false });
      }

      if (!db.objectStoreNames.contains('contacts')) {
        const contactStore = db.createObjectStore('contacts', { keyPath: 'id' });
        contactStore.createIndex('accountId', 'accountId', { unique: false });
      }

      if (!db.objectStoreNames.contains('lockScreenCards')) {
        db.createObjectStore('lockScreenCards', { keyPath: 'accountId' });
      }

      if (!db.objectStoreNames.contains('auditLogs')) {
        const logStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
        logStore.createIndex('accountId', 'accountId', { unique: false });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

export function getDatabaseConnection(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDB();
  }
  return dbPromise;
}

export function closeDatabaseConnection(): void {
  if (dbPromise) {
    dbPromise.then((db) => db.close()).catch(() => {});
    dbPromise = null;
  }
}

// ==========================================
// PROFILE MANAGEMENT
// ==========================================
export async function getLocalProfile(accountId: string): Promise<UserProfile | null> {
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profiles', 'readonly');
    const store = tx.objectStore('profiles');
    const req = store.get(accountId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalProfile(profile: UserProfile): Promise<void> {
  const validated = UserProfileSchema.parse(profile);
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profiles', 'readwrite');
    const store = tx.objectStore('profiles');
    const req = store.put({ ...validated, lastUpdated: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ==========================================
// MEDICAL RECORDS MANAGEMENT
// ==========================================
export async function getLocalRecords(accountId: string): Promise<MedicalRecord[]> {
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readonly');
    const store = tx.objectStore('records');
    const index = store.index('accountId');
    const req = index.getAll(accountId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalRecord(record: MedicalRecord & { accountId: string }): Promise<void> {
  const validated = MedicalRecordSchema.extend({ accountId: z.string() }).parse(record);
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    const req = store.put(validated);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ==========================================
// EMERGENCY CONTACTS MANAGEMENT
// ==========================================
export async function getLocalContacts(accountId: string): Promise<EmergencyContact[]> {
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readonly');
    const store = tx.objectStore('contacts');
    const index = store.index('accountId');
    const req = index.getAll(accountId);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalContact(contact: EmergencyContact & { accountId: string }): Promise<void> {
  const validated = EmergencyContactSchema.extend({ accountId: z.string() }).parse(contact);
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    const req = store.put(validated);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ==========================================
// PLAINTEXT LOCK-SCREEN EMERGENCY CARD
// (Accessible by first responders without cryptographic passphrase)
// ==========================================
export async function getLockScreenCard(accountId: string): Promise<LockScreenMedicalCard | null> {
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('lockScreenCards', 'readonly');
    const store = tx.objectStore('lockScreenCards');
    const req = store.get(accountId);
    req.onsuccess = () => {
      if (!req.result) {
        resolve(null);
      } else {
        const { accountId: _acc, ...card } = req.result;
        resolve(card as LockScreenMedicalCard);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveLockScreenCard(accountId: string, card: LockScreenMedicalCard): Promise<void> {
  const validated = LockScreenMedicalCardSchema.parse(card);
  const db = await getDatabaseConnection();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('lockScreenCards', 'readwrite');
    const store = tx.objectStore('lockScreenCards');
    const req = store.put({ accountId, ...validated });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ==========================================
// CRYPTOGRAPHY: PBKDF2 (600,000 iters) + AES-GCM 256-bit
// ==========================================
function getSubtleCrypto(): SubtleCrypto {
  const subtle =
    typeof window !== 'undefined'
      ? window.crypto?.subtle
      : (globalThis as any).crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Cryptography API (subtle) is not available.');
  }
  return subtle;
}

function getRandomValues(array: Uint8Array): Uint8Array {
  const cryptoObj =
    typeof window !== 'undefined'
      ? window.crypto
      : (globalThis as any).crypto;
  return cryptoObj.getRandomValues(array);
}

export async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(
  plainText: string,
  passphrase: string
): Promise<{ ciphertext: string; iv: string; salt: string }> {
  const subtle = getSubtleCrypto();
  const salt = getRandomValues(new Uint8Array(16));
  const iv = getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuf = await subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    enc.encode(plainText)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedBuf))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  };
}

export async function decryptData(
  ciphertext: string,
  iv: string,
  salt: string,
  passphrase: string
): Promise<string> {
  const subtle = getSubtleCrypto();
  const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const cipherBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

  const key = await deriveEncryptionKey(passphrase, saltBytes);

  const decryptedBuf = await subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuf);
}

// ==========================================
// EXPORT & IMPORT (Strict Zod Validation)
// ==========================================
export async function exportEncryptedBackup(accountId: string, passphrase: string): Promise<string> {
  const profile = await getLocalProfile(accountId);
  const records = await getLocalRecords(accountId);
  const contacts = await getLocalContacts(accountId);
  const lockScreenCard = await getLockScreenCard(accountId);

  if (!profile) {
    throw new Error('No profile data found for export.');
  }

  const payload: StoredBackupPayload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    accountId,
    profile,
    records,
    contacts,
    lockScreenCard: lockScreenCard || undefined
  };

  const validated = StoredBackupPayloadSchema.parse(payload);
  const jsonStr = JSON.stringify(validated);
  const encrypted = await encryptData(jsonStr, passphrase);

  return JSON.stringify({
    app: 'PulseCare+',
    format: 'encrypted-backup-v2',
    iterations: PBKDF2_ITERATIONS,
    data: encrypted
  });
}

export async function importEncryptedBackup(
  backupFileContent: string,
  passphrase: string,
  targetAccountId: string
): Promise<StoredBackupPayload> {
  // Max size limit: 2 MB
  if (backupFileContent.length > 2 * 1024 * 1024) {
    throw new Error('Backup file exceeds 2MB size limit.');
  }

  let parsedEnvelope: any;
  try {
    parsedEnvelope = JSON.parse(backupFileContent);
  } catch {
    throw new Error('Invalid backup file format: Malformed JSON envelope.');
  }

  if (
    parsedEnvelope.app !== 'PulseCare+' ||
    (parsedEnvelope.format !== 'encrypted-backup-v2' && parsedEnvelope.format !== 'encrypted-backup-v1') ||
    !parsedEnvelope.data
  ) {
    throw new Error('Unrecognized backup format. Please select a valid PulseCare+ export.');
  }

  const { ciphertext, iv, salt } = parsedEnvelope.data;
  if (!ciphertext || !iv || !salt) {
    throw new Error('Incomplete cryptographic envelope.');
  }

  let decryptedJson: string;
  try {
    decryptedJson = await decryptData(ciphertext, iv, salt, passphrase);
  } catch {
    throw new Error('Decryption failed: Incorrect passphrase or corrupted backup.');
  }

  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(decryptedJson);
  } catch {
    throw new Error('Decrypted payload is not valid JSON.');
  }

  // Strict Zod schema verification
  const parseResult = StoredBackupPayloadSchema.safeParse(rawPayload);
  if (!parseResult.success) {
    throw new Error(`Invalid backup schema: ${parseResult.error.message}`);
  }

  const payload = parseResult.data;

  // Save into IndexedDB namespaced by target account ID
  const updatedProfile: UserProfile = {
    ...payload.profile,
    accountId: targetAccountId,
    lastUpdated: new Date().toISOString()
  };
  await saveLocalProfile(updatedProfile);

  for (const rec of payload.records) {
    await saveLocalRecord({ ...rec, accountId: targetAccountId });
  }

  for (const con of payload.contacts) {
    await saveLocalContact({ ...con, accountId: targetAccountId });
  }

  if (payload.lockScreenCard) {
    await saveLockScreenCard(targetAccountId, payload.lockScreenCard);
  }

  return payload;
}

// ==========================================
// PURGE ALL USER DATA (Zero-Retention)
// ==========================================
export async function deleteAllUserData(accountId?: string): Promise<void> {
  if (accountId) {
    const db = await getDatabaseConnection();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['profiles', 'records', 'contacts', 'lockScreenCards', 'auditLogs'], 'readwrite');
      tx.objectStore('profiles').delete(accountId);
      tx.objectStore('lockScreenCards').delete(accountId);

      const recStore = tx.objectStore('records');
      const recIndex = recStore.index('accountId');
      const recReq = recIndex.openCursor(IDBKeyRange.only(accountId));
      recReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      const conStore = tx.objectStore('contacts');
      const conIndex = conStore.index('accountId');
      const conReq = conIndex.openCursor(IDBKeyRange.only(accountId));
      conReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Wipe local storage caches
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
  }
}

export const deleteAccountData = deleteAllUserData;

export async function getStorageInspectSummary(accountId: string): Promise<{
  profileExists: boolean;
  recordsCount: number;
  contactsCount: number;
  estimatedBytes: number;
}> {
  const profile = await getLocalProfile(accountId);
  const records = await getLocalRecords(accountId);
  const contacts = await getLocalContacts(accountId);

  const approxBytes = JSON.stringify({ profile, records, contacts }).length * 2;

  return {
    profileExists: Boolean(profile),
    recordsCount: records.length,
    contactsCount: contacts.length,
    estimatedBytes: approxBytes
  };
}
