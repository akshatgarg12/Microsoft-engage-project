import {io} from 'socket.io-client'
import {SERVER_URL, __prod__, SOCKET_PATH} from '../constants'

const socket = io(SERVER_URL, {
    path : SOCKET_PATH,
    autoConnect:false,
})
// only in dev env
if(!__prod__){
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });    
}

export default socket