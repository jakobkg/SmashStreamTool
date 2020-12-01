import { MainView } from '@components/MainView';
import '@public/style.css';
import { ipcRenderer } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'typeface-poppins';

ReactDOM.render(
    <MainView />,
  document.getElementById('root')
);
