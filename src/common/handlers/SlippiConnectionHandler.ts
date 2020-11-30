import { SlpLiveStream, SlpRealTime } from '@vinceau/slp-realtime';
import { ConnectionStatus } from '@common/types/ConnectionStatus';

class SlippiConnectionHandler {
  address: string;
  port: number;
  fullAddress: string;
  datastream: SlpLiveStream;
  realtime: SlpRealTime;
  connectionStatus: ConnectionStatus;


  constructor(address: string, port: number) {
    this.address = address;
    this.port = port;
    this.fullAddress = address + ':' + port.toString();

    this.datastream = new SlpLiveStream();
    this.realtime = new SlpRealTime();

    this.realtime.setStream(this.datastream);
    this.datastream.start(address, port)
    .then(() => {
      //OnFulfilled
      this.connectionStatus = ConnectionStatus.OPEN;

      this.datastream.on("close", () => {
        this.datastream.removeAllListeners();
      });

      this.realtime.game.start$.subscribe((gameStart) => {
        //TODO do things outside of this class when this is emitted
        //OBS transition and stuff
      });

      this.realtime.game.end$.subscribe((gameEnd) => {
        //TODO do things outside of this class when this is emitted
        //determine winner (no LRAS please) and update scores
      });
    }, () => {
      //OnRejected
      this.connectionStatus = ConnectionStatus.CLOSED;
    })
  }
}

export default SlippiConnectionHandler;