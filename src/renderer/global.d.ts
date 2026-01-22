export interface ElectronAPI {
  getVehicles: () => Promise<any[]>;
  addVehicle: (vehicle: any) => Promise<any>;
  getTrips: () => Promise<any[]>;
  addTrip: (trip: any) => Promise<any>;
  getDieselLogs: () => Promise<any[]>;
  addDieselLog: (log: any) => Promise<any>;
  getTransactions: () => Promise<any[]>;
  addTransaction: (txn: any) => Promise<any>;
  getParts: () => Promise<any[]>;
  addPart: (part: any) => Promise<any>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};