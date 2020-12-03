import { CamSwapButton, RetryButton, SceneButton } from '@common/components';
import * as React from 'react';

export class MainView extends React.Component {
  public render(): JSX.Element {
    return (
    <div>
      <CamSwapButton />
      <RetryButton />
      <SceneButton sceneName='Scene 1' />
      <SceneButton sceneName='cams' />
    </div>);
  }
}
