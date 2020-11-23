import * as OBSWebSocket from 'obs-websocket-js';
import { stringify, parse } from 'querystring';

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

export function updateBracketView(obs: OBSWebSocket, bracketSourceName: string, bracketLink?: string, settings?: {multiplier?: number, match_width_multiplier?: number, show_tournament_name?: number}): void {
  let assembledUrl: string;
  let baseUrl: string;
  let querystring: string;

  if (!bracketLink && !settings) {
    if (process.env.NODE_ENV != 'production'){
      console.log('Invalid call to updateBracketView(), no link or settings provided');
    }
    return;
  }

  if (!bracketLink) {
    obs.sendCallback('GetSourceSettings', { sourceName: bracketSourceName }, (err, data)=> {
      //TODO Get base url from current settings
      updateWebSource(obs, bracketSourceName, {url: assembledUrl});
    });
  } else if (!settings) {
    obs.sendCallback('GetSourceSettings', { sourceName: bracketSourceName }, (err, data)=> {
      //TODO Get querystring from current settings
      updateWebSource(obs, bracketSourceName, {url: assembledUrl});
    });
  } else {
    assembledUrl = bracketLink + '/module?' + stringify(settings);
    updateWebSource(obs, bracketSourceName, {url: assembledUrl});
  }
}
