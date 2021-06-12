import http from 'http'
import express from 'express'
import {Request, Response} from 'express'
import {Server} from 'socket.io'
import cors from 'cors'
import { config } from "dotenv"
import {__prod__} from './constants'
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

io.on('connection', (socket) => {
  socket.on('open', (e) => {
    console.log('Connection with client opened!!')
  })
  socket.emit('hello', 'world')
  socket.emit('testt', 'world')
  socket.emit('hello', 'world')
  if(!__prod__){
    socket.onAny((event, ...args) => {
      console.log(event, args);
    }); 
  }
  
})


server.listen(PORT, () => {
  console.log(`server running at port:${PORT}`)
})

