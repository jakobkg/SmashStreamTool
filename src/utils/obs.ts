import * as OBSWebSocket from 'obs-websocket-js';
import  * as qs from 'querystring';

export function updateTextSource(obs: OBSWebSocket, sourceName: string, contents: string): void {
  obs.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: {'text': contents}})
  .then(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Updated text source ' + sourceName);
    }
  })
  .catch(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Failed to update text source ' + sourceName);
    }
  });
}

export function updateWebSource(obs: OBSWebSocket, sourceName: string, sourceSettings: { width?: number, height?: number, url?: string, css?: string }): void {
  obs.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: sourceSettings})
  .then(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Updated web source ' + sourceName);
    }
  })
  .catch(() => {
    if (process.env.NODE_ENV != 'production'){
      console.log('Failed to update web source ' + sourceName);
    }
  });
}
