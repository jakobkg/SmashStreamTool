import { ipcRenderer } from 'electron';
import * as React from 'react';

type CamSwapButtonProps = {};

export class CamSwapButton extends React.Component {
  constructor(props: CamSwapButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public render(): JSX.Element {
    return (
    <div>
      <button onClick={this.handleClick}>
        Swap cams
      </button>
    </div>
    );
  }

  private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    ipcRenderer.send('OBS_SWAPCAMS');
  }
}
