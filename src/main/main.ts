import { app, BrowserWindow, IpcMain } from 'electron';
import { SlpLiveStream, SlpRealTime, getCharacterName, getCharacterColorName } from '@vinceau/slp-realtime';
import * as OBSWebSocket from 'obs-websocket-js';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow | null;

// Websocket connection settings for Slippi
const SLIPPIADDRESS = 'localhost';
const SLIPPIPORT = 53742;

// Websocket connection settings for OBS
const OBSADDRESS = 'localhost';
const OBSPORT = 4444;

// Initialize Slippi relay instance
const livestream = new SlpLiveStream();
const realtime = new SlpRealTime();
realtime.setStream(livestream);

// Initialize OBS websocket instance
const obs = new OBSWebSocket();


// Connect to the Slippi relay
livestream.start(SLIPPIADDRESS, SLIPPIPORT)
  .then(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Connecting to Slippi Relay');
    }
  }).catch(() => {
    return
  });

// Connect to the OBS websocket
obs.connect({ address: OBSADDRESS + ':' + OBSPORT })
  .catch(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Could not connect to OBS websocket');
    }
});

obs.on('ConnectionOpened', () => {
  if (process.env.NODE_ENV != 'production'){
    console.log('Connected to OBS websocket');
  }
});

// Set Electron window settings
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 220,
    webPreferences: {
      webSecurity: false,
      devTools: process.env.NODE_ENV === 'production' ? false : true
    }
  });

  mainWindow.removeMenu();

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

// Slippi listeners
realtime.game.start$.subscribe( (slippiData) => {
  //TODO: Hent karakterer, skins og ports og send til overlay
});

realtime.game.end$.subscribe( (slippiData) => {
  //TODO: Se hvem som vant, oppdater score
});
