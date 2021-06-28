/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from 'react'
import { Prompt, useHistory } from 'react-router-dom'
import { Button, Flex, Input } from '@fluentui/react-northstar'
import socket from '../../config/socket'
import Peer from 'simple-peer'
import classes from './style.module.css'
import PeerVideo from '../PeerVideo'
export interface MeetingProps {
  meetingId: string
}

const Meeting = ({ meetingId }: MeetingProps): JSX.Element => {
  /*
        1. first check whether the meeting exists and is active.
        2. get All current users through socket
        3. Handle on close and refresh events.
        4. If the person is the creator of meeting, give an option to end the meeting
    */
  const [peers, setPeers] = useState<any[]>([])
  const [userLeft, setUserLeft] = useState(false)
  const [userToInvite, setUserToInvite] = useState<any>('')
  const [streamOptions, setStreamOptions] = useState({
    video: true,
    audio: false
  })
  const userStream = useRef<MediaStream | null>(null)
  const socketRef = useRef(socket)
  const userVideo = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<any[]>([])
  const history = useHistory()

  // stops to reload if done by mistake
  function confirmExit () {
    // eslint-disable-next-line no-restricted-globals
    const exit = confirm('Are you sure you want to reload?')
    if (exit) {
      // leave meeting
      window.location.replace('/')
    } else {
      console.log('unload event unmount')
    }
    return ''
  }
  function DestroyConnections () {
    socketRef.current.emit('leaving-meeting')
  }
  function LeaveMeeting () {
    try {
      peers.forEach(({ peer }) => {
        peer.destroy()
      })
    } catch (e) {
      console.log(e)
    } finally {
      setUserLeft(true)
      CloseMedia()
      window.location.replace('/')
    }
  }
  function CloseMedia () {
    (userStream.current != null) && userStream.current.getTracks().forEach((track) => {
      console.log(track)
      track.stop()
    })
  }
  function SendInvite () {
    // send some sort of link or btn to join
    if (userToInvite) {
      const to = userToInvite
      const info = 'Join the meeting : ' + meetingId
      socketRef.current.emit('send-notification', { to, info })
    }
  }
  useEffect(() => {
    try {
      peers.forEach(({ peer }) => {
        if ((userStream.current != null) && !peer.destroyed) {
          peer.addStream(userStream.current)
        }
      })
    } catch (e) {
      // console.error(e)
    }
  }, [userStream.current])

  useEffect(() => {
    CloseMedia()
    const { audio, video } = streamOptions
    if (!audio && !video) {
      if (userVideo.current != null) {
        userVideo.current.srcObject = null
      }
    } else {
      navigator.mediaDevices.getUserMedia(streamOptions).then((stream) => {
        // get this new stream and customise the stream to all peers
        userStream.current = stream
        if (userVideo.current != null) { userVideo.current.srcObject = userStream.current }
      })
    }
  }, [streamOptions])

  useEffect(() => {
    try {
      // connect socket
      socketRef.current.connect()
      // get user media
      navigator.mediaDevices.getUserMedia(streamOptions).then(stream => {
        userStream.current = stream
        if (userVideo.current != null) { userVideo.current.srcObject = stream }
        // emit signal to join room
        socketRef.current.emit('join-meeting', meetingId)
        // if auth error
        socketRef.current.on('user-auth-fail', (payload) => {
          // push user back to dashboard
          socketRef.current.disconnect()
          history.push('/')
        })
        // get all users in the room
        socketRef.current.on('meeting-members', (payload: any) => {
          const { members, from } = payload
          console.log(payload)
          const peers: any = []
          members && members.forEach((to: any) => {
            // create peer of all members by sending signal
            const peer = sendOffer(to, from, userStream.current)
            peersRef.current.push({
              info: to,
              peer
            })
            peers.push({ peer, info: to })
          })
          setPeers(peers)
        })
        // when new user joins, wait for their signal and then accept and return an answer
        socketRef.current.on('user-offer', payload => {
          const { signal, from, to } = payload
          const peer = sendAnswer(signal, from, to, userStream.current)
          // remove the one with socketId which has been destroyed
          peersRef.current.push({
            info: from,
            peer
          })

          setPeers((prev) => ([...prev, { peer, info: from }]))
        })

        socketRef.current.on('receive-answer', payload => {
          const { signal, from } = payload
          // check who sent the signal and accept it.(completes the handshake and establishes conn)
          const item = peersRef.current.find(p => p.info === from)
          // if(!item.peer.destroyed)
          item.peer.signal(signal)
        })

        // socketRef.current.on("leave-meeting" , (payload) => {
        //     peersRef.current.forEach(({info}) => {
        //         socketRef.current.emit("leaving", {to:info, from:socketRef.current.id})
        //     })
        // })
        // socketRef.current.on("leaving" , payload => {
        //     const {from} = payload
        //     peersRef.current = peersRef.current.filter((p) => {
        //         if(p.peerID === from) p.peer.destroy()
        //         return p.peerID !== from
        //     })
        //     // remove from peer array aswell
        //     const newPeerArray = [...peers].filter((p) => {
        //         if(p.info.socketId === from) p.peer.destroy()
        //         return p.info.socketId !== from
        //     })
        //     setPeers(newPeerArray)
        // })

        socketRef.current.on('meeting-not-found', payload => {
          (userStream.current != null) && userStream.current.getTracks().forEach((track) => {
            console.log(track)
            track.stop()
          })
          history.push('/')
        })
      })

      window.onbeforeunload = confirmExit
      window.onunload = DestroyConnections
      window.onclose = DestroyConnections
      console.log(peers)
    } catch (e) {
      // console.log(e)
      history.push('/')
    }
  }, [])

  function sendOffer (to: any, from: any, stream: any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    })
    // immediately fires off and sends offer to users in room
    peer.on('signal', signal => {
      socketRef.current.emit('sending-signal', { to, from, signal })
    })
    return peer
  }

  function sendAnswer (offer: any, from: any, to: any, stream: any) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    })
    // accept the incoming signal
    peer.signal(offer)
    // fires off after incoming signal
    peer.on('signal', signal => {
      socketRef.current.emit('user-answer', { signal, to: from, from: to })
    })
    return peer
  }
  // console.log(peers)
  return (
    <>
      <Flex space='between' wrap>
        <Flex hAlign='center'>
          <Input placeholder='User Email...' value={userToInvite} onChange={(e, data) => setUserToInvite(String(data?.value) || '')} />
          <Button content='Invite' onClick={SendInvite} />
        </Flex>
        <Flex hAlign='center'>
          <Button content='leave' onClick={LeaveMeeting} />
          <Button content={streamOptions.audio ? 'Audio Off' : 'Audio On'} onClick={() => setStreamOptions((prev) => ({ ...prev, audio: !streamOptions.audio }))} />
          <Button content={streamOptions.video ? 'Video Off' : 'Video On'} onClick={() => setStreamOptions((prev) => ({ ...prev, video: !streamOptions.video }))} />
        </Flex>
      </Flex>
      <Flex hAlign='center'>
        <video className={classes.myVideo} autoPlay ref={userVideo} />
      </Flex>
      {/* change container style based on the number of peers */}
      {/* if less than =  2 : side by side */}
      {/* else one big and others in small box, onClick to make it big. */}
      <Flex wrap className={classes.container}>
        {
          peers.map((value: any, index: any) => <PeerVideo key={value.info}  peer={value.peer} info={value.info} />)
        }
      </Flex>
      <Prompt
        when={!userLeft}
        message='Are you sure you want to leave?'
      />
    </>

  )
}

export default Meeting
