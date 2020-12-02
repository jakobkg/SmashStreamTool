import { ConnectionStatus } from '@common/types/ConnectionStatus';
import { ObsSceneList } from '@common/types/ObsSceneList';
import { StreamStatus } from '@common/types/StreamStatus';
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
    this.OBS.sendCallback('GetSceneList', (errorResponse: Error | OBSWebSocket.ObsError | undefined, sceneListResponse: ObsSceneList | undefined) => {
      if (sceneListResponse !== undefined) {
        const currentSceneName: string = sceneListResponse['current-scene'];
        sceneListResponse.scenes.forEach((scene: OBSWebSocket.Scene) => {
          if ((currentSceneName === `${scene.name} ${this.swapSuffix}`) || (`${currentSceneName} ${this.swapSuffix}` === scene.name)) {
            this.OBS.send('SetCurrentScene', {'scene-name': scene.name});
          }
        });
      }
    });
  }

  /**
   * setScene
   */
  public changeScene(sceneName: string): void {
    this.OBS.send('GetSceneList')
    .then((sceneListResponse) => {
      const currentSceneName: string = sceneListResponse["current-scene"];

      let allSceneNames: string[] = [];

      sceneListResponse.scenes.forEach((scene: OBSWebSocket.Scene) => {
        allSceneNames = [...allSceneNames, scene.name];
      })
      /*
      Okay three cases to handle (I think)
      1) If we've swapped cams and a swapped version of the scene we're changing to exists, use that one
      2) if we've swapped cams and a swapped verion of the view we're changing to does not exist, use the non-swapped version
      3) if we haven't swapped cams, just change to the given scene
      */
    })
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
