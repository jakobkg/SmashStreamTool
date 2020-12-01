import { CamSwapButton } from '@components/CamSwapButton';
import { RetryButton } from '@components/RetryButton';
import * as React from 'react';

export class MainView extends React.Component {
  public render(): JSX.Element {
    return (
    <div>
      <CamSwapButton />
      <RetryButton />
    </div>);
  }
}
