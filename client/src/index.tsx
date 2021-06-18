import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, teamsTheme } from '@fluentui/react-northstar'
import './index.css';
import App from './App';
import socket from './config/socket'
import AuthContextProvider from './context/Auth';

socket.connect()
socket.emit('hello', 'Client this side.')

ReactDOM.render(
  <Provider theme={teamsTheme}>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </Provider>,
  document.getElementById('root')
);
