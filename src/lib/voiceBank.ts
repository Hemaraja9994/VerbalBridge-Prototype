/**
 * Voice Bank — IndexedDB-backed store for familiar voice recordings.
 *
 * Why familiar voice over TTS for aphasia therapy?
 * Aphasia rehab literature (Pulvermüller, Robey) shows that familiar voices
 * (spouse, child, caregiver) elicit stronger semantic-emotional networks than
 * generic synthetic voices, accelerating word retrieval.
 *
 * Storage model: blobs keyed by `${lang}:${itemId}` plus a metadata record
 * for who recorded it and when. Pure browser-side, offline-safe.
 */

const DB_NAME = 'verbalbridge-voicebank';
const DB_VERSION = 1;
const STORE = 'recordings';

export interface VoiceRecord {
  key: string; // `${lang}:${itemId}`
  lang: string;
  itemId: string;
  word: string;
  blob: Blob;
  recordedBy: string;
  createdAt: number;
  durationMs: number;
}

let _dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

function makeKey(lang: string, itemId: string): string {
  return `${lang}:${itemId}`;
}

export async function saveRecording(
  rec: Omit<VoiceRecord, 'key' | 'createdAt'> & { createdAt?: number }
): Promise<void> {
  const db = await openDb();
  const full: VoiceRecord = {
    ...rec,
    key: makeKey(rec.lang, rec.itemId),
    createdAt: rec.createdAt ?? Date.now(),
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(full);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecording(
  lang: string,
  itemId: string
): Promise<VoiceRecord | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(makeKey(lang, itemId));
    req.onsuccess = () => resolve((req.result as VoiceRecord) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function listRecordings(lang: string): Promise<VoiceRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const all = (req.result as VoiceRecord[]) ?? [];
      resolve(all.filter((r) => r.lang === lang));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecording(lang: string, itemId: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(makeKey(lang, itemId));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAll(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Pick a supported MIME type for MediaRecorder (browser-dependent). */
export function pickRecorderMime(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
  ];
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      return m;
    }
  }
  return '';
}
