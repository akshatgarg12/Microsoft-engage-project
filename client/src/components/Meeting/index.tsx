/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState } from "react";
import { useEffect } from "react";
import socket from '../../config/socket'
import Peer from 'peerjs'
export interface MeetingProps {
    
}
const Video = (props:any) => {

    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(()=>{
        if(videoRef.current)
            videoRef.current.srcObject = props.stream
    }, [])
    return (
        <video ref={videoRef} autoPlay />
    )

}
const Meeting = (): JSX.Element => {
    const myVideo = useRef<HTMLVideoElement>(null)
    const [streams, setStreams] = useState<any>([])
    const peers:any = {}
    const ROOM_ID = '123456'
    const myPeer = new Peer()
    useEffect(()=>{
        // connect to the room
        socket.connect() 
        myPeer.on('open', id => {
            console.log(id)
            socket.emit('join-room', ROOM_ID, id)
        })
        // take the audio and video of myself
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video : true
        }).then(stream => {
            if(myVideo.current)
                myVideo.current.srcObject = stream
            
             // get the lists of users already in the meeting and connect to them 
             // from the event 'all-users'
            socket.on('all-users', (userIds) => {
                console.log("userIds: ", userIds)
                userIds.forEach((id:any) => connectToNewUser(id, stream))
            })

            // accept incoming calls
            myPeer.on('call', call => {
              call.answer(stream)
              call.on('stream', userVideoStream => {
                setStreams((prev:any) => [...prev, userVideoStream])
              })
            })
          
            // connect to new users
            socket.on('user-connected', userId => {
              console.log('new user connected')
              connectToNewUser(userId, stream)
            })
        })
        // if a user leaves destroy that p2p connection
        function connectToNewUser(userId:any, stream:any) {
            const call = myPeer.call(userId, stream)
            // const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                setStreams((prev:any) => [...prev, userVideoStream])
            //   addVideoStream(video, userVideoStream)
            })
            call.on('close', () => {
                console.log('remove disconnected user video')
                //   video.remove()
            })
            peers[userId] = call
        } 
    }, [])
    console.log(peers)
    return (
        <div>
            <video autoPlay ref = {myVideo} style={{width:'100px' ,height:'100px', objectFit:'cover', zIndex:1000}} />
            {
                streams.map((stream:any) => {
                    return <Video  stream = {stream} />
                })
            }
        </div>

    );
}
 
export default Meeting;