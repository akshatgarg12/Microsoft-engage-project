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
    origin: true,
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
      origin:'*'
    }
});


const users:any = {};

const socketToRoom:any = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
      /*
       1. find if the room exists and is acitve 
       2. inMembers of room
       3. Add when a new user joins
       4. Remove when a user leaves 
       5. End the meeting event , set the active to false and remove all users
      */
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter((id:any) => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter((id:any) => id !== socket.id);
            users[roomID] = room;
        }
    });

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