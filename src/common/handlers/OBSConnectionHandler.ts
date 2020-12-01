import { ConnectionStatus } from '@common/types/ConnectionStatus';
import { StreamStatus } from '@common/types/StreamStatus';
import * as OBSWebSocket from 'obs-websocket-js';

export class OBSConnectionHandler {
  private address: string;
  private port: number;
  private fullAddress: string;
  public OBS: OBSWebSocket;
  private connectionStatus: ConnectionStatus;
  private streamStatus: StreamStatus;

  constructor(address: string, port: number) {
    this.address = address;
    this.port = port;
    this.fullAddress = `${address}:${port.toString()}`;
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
      this.OBS.connect({ address: this.fullAddress }, (connectionError: Error | undefined) => {
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
    this.OBS.sendCallback('GetSceneList', (errorResponse, sceneListResponse) => {
      if (sceneListResponse !== undefined) {
        let currentSceneName: string = sceneListResponse['current-scene'];
        sceneListResponse['scenes'].forEach((scene) => {
          if ((currentSceneName === `${scene.name} swap`) || (`${currentSceneName} swap` === scene.name)) {
            this.OBS.send('SetCurrentScene', {'scene-name': scene.name});
          }
        });
      }
    });
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
