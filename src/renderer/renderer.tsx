import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IpcRenderer } from "electron";
import '@public/style.css';
import 'typeface-poppins';

ReactDOM.render(
  <div className='app'>
    <h1>aeiou, but in Poppins</h1>
  </div>,
  document.getElementById('app')
);
