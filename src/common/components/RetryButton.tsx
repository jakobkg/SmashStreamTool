import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import { ipcRenderer } from 'electron';


export default function RetryButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    ipcRenderer.send('OBSRETRY');
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <ReplayIcon />
      </IconButton>
    </div>
  );
}