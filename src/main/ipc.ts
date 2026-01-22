import { ipcMain } from 'electron';
import * as db from './database';

export function registerIpcHandlers() {
  // --- VEHICLES ---
  ipcMain.handle('get-vehicles', () => {
    return db.dbAll('SELECT * FROM vehicles ORDER BY id DESC');
  });

  ipcMain.handle('add-vehicle', (event, vehicle) => {
    const sql = `
      INSERT INTO vehicles (name, plate_number, model, purchase_date)
      VALUES (?, ?, ?, ?)
    `;
    return db.dbRun(sql, [
      vehicle.name, 
      vehicle.plateNumber, 
      vehicle.model, 
      vehicle.purchaseDate
    ]);
  });

  // --- TRIPS ---
  ipcMain.handle('get-trips', () => {
    const sql = `
      SELECT t.*, v.name as vehicle_name, v.plate_number 
      FROM trips t 
      JOIN vehicles v ON t.vehicle_id = v.id 
      ORDER BY t.date DESC
    `;
    return db.dbAll(sql);
  });

  ipcMain.handle('add-trip', (event, trip) => {
    const sql = `
      INSERT INTO trips (vehicle_id, date, origin, destination, purpose, distance_km)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return db.dbRun(sql, [
      trip.vehicleId, 
      trip.date, 
      trip.origin, 
      trip.destination, 
      trip.purpose, 
      trip.distance
    ]);
  });

  // --- DIESEL ---
  ipcMain.handle('get-diesel-logs', () => {
    const sql = `
      SELECT d.*, v.name as vehicle_name, v.plate_number 
      FROM diesel_logs d 
      JOIN vehicles v ON d.vehicle_id = v.id 
      ORDER BY d.date DESC
    `;
    return db.dbAll(sql);
  });

  ipcMain.handle('add-diesel-log', (event, log) => {
    const sql = `
      INSERT INTO diesel_logs (vehicle_id, date, liters, cost_per_liter, total_cost, station_name, odometer_reading)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return db.dbRun(sql, [
      log.vehicleId, 
      log.date, 
      log.liters, 
      log.costPerLiter, 
      log.totalCost, 
      log.stationName, 
      log.odometer
    ]);
  });

  // --- TRANSACTIONS (Cashbook/Online) ---
  ipcMain.handle('get-transactions', () => {
    return db.dbAll('SELECT * FROM transactions ORDER BY date DESC');
  });

  ipcMain.handle('add-transaction', (event, txn) => {
    const sql = `
      INSERT INTO transactions (date, type, category, amount, payment_mode, description, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return db.dbRun(sql, [
      txn.date, 
      txn.type, 
      txn.category, 
      txn.amount, 
      txn.paymentMode, 
      txn.description, 
      txn.referenceId
    ]);
  });
  
  // --- SPARE PARTS ---
  ipcMain.handle('get-parts', () => {
     return db.dbAll('SELECT * FROM spare_parts');
  });

  ipcMain.handle('add-part', (event, part) => {
    const sql = `
      INSERT INTO spare_parts (name, part_number, quantity, cost_price, min_stock_level)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.dbRun(sql, [
      part.name, 
      part.partNumber, 
      part.quantity, 
      part.costPrice, 
      part.minStockLevel
    ]);
  });
}