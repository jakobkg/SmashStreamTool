import { ipcRenderer } from 'electron';
import * as React from 'react';

type RetryButtonProps = {};
type RetryButtonState = {};

export class RetryButton extends React.Component {
  constructor(props: RetryButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public render(): JSX.Element {
    return (
    <div>
      <button onClick={this.handleClick}>
        Retry OBS connection
      </button>
    </div>
    );
  }

  private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    ipcRenderer.send('OBSRETRY');
  }
}
