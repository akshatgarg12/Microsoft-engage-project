import http from 'http'
import express from 'express'
import {Request, Response} from 'express'
import {Server} from 'socket.io'
import cors from 'cors'
import { config } from "dotenv"
import {__prod__} from './constants'
import DatabaseConnection from './config/mongodb'
const app = express()
const PORT = Number(process.env.PORT) || 8080
const server = http.createServer(app)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
config()

app.use(cors());

app.get('/', (req:Request, res:Response) => {
  res.send("Hello World")
})

const io = new Server({
  path : '/'
})
io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true,
    cors:{
      origin:'*'
    }
});


let usersOfRoom:any = {}
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log(usersOfRoom)
    // save the info in a database.
    if(usersOfRoom[roomId]){
      usersOfRoom[roomId].push(userId)
    }else{
      usersOfRoom[roomId] = [userId]
    }
    // room id and active users
    socket.emit('all-users', usersOfRoom[roomId])
    // whenever this event is emitted , send user details to connect at client
    socket.emit('user-connected', userId)
    // send a all-users list for the person connected so that they can connect with everyone else
    // if disconnected send the signal to destroy this peer connection
    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  
  })
})

const serverStart = async () => {
  try{
    await DatabaseConnection()
    server.listen(PORT, () => {
      console.log(`server running at port:${PORT}`)
    })
    
  }catch(e){
    console.error(e)
  }
}

serverStart()