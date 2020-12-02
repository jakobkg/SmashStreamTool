import { CamSwapButton } from '@components/CamSwapButton';
import { RetryButton } from '@components/RetryButton';
import { SceneButton } from "@components/SceneButton";
import * as React from 'react';

export class MainView extends React.Component {
  public render(): JSX.Element {
    return (
    <div>
      <CamSwapButton />
      <RetryButton />
      <SceneButton sceneName='Scene 1' />
      <SceneButton sceneName='Scene 2' />
    </div>);
  }
}
