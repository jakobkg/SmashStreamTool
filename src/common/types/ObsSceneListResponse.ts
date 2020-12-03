import * as OBSWebSocket from 'obs-websocket-js';

export type ObsSceneListResponse = {
  messageId: string;
  status: 'ok';
  'current-scene': string;
  scenes: OBSWebSocket.Scene[];
};
