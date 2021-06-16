/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react";
import { useEffect } from "react";
import socket from '../../config/socket'
import Peer from "simple-peer";
export interface MeetingProps {
    
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
        <video ref={videoRef} autoPlay />
    )

}

const videoConstraints = {
height: window.innerHeight / 2,
width: window.innerWidth / 2
};

const Meeting = (): JSX.Element => {
    const [peers, setPeers] = useState<Array<any>>([]);
    const socketRef = useRef(socket);
    const userVideo = useRef<HTMLVideoElement>(null);
    const peersRef = useRef<Array<any>>([]);
    const roomID ='123456';

    useEffect(() => {
        socket.connect()
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            if(userVideo.current)
                userVideo.current.srcObject = stream;

            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers:any = [];
                users.forEach((userID:string) => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal:any, callerID:any, stream:any) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

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

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div>
            <video autoPlay ref = {userVideo} style={{width:'100px' ,height:'100px', objectFit:'cover', zIndex:1000}} />
            {
                peers.map((peer:any, index : any) => {
                    return <Video  key = {index} peer = {peer} />
                })
            }
        </div>

    );
}
 
export default Meeting;