import * as React from 'react';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import { ipcRenderer } from 'electron';


export default function RetryButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    ipcRenderer.send('OBSRETRY');
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <ReplayIcon />
      </Button>
    </div>
  );
}