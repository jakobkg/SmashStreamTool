import * as OBSWebSocket from 'obs-websocket-js';

export type ObsSceneList = {
  messageId: string;
  status: 'ok';
  'current-scene': string;
  scenes: OBSWebSocket.Scene[];
};
