/**
 * OBS connection handler module
 * Contains a class with various neat wrappers for OBS websocket functionality
 */
import { ConnectionStatus, ObsSceneListResponse, ObsSceneResponse, StreamStatus } from '@common/types';
import * as OBSWebSocket from 'obs-websocket-js';

/**
 * OBSConnectionHandler
 * Class wrapping OBSWebSocket and some of its methods to keep clutter out of main app logic
 */
export class OBSConnectionHandler {
  private OBS: OBSWebSocket;
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

    this.connect()
    .then(() => {
      return;
    })
    .catch(() => {
      throw new Error("Could not connect to OBS websocket");
      
    })
  }

  /**
   * connect()
   * Try to connect to an OBS websocket using the settings provided to the constructor
   * Returns true if connection was opened, false if connection failed to open
   */
  public async connect(): Promise<boolean> {
    if (this.connectionStatus !== ConnectionStatus.OPEN) {
      this.connectionStatus = ConnectionStatus.CONNECTING;
      
      return this.OBS.connect({ address: `${this.address}:${this.port.toString()}` })
      .then(() => {
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

        return true;
      }, () => {
        this.connectionStatus = ConnectionStatus.CLOSED;

        return false;
      });
    } else {
      return true;
    }
  }

  /**
   * swapCams()
   * Tell OBS to change scenes to switch playercam positions, if applicable.
   * Fails silently while doing nothing if swapping cams isn't possible, for example if OBS is unreachable or the current scene doesn't have a camswapped variant
   * A scene is considered "swappable" if it has "{xyz} swap" as its name and a scene named "{xyz}" exists, or vice versa
   */
  public async swapCams(): Promise<boolean> {
    return this.OBS.send('GetCurrentScene')
    .then(async (currentScene: ObsSceneResponse) => {
      this.swapped = !this.swapped;

      return this.changeScene(currentScene.name)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
    })
    .catch(() => {
      return false;
    });
  }

  /**
   * changeScene()
   * Change scenes, if the string passed is the name of an OBS scene
   * Uses the swapped version of the chosen scene if available, or the non-swapped if not
   */
  public async changeScene(sceneName: string): Promise<void> {
    const swappedSceneName: string = `${sceneName} ${this.swapSuffix}`;
    const unswappedSceneName: string = sceneName.replace(` ${this.swapSuffix}`, '');

    this.getSceneList()
    .then(async (sceneList: string[]) => {
      if (this.swapped && sceneList.includes(swappedSceneName)) {
        return this.OBS.send('SetCurrentScene', {'scene-name': swappedSceneName})
        .then(() => {
          return;
        }, () => {
          return;
        });
      } else if (!this.swapped && sceneList.includes(unswappedSceneName)) {
        return this.OBS.send('SetCurrentScene', {'scene-name': unswappedSceneName})
        .then(() => {
          return;
        }, () => {
          return;
        });
      } else {
        return this.getCurrentScene()
        .then((currentScene: string) => {
          if (currentScene !== sceneName) {
            return this.OBS.send('SetCurrentScene', {'scene-name': sceneName})
            .then(() => {
              return;
            }, () => {
              return;
            });
          }
        })
        .catch(() => {
          return;
        });
      }
    })
    .catch(() => {
      return;
    });
  }

  /**
   * getSceneList()
   * Returns an array of strings with the names of all available OBS scenes
   */
  public async getSceneList(): Promise<string[]> {
    return this.OBS.send('GetSceneList')
    .then((sceneListResponse: ObsSceneListResponse) => {
      let sceneNames: string[] = [];

      sceneListResponse.scenes.forEach((scene: OBSWebSocket.Scene) => {
        sceneNames = [...sceneNames, scene.name];
      });

      return sceneNames;
    })
    .catch(() => {
      return [];
    });
  }

  /**
   * getCurrentScene()
   * Returns a string with the name of the current OBS scene
   */
  public async getCurrentScene(): Promise<string> {
    return this.OBS.send('GetCurrentScene')
    .then((sceneResponse: ObsSceneResponse) => {
      return sceneResponse.name;
    });
  }

  /**
   * updateWebSource()
   * Updates settings of a web source, returns true if update was successful and false otherwise
   * @param sourceName Name of the source to update
   * @param sourceSettings The setting or settings to update. Valid fields: width, height, url, css
   */
  public async updateWebSource(sourceName: string, sourceSettings: { width?: number; height?: number; url?: string; css?: string }): Promise<boolean> {
    return this.OBS.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: sourceSettings})
    .then(() => {
      return true;
    }, () => {
      return false;
    });
  }

  /**
   * updateTextSource()
   * Sends new text content to a given OBS text source
   * @param sourceName Name of the source to update
   * @param contents Text contents to put into the text source
   */
  public async updateTextSource(sourceName: string, contents: string): Promise<boolean> {
    return this.OBS.send('SetSourceSettings', { sourceName: sourceName, sourceSettings: { text: contents } })
    .then(() => {
      return true;
    }, () => {
      return false;
    });
  }

  /**
   * isConnected()
   * Check if a connection to an OBS websocket is open, returns true if so and false otherwise
   */
  public isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.OPEN;
  }

  /**
   * isLive()
   * Check if the stream of the currently connected OBS instance is broadcasting
   * Returns false if the OBS websocket connection is not currently open
   */
  public isLive(): boolean {
    return (this.streamStatus === StreamStatus.ONLINE) && (this.isConnected());
  }
}
