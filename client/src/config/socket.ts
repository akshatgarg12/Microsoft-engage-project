import { io } from 'socket.io-client'
import { SERVER_URL, __prod__, SOCKET_PATH } from '../constants'
const socket = io(SERVER_URL, {
  path: SOCKET_PATH,
  autoConnect: false,
  withCredentials: true
})
// only in dev env
socket.on('unauthorized', (args) => {
  console.log('Unauthorized conn not allowed')
})

if (!__prod__) {
  socket.onAny((event, ...args) => {
    console.log(event, args)
  })
}

export default socket
