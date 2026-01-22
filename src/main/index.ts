import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { initializeDatabase } from './database';
import { registerIpcHandlers } from './ipc';

let mainWindow: BrowserWindow | null = null;

// src/main/index.ts

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'), 
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: "Fleet Manager Pro"
  });

  // UPDATE THIS LINE:
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  initializeDatabase();
  registerIpcHandlers();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});