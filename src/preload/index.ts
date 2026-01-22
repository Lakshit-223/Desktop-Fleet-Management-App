import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Vehicles
  getVehicles: () => ipcRenderer.invoke('get-vehicles'),
  addVehicle: (vehicle: any) => ipcRenderer.invoke('add-vehicle', vehicle),
  
  // Trips
  getTrips: () => ipcRenderer.invoke('get-trips'),
  addTrip: (trip: any) => ipcRenderer.invoke('add-trip', trip),

  // Diesel
  getDieselLogs: () => ipcRenderer.invoke('get-diesel-logs'),
  addDieselLog: (log: any) => ipcRenderer.invoke('add-diesel-log', log),

  // Transactions
  getTransactions: () => ipcRenderer.invoke('get-transactions'),
  addTransaction: (txn: any) => ipcRenderer.invoke('add-transaction', txn),

  // Spare Parts
  getParts: () => ipcRenderer.invoke('get-parts'),
  addPart: (part: any) => ipcRenderer.invoke('add-part', part),
});