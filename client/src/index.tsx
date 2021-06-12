import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, teamsTheme } from '@fluentui/react-northstar'
import './index.css';
import App from './App';
import socket from './config/socket'

socket.connect()
socket.emit('hello', 'Client this side.')

ReactDOM.render(
  <Provider theme={teamsTheme}>
    <App />
  </Provider>,
  document.getElementById('root')
);
