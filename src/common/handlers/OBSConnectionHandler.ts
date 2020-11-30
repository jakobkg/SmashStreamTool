import * as OBSWebSocket from 'obs-websocket-js';
import { StreamStatus } from '@common/types/StreamStatus';
import { ConnectionStatus } from '@common/types/ConnectionStatus';


class OBSConnectionHandler {
  address: string;
  port: number;
  fullAddress: string;
  OBS: OBSWebSocket;
  connectionStatus: ConnectionStatus;
  streamStatus: StreamStatus;

  constructor(address: string, port: number) {
    this.address = address;
    this.port = port;
    this.fullAddress = address + ':' + port.toString();
    this.OBS = new OBSWebSocket();
    this.connectionStatus = ConnectionStatus.CONNECTING;

    this.connect();
  }

  connect(): void {
    if (this.connectionStatus != ConnectionStatus.OPEN) {
      this.connectionStatus = ConnectionStatus.CONNECTING;
      this.OBS.connect({ address: this.fullAddress }, (connectionError) => {
        if (connectionError) {
          //TODO Notify user of connection failure
          this.connectionStatus = ConnectionStatus.CLOSED;
        }
      })
      .then( () => {
        //OnFulfilled
        //TODO Notify user of connection success
        this.connectionStatus = ConnectionStatus.OPEN;

        this.OBS.on("ConnectionClosed", () => {
          this.OBS.removeAllListeners();
          this.connectionStatus = ConnectionStatus.CLOSED;
        });

        this.OBS.on("StreamStarted", () => {
          this.streamStatus = StreamStatus.ONLINE;
        });

        this.OBS.on("StreamStopped", () => {
          this.streamStatus = StreamStatus.OFFLINE;
        });
      }, () => {
        //OnRejected
        //TODO Notify user of connection failure
        this.connectionStatus = ConnectionStatus.CLOSED;
      });
    }
  }

  isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.OPEN;
  }

  isLive(): boolean {
    return this.streamStatus === StreamStatus.ONLINE;
  }
}

export default OBSConnectionHandler;