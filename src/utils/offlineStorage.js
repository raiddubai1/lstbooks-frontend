// IndexedDB wrapper for offline storage
const DB_NAME = 'lstBooksDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  QUIZZES: 'quizzes',
  FLASHCARDS: 'flashcards',
  NOTES: 'notes',
  BOOKMARKS: 'bookmarks',
  PROGRESS: 'progress',
  PENDING_ACTIONS: 'pendingActions'
};

let db = null;

// Initialize database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.QUIZZES)) {
        database.createObjectStore(STORES.QUIZZES, { keyPath: '_id' });
      }

      if (!database.objectStoreNames.contains(STORES.FLASHCARDS)) {
        database.createObjectStore(STORES.FLASHCARDS, { keyPath: '_id' });
      }

      if (!database.objectStoreNames.contains(STORES.NOTES)) {
        database.createObjectStore(STORES.NOTES, { keyPath: '_id' });
      }

      if (!database.objectStoreNames.contains(STORES.BOOKMARKS)) {
        database.createObjectStore(STORES.BOOKMARKS, { keyPath: '_id' });
      }

      if (!database.objectStoreNames.contains(STORES.PROGRESS)) {
        database.createObjectStore(STORES.PROGRESS, { keyPath: 'id', autoIncrement: true });
      }

      if (!database.objectStoreNames.contains(STORES.PENDING_ACTIONS)) {
        const store = database.createObjectStore(STORES.PENDING_ACTIONS, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Generic CRUD operations
export const saveToStore = async (storeName, data) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getFromStore = async (storeName, key) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllFromStore = async (storeName) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteFromStore = async (storeName, key) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const clearStore = async (storeName) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Specific helpers for pending actions
export const savePendingAction = async (action) => {
  const actionWithTimestamp = {
    ...action,
    timestamp: Date.now()
  };
  return saveToStore(STORES.PENDING_ACTIONS, actionWithTimestamp);
};

export const getPendingActions = async () => {
  return getAllFromStore(STORES.PENDING_ACTIONS);
};

export const deletePendingAction = async (id) => {
  return deleteFromStore(STORES.PENDING_ACTIONS, id);
};

// Cache management
export const cacheQuizzes = async (quizzes) => {
  const database = await initDB();
  const transaction = database.transaction([STORES.QUIZZES], 'readwrite');
  const store = transaction.objectStore(STORES.QUIZZES);

  for (const quiz of quizzes) {
    store.put(quiz);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const getCachedQuizzes = async () => {
  return getAllFromStore(STORES.QUIZZES);
};

export { STORES };

