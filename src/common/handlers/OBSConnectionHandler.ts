import { ConnectionStatus } from '@common/types/ConnectionStatus';
import { StreamStatus } from '@common/types/StreamStatus';
import * as OBSWebSocket from 'obs-websocket-js';

export class OBSConnectionHandler {
  private address: string;
  private port: number;
  private fullAddress: string;
  private OBS: OBSWebSocket;
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

  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.OPEN;
  }

  public isLive(): boolean {
    return this.streamStatus === StreamStatus.ONLINE;
  }
}
