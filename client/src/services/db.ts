// client/src/services/db.ts

/**
 * Simple relational‑like storage using browser localStorage.
 * All tables are stored as JSON strings under the key `snailRacesDB`.
 * The structure is an object where each property is a table name mapping to an array of records.
 */

type TableName =
  | 'user'
  | 'currentSession'
  | 'charges'
  | 'transactions'
  | 'currency'
  | 'transactions_charges';

interface DBStructure {
  user: UserRecord[];
  currentSession: SessionRecord | null;
  charges: ChargeRecord[];
  transactions: TransactionRecord[];
  currency: CurrencyRecord[];
  transactions_charges: TransactionChargeRecord[];
}

// Record definitions matching the specification
export interface UserRecord {
  idUser: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  balance: number;
  createdDate: string;
}

export interface SessionRecord {
  idSession: string;
  createdDate: string;
  browser: string;
  ip: string;
}

export interface ChargeRecord {
  idCharge: string;
  idUser: string;
  status: string;
  statusDetail: string;
  transactionAmount: number;
  card: string;
  cvv: string;
  authorizationCode: string;
  reference: string;
  createdDate: string;
}

export interface TransactionRecord {
  idTransactions: string;
  idUser: string;
  amount: number;
  transactionType: string;
  idCurrency: string;
  createdDate: string;
}

export interface CurrencyRecord {
  idCurrency: string;
  currency: string;
  exchange: number;
  isActive: number;
  createdDate: string;
}

export interface TransactionChargeRecord {
  idTransactions: string;
  idCharges: string;
  createdDate: string;
}

const STORAGE_KEY = 'snailRacesDB';

function getDB(): DBStructure {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as DBStructure;
    } catch {
      // If parsing fails, reset DB
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  // Initialize fresh DB with default currency rows
  const initial: DBStructure = {
    user: [],
    currentSession: null,
    charges: [],
    transactions: [],
    currency: [
      {
        idCurrency: '0',
        currency: 'mx',
        exchange: 1,
        isActive: 1,
        createdDate: '28-09-2026',
      },
      {
        idCurrency: '1',
        currency: 'usd',
        exchange: 20,
        isActive: 1,
        createdDate: '28-09-2026',
      },
    ],
    transactions_charges: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function setDB(db: DBStructure) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

/** CRUD helpers */
export const db = {
  // Create a new record in a table. If the record does not contain an ID, one is generated (UUID).
  create<T extends Partial<Record<string, any>>>(table: TableName, record: T): T & { id: string } {
    const dbData = getDB();
    const idField = Object.keys(record).find((k) => k.toLowerCase().includes('id')) || 'id';
    const id = (record as any)[idField] ?? crypto.randomUUID();
    const newRecord = { ...(record as any), [idField]: id };
    // @ts-ignore – dynamic table access
    (dbData as any)[table].push(newRecord);
    setDB(dbData);
    return newRecord as any;
  },

  readAll<T>(table: TableName): T[] {
    const dbData = getDB();
    // @ts-ignore
    return (dbData as any)[table] as T[];
  },

  findById<T>(table: TableName, id: string): T | undefined {
    const all = db.readAll<T>(table);
    return all.find((rec: any) => Object.values(rec).some((v) => v === id));
  },

  update<T>(table: TableName, id: string, updates: Partial<T>) {
    const dbData = getDB();
    // @ts-ignore
    const records = (dbData as any)[table] as T[];
    const idx = records.findIndex((r: any) => Object.values(r).some((v) => v === id));
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...updates } as T;
      setDB(dbData);
    }
  },

  delete(table: TableName, id: string) {
    const dbData = getDB();
    // @ts-ignore
    const records = (dbData as any)[table] as any[];
    const filtered = records.filter((r) => !Object.values(r).some((v) => v === id));
    // @ts-ignore
    (dbData as any)[table] = filtered;
    setDB(dbData);
  },

  // Helper to link a transaction with a charge
  linkTransactionCharge(transactionId: string, chargeId: string) {
    const dbData = getDB();
    dbData.transactions_charges.push({
      idTransactions: transactionId,
      idCharges: chargeId,
      createdDate: new Date().toISOString(),
    });
    setDB(dbData);
  },
};

/** Utility to get the current session (or null) */
export function getCurrentSession(): SessionRecord | null {
  return getDB().currentSession;
}

/** Set or clear the current session */
export function setCurrentSession(session: SessionRecord | null) {
  const dbData = getDB();
  dbData.currentSession = session;
  setDB(dbData);
}
