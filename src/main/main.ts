import { OBSConnectionHandler } from '@common/handlers/OBSConnectionHandler';
import { SlippiConnectionHandler } from '@common/handlers/SlippiConnectionHandler';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow | null;

// Websocket connection settings for Slippi
//TODO these should be part of application settings
const SLIPPIADDRESS: string = 'localhost';
const SLIPPIPORT: number = 53742;

// Websocket connection settings for OBS
//TODO these should be part of application settings
const OBSADDRESS: string = 'localhost';
const OBSPORT: number = 4444;

const obsConnection: OBSConnectionHandler = new OBSConnectionHandler(OBSADDRESS, OBSPORT);

const slippiConnection: SlippiConnectionHandler = new SlippiConnectionHandler(SLIPPIADDRESS, SLIPPIPORT);

// Set Electron window settings
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 220,
    webPreferences: {
      webSecurity: false,
      devTools: process.env.NODE_ENV !== 'production',
      nodeIntegration: true
    }
  });

  if (process.env.NODE_ENV !== 'development') {
    mainWindow.removeMenu();
  }

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, './index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron listeners
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('OBS_SWAPCAMS', (event: Electron.IpcMainEvent) => {
  obsConnection.swapCams();
});

ipcMain.on('OBS_RETRY', (event: Electron.IpcMainEvent) => {
  obsConnection.connect();
});
