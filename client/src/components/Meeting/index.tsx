/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import {Prompt, useHistory} from 'react-router-dom'
import {Flex} from '@fluentui/react-northstar'
import socket from '../../config/socket'
import Peer from "simple-peer";
import classes from './style.module.css'
export interface MeetingProps {
    meetingId : string
}
const Video = (props:any) => {

    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(()=>{
        props.peer.on("stream", (stream:any) => {
            if(videoRef.current)
                videoRef.current.srcObject = stream
        })
    }, [])
    return (
        <video muted={true} className={classes.styledVideo} ref={videoRef} autoPlay />
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
    useEffect(() => {
        // connect socket
        socketRef.current.connect()
        // get user media
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(stream => {
            if(userVideo.current)
                userVideo.current.srcObject = stream;
            // emit signal to join room
            socketRef.current.emit("join-meeting", meetingId);
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
                    peers.push(peer);
                })
                setPeers(peers);
            })
            // when new user joins, wait for their signal and then accept and return an answer
            socketRef.current.on("user-offer", payload => {
                const {signal, from, to} = payload
                const peer = sendAnswer(signal, from, to, stream);
                peersRef.current.push({
                    peerID: from.socketId,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receive-answer", payload => {
                const {signal, from} = payload
                // check who sent the signal and accept it.(completes the handshake and establishes conn)
                const item = peersRef.current.find(p => p.peerID === from.socketId);
                item.peer.signal(signal);
            });
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
        window.onbeforeunload = confirmExit;
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

    return (
        <>
            <Flex wrap className={classes.container}>
                <video className={classes.styledVideo} autoPlay ref = {userVideo} />
                {
                    peers.map((peer:any, index : any) => {
                        return <Video key = {index} peer = {peer} />
                    })
                }
                
            </Flex>
            <Prompt
                when={true}
                message="Are you sure you want to leave?" />
        </>

    );
}
 
export default Meeting;