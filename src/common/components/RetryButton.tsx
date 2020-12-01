import * as React from 'react';
import { ipcRenderer } from 'electron';


export default function RetryButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    ipcRenderer.send('OBSRETRY');
  };

  return (
    <div>
      <button onClick={handleClick}>
        Retry OBS connection
      </button>
    </div>
  );
}