// IndexedDB configuration and helper functions
const DB_NAME = 'accountingAppDb';
const DB_VERSION = 1;

// Database tables/stores
const STORES = {
  USERS: 'users',
  ACCOUNTS: 'accounts',
  ACCOUNT_CATEGORIES: 'account_categories',
  TRANSACTIONS: 'transactions',
  TRANSACTION_TYPES: 'transaction_types',
  JOURNAL_ENTRIES: 'journal_entries',
  JOURNAL_ITEMS: 'journal_items',
  GENERAL_LEDGER: 'general_ledger',
  FISCAL_YEARS: 'fiscal_years',
  INVENTORY_CATEGORIES: 'inventory_categories',
  INVENTORY_ITEMS: 'inventory_items',
  INVENTORY_TRANSACTIONS: 'inventory_transactions',
  ASSET_CATEGORIES: 'asset_categories',
  FIXED_ASSETS: 'fixed_assets',
  DEPRECIATION: 'depreciation',
  FINANCIAL_STATEMENTS: 'financial_statements'
};

// Open database connection
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id', autoIncrement: true });
        usersStore.createIndex('email', 'email', { unique: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.ACCOUNTS)) {
        const accountsStore = db.createObjectStore(STORES.ACCOUNTS, { keyPath: 'id', autoIncrement: true });
        accountsStore.createIndex('code', 'code', { unique: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.ACCOUNT_CATEGORIES)) {
        const categoryStore = db.createObjectStore(STORES.ACCOUNT_CATEGORIES, { keyPath: 'id', autoIncrement: true });
        categoryStore.createIndex('code', 'code', { unique: true });
      }
      
      // Create other stores as needed for the application
      [
        STORES.TRANSACTIONS,
        STORES.TRANSACTION_TYPES,
        STORES.JOURNAL_ENTRIES,
        STORES.JOURNAL_ITEMS,
        STORES.GENERAL_LEDGER,
        STORES.FISCAL_YEARS,
        STORES.INVENTORY_CATEGORIES,
        STORES.INVENTORY_ITEMS,
        STORES.INVENTORY_TRANSACTIONS,
        STORES.ASSET_CATEGORIES,
        STORES.FIXED_ASSETS,
        STORES.DEPRECIATION,
        STORES.FINANCIAL_STATEMENTS
      ].forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      });
    };
  });
};

// Generic CRUD operations
const dbOperation = async (storeName, operation, ...args) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, operation === 'get' || operation === 'getAll' ? 'readonly' : 'readwrite');
    const store = transaction.objectStore(storeName);
    
    let request;
    switch (operation) {
      case 'get':
        request = store.get(args[0]);
        break;
      case 'getAll':
        request = store.getAll();
        break;
      case 'add':
        request = store.add(args[0]);
        break;
      case 'put':
        request = store.put(args[0]);
        break;
      case 'delete':
        request = store.delete(args[0]);
        break;
      default:
        reject(new Error('Invalid operation'));
        return;
    }

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Query by index
const queryByIndex = async (storeName, indexName, value) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.get(value);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Export database operations
export const db = {
  add: (storeName, data) => dbOperation(storeName, 'add', data),
  get: (storeName, id) => dbOperation(storeName, 'get', id),
  getAll: (storeName) => dbOperation(storeName, 'getAll'),
  update: (storeName, data) => dbOperation(storeName, 'put', data),
  delete: (storeName, id) => dbOperation(storeName, 'delete', id),
  queryByIndex: queryByIndex,
  STORES
};

// Seed initial data for the application
export const seedInitialData = async () => {
  try {
    // Check if account categories already exist
    const existingCategories = await db.getAll(db.STORES.ACCOUNT_CATEGORIES);
    
    if (existingCategories.length === 0) {
      const categories = [
        { code: '1', name: 'Aset Lancar', type: 'asset', createdAt: new Date(), updatedAt: new Date() },
        { code: '2', name: 'Aset Tetap', type: 'asset', createdAt: new Date(), updatedAt: new Date() },
        { code: '3', name: 'Kewajiban Lancar', type: 'liability', createdAt: new Date(), updatedAt: new Date() },
        { code: '4', name: 'Kewajiban Jangka Panjang', type: 'liability', createdAt: new Date(), updatedAt: new Date() },
        { code: '5', name: 'Ekuitas', type: 'equity', createdAt: new Date(), updatedAt: new Date() },
        { code: '6', name: 'Pendapatan', type: 'revenue', createdAt: new Date(), updatedAt: new Date() },
        { code: '7', name: 'Harga Pokok Penjualan', type: 'expense', createdAt: new Date(), updatedAt: new Date() },
        { code: '8', name: 'Beban Operasional', type: 'expense', createdAt: new Date(), updatedAt: new Date() }
      ];
      
      for (const category of categories) {
        await db.add(db.STORES.ACCOUNT_CATEGORIES, category);
      }
    }
    
    // Check if accounts already exist
    const existingAccounts = await db.getAll(db.STORES.ACCOUNTS);
    
    if (existingAccounts.length === 0) {
      const accounts = [
        { code: '1101', name: 'Kas', categoryId: 1, normalBalance: 'debit', description: 'Kas tersedia', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { code: '1102', name: 'Bank', categoryId: 1, normalBalance: 'debit', description: 'Kas di bank', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { code: '1103', name: 'Piutang Usaha', categoryId: 1, normalBalance: 'debit', description: 'Piutang dari pelanggan', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { code: '1104', name: 'Persediaan Bahan Baku', categoryId: 1, normalBalance: 'debit', description: 'Persediaan bahan baku', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { code: '1105', name: 'Persediaan Barang Dalam Proses', categoryId: 1, normalBalance: 'debit', description: 'Persediaan barang dalam proses produksi', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { code: '1106', name: 'Persediaan Barang Jadi', categoryId: 1, normalBalance: 'debit', description: 'Persediaan barang jadi siap dijual', isActive: true, createdAt: new Date(), updatedAt: new Date() }
        // Add more accounts as needed
      ];
      
      for (const account of accounts) {
        await db.add(db.STORES.ACCOUNTS, account);
      }
    }
    
    // Seed other initial data as needed
    
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
};