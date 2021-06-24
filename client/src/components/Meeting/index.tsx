/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useReducer } from "react";
import {Prompt, useHistory} from 'react-router-dom'
import {Flex} from '@fluentui/react-northstar'
import socket from '../../config/socket'
import Peer from "simple-peer";
import classes from './style.module.css'
import { callAPI, CallAPIReducer } from "../../utils/http";
import { useCallback } from "react";
export interface MeetingProps {
    meetingId : string
}
const Video = (props:any) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [peerError,setPeerError] = useState(false)
    const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
        response : null,
        loading : false,
        error: null
    })
    const {response} = httpState
    const getUserDetails = useCallback(async () => {
        try{
            httpDispatch({type : 'LOADING'})
            const r = await callAPI({
                path : '/user/' + props.info.userId,
                method : 'GET',
            })
            console.log(r)
            httpDispatch({type : 'RESPONSE', payload : r.user.name})    
        }catch(e){
            console.error(e)
            httpDispatch({type : 'ERROR', payload : e.message})
        }
    }, [props])

    useEffect(()=>{
        getUserDetails()
        props.peer.on("stream", (stream:any) => {
            if(videoRef.current)
                videoRef.current.srcObject = stream
        })
        props.peer.on('error', (e:any) => {
            console.log(e)
            setPeerError(true)
        })
    }, [])
    if(peerError) return null
    return (
        <div style={{background:'red', margin:'10px'}}>
            <video muted={true} className={classes.styledVideo} ref={videoRef} autoPlay />
            <div>{response && response}</div>
        </div>
    )

}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Meeting = ({meetingId}:MeetingProps): JSX.Element => {
    /* 
        1. first check whether the meeting exists and is active.
        2. get All current users through socket
        3. Handle on close and refresh events.
    */
 
    const [peers, setPeers] = useState<Array<any>>([]);
    const socketRef = useRef(socket);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<Array<any>>([]);
    const history = useHistory()

    // const getUserStream = async () => {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false })
    //     return stream
    // }
    // const stopUserStream = (stream:any) => {
    //     console.log(stream)
    //     stream.getTracks().forEach((track:any) => {
    //         console.log(track)
    //         track.stop()
    //     })
    // }

    useEffect(() => {
       // connect socket
       socketRef.current.connect()
       // get user media
       navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(stream => {
           if(userVideo.current)
               userVideo.current.srcObject = stream;
           // emit signal to join room
           socketRef.current.emit("join-meeting", meetingId);
           // if auth error
           socketRef.current.on("user-auth-fail", (payload) => {
               // push user back to dashboard
               socketRef.current.disconnect()
               history.push('/')
           })
           // get all users in the room
           socketRef.current.on("meeting-members", (payload : any) => {
               const {members, from} = payload
               console.log(payload)
               const peers:any = [];
               members && members.forEach((to:any) => {
                   const {socketId} = to;
                   // create peer of all members by sending signal 
                   const peer = sendOffer(to, from, stream);
                   peersRef.current.push({
                       peerID: socketId,
                       peer,
                   })
                   peers.push({peer, info : to});
               })
               setPeers(peers);
           })
           // when new user joins, wait for their signal and then accept and return an answer
           socketRef.current.on("user-offer", payload => {
               const {signal, from, to} = payload
               const peer = sendAnswer(signal, from, to, stream);
               // remove the one with socketId which has been destroyed
               peersRef.current.push({
                   peerID: from.socketId,
                   peer,
               })
               // const updatedPeers = [...peers].filter((p) =>{ 
               //     if(p.info.userId === from.userId) p.peer.destroy()
               //     return  p.info.userId !== from.userId
               // })
               // console.log(updatedPeers)
               // updatedPeers.push({peer, info : from})
               // console.log(updatedPeers)
               // setPeers(updatedPeers)
               setPeers((prev) => ([...prev, {peer, info:from}]))
           });

           socketRef.current.on("receive-answer", payload => {
               const {signal, from} = payload
               // check who sent the signal and accept it.(completes the handshake and establishes conn)
               const item = peersRef.current.find(p => p.peerID === from.socketId);
               item.peer.signal(signal);
           });
           socketRef.current.on("leave-meeting" , (payload) => {
               const socketId = socketRef.current.id
               peersRef.current.forEach((peer) => {
                   socketRef.current.emit("leaving", {from:socketId,to:peer.peerID})
               })
           })
           socketRef.current.on("leaving" , payload => {
               const {from} = payload
               peersRef.current = peersRef.current.filter((p) => {
                  if(p.peerID === from) p.peer.destroy()
                  return p.peerID !== from
               })
               // remove from peer array aswell
               const newPeerArray = [...peers].filter((p) => {
                   if(p.info.socketId === from) p.peer.destroy()
                   return p.info.socketId !== from
               })
               setPeers(newPeerArray)
           })
       })
       // stops to reload if done by mistake
       function confirmExit(){
           // eslint-disable-next-line no-restricted-globals
           const exit = confirm("Are you sure you want to reload?")
           if(exit){
               // leave meeting
               history.push('/')
           }else{
               console.log('unload event unmount')
           }
           return "";
       }
       function DestroyConnections(){
           socketRef.current.emit('leaving-meeting')
       }
       window.onbeforeunload = confirmExit;
       window.onunload = DestroyConnections;
       window.onclose = DestroyConnections;
       console.log(peers)
    }, []);

    function sendOffer(to:any, from:any, stream:any) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        // immediately fires off and sends offer to users in room
        peer.on("signal", signal => {
            socketRef.current.emit("sending-signal", { to, from, signal})
        })

        return peer;
    }

    function sendAnswer(offer:any, from:any, to:any,  stream:any) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        // accept the incoming signal
        peer.signal(offer);
        // fires off after incoming signal
        peer.on("signal", signal => {
            socketRef.current.emit("user-answer", { signal, to:from, from:to })
        })       
        return peer;
    }
    console.log(peers)
    return (
        <>
            <Flex wrap className={classes.container}>
                <video className={classes.styledVideo} autoPlay ref = {userVideo} />
                {
                    peers.map((value:any, index : any) => <Video key = {index} peer = {value.peer} info = {value.info} />)
                }
                
            </Flex>
            <Prompt
                when={true}
                message="Are you sure you want to leave?" />
        </>

    );
}
 
export default Meeting;