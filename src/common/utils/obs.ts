import * as OBSWebSocket from 'obs-websocket-js';

export async function updateTextSource(obs: OBSWebSocket, sourceName: string, contents: string): Promise<boolean> {
  return obs.send('SetSourceSettings', { sourceName: sourceName, sourceSettings: { text: contents } })
  .then(() => {
    return true;
  })
  .catch(() => {
    return false;
  });
}

export async function updateWebSource(obs: OBSWebSocket, sourceName: string, sourceSettings: { width?: number; height?: number; url?: string; css?: string }): Promise<boolean> {
  return obs.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: sourceSettings})
  .then(() => {
    return true;
  })
  .catch(() => {
    return false;
  });
}
