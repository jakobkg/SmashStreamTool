import { ConnectionStatus } from '@common/types/ConnectionStatus';
import { GameEndType, GameStartType, SlpLiveStream, SlpRealTime } from '@vinceau/slp-realtime';

export class SlippiConnectionHandler {
  private address: string;
  private port: number;
  private datastream: SlpLiveStream;
  private slippi: SlpRealTime;
  private connectionStatus: ConnectionStatus;

  constructor(address: string, port: number) {
    this.address = address;
    this.port = port;

    this.datastream = new SlpLiveStream();
    this.slippi = new SlpRealTime();

    this.slippi.setStream(this.datastream);
    this.datastream.start(address, port)
    .then(() => {
      //OnFulfilled
      this.connectionStatus = ConnectionStatus.OPEN;

      this.datastream.on('close', () => {
        this.datastream.removeAllListeners();
      });

      this.slippi.game.start$.subscribe((gameStart: GameStartType) => {
        //TODO do things outside of this class when this is emitted
        //OBS transition and stuff
      });

      this.slippi.game.end$.subscribe((gameEnd: GameEndType) => {
        //TODO do things outside of this class when this is emitted
        //determine winner (no LRAS please) and update scores
      });
    }, () => {
      //OnRejected
      this.connectionStatus = ConnectionStatus.CLOSED;
    });
  }
}
