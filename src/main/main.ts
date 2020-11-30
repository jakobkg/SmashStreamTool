import { app, BrowserWindow, ipcMain, IpcMain } from 'electron';
import { SlpLiveStream, SlpRealTime, getCharacterName, getCharacterColorName } from '@vinceau/slp-realtime';
import OBSConnectionHandler from '@common/handlers/OBSConnectionHandler';
import SlippiConnectionHandler from '@common/handlers/SlippiConnectionHandler';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow | null;

// Websocket connection settings for Slippi
const SLIPPIADDRESS = 'localhost';
const SLIPPIPORT = 53742;

// Websocket connection settings for OBS
const OBSADDRESS = 'localhost';
const OBSPORT = 4444;

const OBSConnection = new OBSConnectionHandler(OBSADDRESS, OBSPORT);

const SlippiConnection = new SlippiConnectionHandler(SLIPPIADDRESS, SLIPPIPORT);

// Set Electron window settings
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 220,
    webPreferences: {
      webSecurity: false,
      devTools: !(process.env.NODE_ENV === 'production'),
      nodeIntegration: true
    }
  });

  //mainWindow.removeMenu();

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

ipcMain.on('OBSRETRY', (event) => {
  OBSConnection.connect();
});
