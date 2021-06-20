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
    const roomID = meetingId;
    const history = useHistory()
    useEffect(() => {
        // connect socket
        socketRef.current.connect()
        // get user media
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false }).then(stream => {
            if(userVideo.current)
                userVideo.current.srcObject = stream;
            // emit signal to join room
            socketRef.current.emit("join room", roomID);
            // get all users in the room
            socketRef.current.on("all users", users => {
                const peers:any = [];
                users.forEach((userID:string) => {
                    // create peer of all members by sending signal 
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })
            // when new user joins, wait for their signal and then accept and return an answer
            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                // check who sent the signal and accept it.(completes the handshake and establishes conn)
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
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

    function createPeer(userToSignal:any, callerID:any, stream:any) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });
        // immediately fires off and sends offer to users in room
        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal:any, callerID:any, stream:any) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        // accept the incoming signal
        peer.signal(incomingSignal);
        // fires off after incoming signal
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
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