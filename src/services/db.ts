/**
 * PulseCare+ Local-First Storage Engine
 * Built on standard browser IndexedDB with Web Crypto AES-GCM encryption.
 * Strictly local to this device. No remote sync without explicit user action.
 */

import { MedicalRecord, EmergencyContact } from '../types';

const DB_NAME = 'pulsecare_local_db';
const DB_VERSION = 1;

export interface UserProfile {
  accountId: string;
  name: string;
  age: number;
  dob: string;
  bloodType: string;
  organDonor: boolean;
  criticalAllergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyNotes: string;
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  lastUpdated: string;
}

export interface StoredBackupPayload {
  version: number;
  exportedAt: string;
  accountId: string;
  profile: UserProfile;
  records: MedicalRecord[];
  contacts: EmergencyContact[];
}

// 1. Open or Upgrade IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
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

      if (!db.objectStoreNames.contains('auditLogs')) {
        const logStore = db.createObjectStore('auditLogs', { keyPath: 'id' });
        logStore.createIndex('accountId', 'accountId', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

// 2. Profile Management
export async function getLocalProfile(accountId: string): Promise<UserProfile | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profiles', 'readonly');
    const store = tx.objectStore('profiles');
    const req = store.get(accountId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalProfile(profile: UserProfile): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('profiles', 'readwrite');
    const store = tx.objectStore('profiles');
    const req = store.put({ ...profile, lastUpdated: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 3. Medical Records Management (Namespaced by Account)
export async function getLocalRecords(accountId: string): Promise<MedicalRecord[]> {
  const db = await openDB();
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
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('records', 'readwrite');
    const store = tx.objectStore('records');
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 4. Emergency Contacts Management
export async function getLocalContacts(accountId: string): Promise<EmergencyContact[]> {
  const db = await openDB();
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
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    const req = store.put(contact);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// 5. Delete All Data for an Account
export async function deleteAccountData(accountId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['profiles', 'records', 'contacts', 'auditLogs'], 'readwrite');

    tx.objectStore('profiles').delete(accountId);

    // Records
    const recordStore = tx.objectStore('records');
    const recIndex = recordStore.index('accountId');
    const recReq = recIndex.openCursor(IDBKeyRange.only(accountId));
    recReq.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    // Contacts
    const contactStore = tx.objectStore('contacts');
    const conIndex = contactStore.index('accountId');
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

// 6. Web Crypto API Encryption Helpers (AES-GCM with PBKDF2)
async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plainText: string, passphrase: string): Promise<{ ciphertext: string; iv: string; salt: string }> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuf = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText)
  );

  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encryptedBuf))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  };
}

export async function decryptData(ciphertext: string, iv: string, salt: string, passphrase: string): Promise<string> {
  const saltBytes = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const cipherBytes = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

  const key = await deriveEncryptionKey(passphrase, saltBytes);

  const decryptedBuf = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuf);
}

// 7. Export Encrypted Local Backup
export async function exportEncryptedBackup(accountId: string, passphrase: string): Promise<string> {
  const profile = await getLocalProfile(accountId);
  const records = await getLocalRecords(accountId);
  const contacts = await getLocalContacts(accountId);

  if (!profile) {
    throw new Error('No profile data found for export.');
  }

  const payload: StoredBackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accountId,
    profile,
    records,
    contacts
  };

  const jsonStr = JSON.stringify(payload);
  const encrypted = await encryptData(jsonStr, passphrase);

  return JSON.stringify({
    app: 'PulseCare+',
    format: 'encrypted-backup-v1',
    data: encrypted
  });
}

// 8. Import & Validate Encrypted Backup (Strict Defense)
export async function importEncryptedBackup(backupFileContent: string, passphrase: string, targetAccountId: string): Promise<StoredBackupPayload> {
  // Max size limit: 2 MB to prevent memory exhaustion
  if (backupFileContent.length > 2 * 1024 * 1024) {
    throw new Error('Backup file exceeds 2MB size limit.');
  }

  let parsedEnvelope: any;
  try {
    parsedEnvelope = JSON.parse(backupFileContent);
  } catch {
    throw new Error('Invalid backup file format: Malformed JSON envelope.');
  }

  if (parsedEnvelope.app !== 'PulseCare+' || parsedEnvelope.format !== 'encrypted-backup-v1' || !parsedEnvelope.data) {
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
    throw new Error('Decryption failed: Incorrect passphrase or corrupted file.');
  }

  let payload: StoredBackupPayload;
  try {
    payload = JSON.parse(decryptedJson);
  } catch {
    throw new Error('Decrypted payload is not valid JSON.');
  }

  // Schema verification
  if (!payload.profile || !Array.isArray(payload.records) || !Array.isArray(payload.contacts)) {
    throw new Error('Invalid backup schema: Missing profile, records, or contacts array.');
  }

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

  return payload;
}

// 9. Inspect Storage Usage Breakdown
export async function getStorageInspectSummary(accountId: string): Promise<{
  profileExists: boolean;
  recordsCount: number;
  contactsCount: number;
  estimatedBytes: number;
}> {
  const profile = await getLocalProfile(accountId);
  const records = await getLocalRecords(accountId);
  const contacts = await getLocalContacts(accountId);

  const approxBytes = JSON.stringify({ profile, records, contacts }).length * 2; // UTF-16 approx

  return {
    profileExists: Boolean(profile),
    recordsCount: records.length,
    contactsCount: contacts.length,
    estimatedBytes: approxBytes
  };
}
