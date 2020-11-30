import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { ipcRenderer } from 'electron';


export default function SettingsButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
    </div>
  );
}