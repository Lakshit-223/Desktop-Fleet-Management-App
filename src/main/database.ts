import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Get the user data path for Windows
const dbPath = path.join(app.getPath('userData'), 'fleet.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

function ensureVehicleColumns() {
  const existingColumns = db.prepare(`PRAGMA table_info(vehicles)`).all() as Array<{ name: string }>;
  const columnNames = new Set(existingColumns.map(column => column.name));

  const columnsToAdd = [
    ['vehicle_code', 'TEXT'],
    ['borrower_name', 'TEXT'],
    ['loan_number', 'TEXT'],
    ['bank_name', 'TEXT'],
    ['scan_document', 'TEXT'],
    ['in_name', 'TEXT'],
    ['yard_name', 'TEXT'],
    ['entry_date', 'TEXT'],
    ['original_document', 'TEXT'],
    ['confirm_by', 'TEXT'],
    ['payment_status', "TEXT DEFAULT 'pending'"],
    ['mailed', "TEXT DEFAULT 'no'"],
    ['remarks', 'TEXT']
  ] as const;

  for (const [columnName, columnDefinition] of columnsToAdd) {
    if (!columnNames.has(columnName)) {
      db.exec(`ALTER TABLE vehicles ADD COLUMN ${columnName} ${columnDefinition}`);
    }
  }
}

export function initializeDatabase() {
  // 1. Vehicles Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_code TEXT,
      name TEXT NOT NULL,
      borrower_name TEXT,
      loan_number TEXT,
      bank_name TEXT,
      plate_number TEXT UNIQUE NOT NULL,
      model TEXT,
      scan_document TEXT,
      in_name TEXT,
      yard_name TEXT,
      purchase_date TEXT,
      entry_date TEXT,
      original_document TEXT,
      confirm_by TEXT,
      payment_status TEXT DEFAULT 'pending',
      mailed TEXT DEFAULT 'no',
      remarks TEXT,
      status TEXT DEFAULT 'active'
    )
  `);

  ensureVehicleColumns();

  // 2. Trips Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      date TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      purpose TEXT,
      distance_km REAL,
      status TEXT DEFAULT 'completed',
      FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
    )
  `);

  // 3. Diesel/Fuel Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS diesel_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      date TEXT NOT NULL,
      liters REAL NOT NULL,
      cost_per_liter REAL NOT NULL,
      total_cost REAL NOT NULL,
      station_name TEXT,
      odometer_reading REAL,
      FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
    )
  `);

  // 4. Spare Parts Table (Inventory + Usage)
  db.exec(`
    CREATE TABLE IF NOT EXISTS spare_parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      part_number TEXT,
      quantity INTEGER DEFAULT 0,
      cost_price REAL,
      min_stock_level INTEGER DEFAULT 5
    )
  `);

  // 5. Maintenance/Parts Usage Log
  db.exec(`
    CREATE TABLE IF NOT EXISTS maintenance_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      part_id INTEGER,
      date TEXT NOT NULL,
      description TEXT,
      labor_cost REAL DEFAULT 0,
      FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
      FOREIGN KEY(part_id) REFERENCES spare_parts(id)
    )
  `);

  // 6. Transactions Table (Cashbook + Online)
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL, -- 'income' or 'expense'
      category TEXT NOT NULL, -- 'diesel', 'parts', 'salary', 'trip_income', etc.
      amount REAL NOT NULL,
      payment_mode TEXT NOT NULL, -- 'cash', 'online', 'bank_transfer'
      description TEXT,
      reference_id TEXT -- For invoice/receipt numbers
    )
  `);

  console.log('Database initialized at:', dbPath);
}

// --- Generic CRUD Helpers ---

// Inside database.ts

export function dbRun(sql: string, params: any[] = []) {
  return db.prepare(sql).run(params);
}

export function dbAll<T = any>(sql: string, params: any[] = []): T[] {
  return db.prepare(sql).all(params) as T[];
}

export function dbGet<T = any>(sql: string, params: any[] = []): T | undefined {
  return db.prepare(sql).get(params) as T;
}

export default db;