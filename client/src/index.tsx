import { ToastProvider } from 'react-toast-notifications'
import ReactDOM from 'react-dom'
import { Provider, teamsTheme } from '@fluentui/react-northstar'
import './index.css'
import App from './App'
import socket from './config/socket'
import AuthContextProvider from './context/Auth'
import NotificationListener from './components/Notification'

socket.connect()
socket.emit('hello', 'Client this side.')

ReactDOM.render(
  <Provider theme={teamsTheme}>
    <ToastProvider
      autoDismiss
      autoDismissTimeout={6000}
      placement="bottom-center"
    >
        <AuthContextProvider>
            <NotificationListener>
              <App />
          </NotificationListener>
        </AuthContextProvider>
    </ToastProvider>
  </Provider>,
  document.getElementById('root')
)
