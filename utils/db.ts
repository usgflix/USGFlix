
import type { SavedReport } from '../types';

const DB_NAME = 'UltrasoundReportsDB';
const DB_VERSION = 1;
const STORE_NAME = 'reports';

let db: IDBDatabase;

export function initDB(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject(false);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = () => {
      const localDb = request.result;
      if (!localDb.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = localDb.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        // Index patient name for searching
        objectStore.createIndex('patientName', 'patient.name', { unique: false });
        // Index creation date for sorting
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

export function addReport(report: Omit<SavedReport, 'id' | 'createdAt'> & { createdAt: Date }): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!db) {
        reject('DB not initialized');
        return;
    }
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(report);

    request.onsuccess = () => {
      resolve(request.result as number);
    };

    request.onerror = () => {
      console.error('Error adding report:', request.error);
      reject(request.error);
    };
  });
}

export function getReports(patientNameQuery: string = ''): Promise<SavedReport[]> {
  return new Promise((resolve, reject) => {
     if (!db) {
        reject('DB not initialized');
        return;
    }
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('createdAt'); // Sort by most recent
    const reports: SavedReport[] = [];
    
    // Open a cursor to iterate in reverse (newest first)
    const cursorRequest = index.openCursor(null, 'prev');
    let count = 0;

    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const report = cursor.value as SavedReport;
        // If there's a search query, filter by it. Otherwise, include all.
        if (!patientNameQuery || report.patient.name.toLowerCase().includes(patientNameQuery.toLowerCase())) {
           reports.push(report);
           count++;
        }
        // Stop after finding 10 matches if there is no search query.
        // If searching, we check all and then slice, to find all possible matches.
        if (count < 100 && cursor) { // Limit to 100 to avoid performance issues
            cursor.continue();
        } else {
             resolve(reports.slice(0, 10));
        }
      } else {
        // Resolve when cursor is done.
        resolve(reports.slice(0, 10));
      }
    };

    cursorRequest.onerror = () => {
        console.error('Error fetching reports:', cursorRequest.error);
        reject(cursorRequest.error);
    };
  });
}
