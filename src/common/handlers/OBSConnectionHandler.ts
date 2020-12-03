import { ConnectionStatus, ObsSceneListResponse, ObsSceneResponse, StreamStatus } from '@common/types';
import * as OBSWebSocket from 'obs-websocket-js';

export class OBSConnectionHandler {
  public OBS: OBSWebSocket;

  private address: string;
  private port: number;
  private swapSuffix: string;
  private swapped: boolean;

  private connectionStatus: ConnectionStatus;
  private streamStatus: StreamStatus;

  constructor(address: string, port: number, swapSuffix?: string) {
    this.address = address;
    this.port = port;
    this.swapped = false;

    if (swapSuffix !== undefined) {
      this.swapSuffix = swapSuffix;
    } else {
      this.swapSuffix = 'swap';
    }

    this.OBS = new OBSWebSocket();
    this.connectionStatus = ConnectionStatus.CONNECTING;

    this.connect();
  }

  /**
   * Try to connect to an OBS websocket using the settings provided
   */
  public connect(): void {
    if (this.connectionStatus !== ConnectionStatus.OPEN) {
      this.connectionStatus = ConnectionStatus.CONNECTING;
      this.OBS.connect({ address: `${this.address}:${this.port.toString()}` }, (connectionError: Error | undefined) => {
        if (connectionError !== undefined) {
          //TODO Notify user of connection failure
          this.connectionStatus = ConnectionStatus.CLOSED;
        }
      })
      .then(() => {
        //OnFulfilled
        //TODO Notify user of connection success
        this.connectionStatus = ConnectionStatus.OPEN;

        this.OBS.on('ConnectionClosed', () => {
          this.OBS.removeAllListeners();
          this.connectionStatus = ConnectionStatus.CLOSED;
        });

        this.OBS.on('StreamStarted', () => {
          this.streamStatus = StreamStatus.ONLINE;
        });

        this.OBS.on('StreamStopped', () => {
          this.streamStatus = StreamStatus.OFFLINE;
        });
      }, () => {
        //OnRejected
        //TODO Notify user of connection failure
        this.connectionStatus = ConnectionStatus.CLOSED;
      });
    }
  }

  /**
   * Tell OBS to change scenes to switch playercam positions, if applicable.
   * Fails silently while doing nothing if swapping cams isn't possible, for example if OBS is unreachable or the current scene doesn't have a camswapped variant
   * A scene is considered "swappable" if it has "{xyz} swap" as its name and a scene named "{xyz}" exists, or vice versa
   */
  public swapCams(): void {
    this.swapped = !this.swapped;
    this.OBS.send('GetCurrentScene')
    .then((currentScene: ObsSceneResponse) => {
      this.changeScene(currentScene.name);
    });
  }

  /**
   * changeScene
   */
  public async changeScene(sceneName: string): Promise<void> {
    const swappedSceneName: string = `${sceneName} ${this.swapSuffix}`;
    const unswappedSceneName: string = sceneName.replace(` ${this.swapSuffix}`, '');

    this.OBS.send('GetSceneList')
    .then((sceneListResponse: ObsSceneListResponse) => {
      let allSceneNames: string[] = [];
      sceneListResponse.scenes.forEach((scene: OBSWebSocket.Scene) => {
        allSceneNames = [...allSceneNames, scene.name];
      });

      if (this.swapped && allSceneNames.includes(swappedSceneName)) {
        this.OBS.send('SetCurrentScene', {'scene-name': swappedSceneName});
      } else if (!this.swapped && allSceneNames.includes(unswappedSceneName)) {
        this.OBS.send('SetCurrentScene', {'scene-name': unswappedSceneName});
      } else if (sceneName !== sceneListResponse['current-scene']) {
        this.OBS.send('SetCurrentScene', {'scene-name': sceneName});
      }
    });
  }

  public async updateWebSource(sourceName: string, sourceSettings: { width?: number; height?: number; url?: string; css?: string }): Promise<void> {
    this.OBS.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: sourceSettings});
  }

  public async updateTextSource(obs: OBSWebSocket, sourceName: string, contents: string): Promise<void> {
    obs.send('SetSourceSettings', { sourceName: sourceName, sourceSettings: { text: contents } });
  }

  /**
   * Check if a connection to an OBS websocket is open
   */
  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.OPEN;
  }

  /**
   * Check if the stream of the currently connected OBS instance is streaming live.
   * Returns false if the OBS websocket connection is not currently open
   */
  public isLive(): boolean {
    return (this.streamStatus === StreamStatus.ONLINE) && (this.isConnected());
  }
}
