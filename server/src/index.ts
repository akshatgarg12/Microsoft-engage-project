import http from 'http'
import express from 'express'
import {Request, Response} from 'express'
import {Server} from 'socket.io'
import API from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {RequestLogger} from 'reqlogs'
import { config } from "dotenv"
import {__prod__} from './constants'
import DatabaseConnection from './config/mongodb'
import isAuthenticated from './middleware/auth'
const app = express()
const PORT = Number(process.env.PORT) || 8080
const server = http.createServer(app)
import cookie from 'cookie'
import {getUserFromCookie} from './middleware/auth'
import Meeting from './models/meeting'
import User from './models/user'

config()
const RL = new RequestLogger({showLatestFirst:true, ignore_urls:['/sockets']})
// cookies
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});
// to make cookies work
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.set("trust proxy", 1);
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(RL.Webpage({url : '/logs'}))
app.use('/api',API)
app.get('/', isAuthenticated, (req:Request, res:Response) => {
  res.send("Hello World")
})

const io = new Server({
  path : '/sockets'
})
io.attach(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: true,
    cors:{
      origin:'http://localhost:3000',
      methods: ["GET", "POST"],
      credentials: true
    },
});


io.use(async (socket, next) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie || '')
  const user = cookies.user
  const userData = await getUserFromCookie(user)
  if(!userData){
    socket.emit('unauthorized', {id : socket.id})
    next(new Error("user not authorized"));
  }
  // @ts-ignore
  socket.user = userData
  next()
})
io.on('connection', socket => {
    //@ts-ignore
    const user = socket.user
    const socketId = socket.id
    socket.on('join-meeting', async (meetingId) => {
      // find if meeting exists and is active
      try{
        if(!user){
          socket.emit('user-auth-fail')
          socket.disconnect(true)
        }
        const meeting = await Meeting.findOne({_id : meetingId})
        if(meeting){
          if(meeting.active){
            // find the users in the meeting
            // send the meeting members to the new user who joined
            const from = {
              socketId, 
              userId : user._id
            }
            let n = meeting.inMeeting.length
            let userAlreadyInMeet = false
            for(let i = 0; i < n; i++){
              let member = meeting.inMeeting[i]
              if(String(member.userId) === String(user._id)){
                  // destroy this socketId and its peer conn
                  io.to(meeting.inMeeting[i].socketId).emit("leave-meeting");
                  meeting.inMeeting[i].socketId = socketId
                  userAlreadyInMeet = true
                  break
                }
            }
            if(!userAlreadyInMeet)
              meeting.inMeeting = [...meeting.inMeeting, from]
            const members = meeting.inMeeting.filter((mem:any) => String(mem.userId) !== String(user._id))
            socket.emit('meeting-members',{ members, from})
            socket.on('sending-signal', payload => {
              const {to, from, signal} = payload
              io.to(to.socketId).emit('user-offer', {signal, from, to})
            })
            socket.on('user-answer', payload => {
              const {signal, to, from} = payload
              io.to(to.socketId).emit('receive-answer', {signal, from})
            })
            socket.on("leaving", async (payload) => {
              const {from, to} = payload
              meeting.inMeeting = meeting.inMeeting.filter((mem:any) => mem.socketId !== from)
              io.to(to).emit("leaving", {from})
            })
            socket.on("leaving-meeting", () => {
              socket.emit('leave-meeting')
            })
            await meeting.save()
          }else{
            socket.emit('meeting-ended', 'Error: 400, Meeting has already ended')
          }
        }else{
          socket.emit('meeting-not-found', 'Error: 404, Meeting not found')
        }
      }catch(e){
        console.error(e)
        socket.emit('meeting-not-found', 'Error: 404, Meeting not found')
      }
    })
    
      /*  
       1. find if the room exists and is acitve 
       2. inMembers of room
       3. Add when a new user joins
       4. Remove when a user leaves 
       5. End the meeting event , set the active to false and remove all users
      */
});


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