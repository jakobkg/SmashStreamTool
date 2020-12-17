import { ipcRenderer } from 'electron';
import * as React from 'react';

type SceneButtonProps = { sceneName: string };

export class SceneButton extends React.Component<SceneButtonProps> {
  constructor(props: SceneButtonProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public render(): JSX.Element {
    return (
      <button onClick={this.handleClick}>
        {this.props.sceneName}
      </button>
    );
  }

  private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    ipcRenderer.send('OBS_SCENE', this.props.sceneName);
  }
}
