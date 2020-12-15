import * as OBSWebSocket from 'obs-websocket-js';

export type ObsSceneResponse = {
  messageId: string;
  status: 'ok';
  name: string;
  sources: OBSWebSocket.SceneItem[];
};
