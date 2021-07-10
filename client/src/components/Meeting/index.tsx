/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Flex, Input, Button, Text, Tooltip } from '@fluentui/react-northstar'
import { CallVideoIcon, CallVideoOffIcon, MicIcon, MicOffIcon,CallEndIcon,ChatIcon, BellIcon,ClipboardCopiedToIcon} from '@fluentui/react-icons-northstar'
import Video from '../Video'
import socket from '../../config/socket'
import Peer from 'simple-peer'
import classes from './style.module.css'
import PeerVideo from '../PeerVideo'
import useAuth from '../../hooks/useAuth'
import MeetingChatBox from '../MeetingChatBox'
import { validateEmail } from '../../constants'
export interface MeetingProps {
  meetingId: string
}

const Meeting = ({ meetingId }: MeetingProps): JSX.Element => {
  const [peers, setPeers] = useState<any[]>([])
  const {user} = useAuth()
  const {addToast} = useToasts()
  const [userToInvite, setUserToInvite] = useState<any>('')
  const [chats, setChats] = useState<Array<any>>([])
  const [showChat, setShowChat] = useState(false)
  const [streamOptions, setStreamOptions ] = useState({
    video: true,
    audio: true
  })
  const userStream = useRef<MediaStream | null>(null)
  const socketRef = useRef(socket)
  const userVideo = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<any[]>([])
  const history = useHistory()
  const [meetingInfo, setMeetingInfo] = useState<any>(null)
  const streamConstraints:MediaStreamConstraints = {
    audio : {
        sampleSize: 8,
        echoCancellation : true,
        noiseSuppression : true
    },
    video : {
      frameRate: 30,
      width: 700,
      height: 900,
    }
  }
  const controlBtnStyles = {
    height:'3rem',
    width:'3rem',
    color:'white'
  }
  // Utility Functions
  function confirmExit () {
    const exit = window.confirm('Are you sure you want to reload?')
    if (exit) {
      window.location.replace('/')
    } else {
      console.log('unload event unmount')
    }
    return ''
  }
  function LeaveMeeting (direct = false) {
    if(!direct){
      const confirm = window.confirm('Are you sure you want to leave this meeting?')
      if(!confirm) return
    }
    try {
      peers.forEach(({ peer }) => {
        peer.destroy()
      })
    } catch (e) {
      console.log(e)
    } finally {
      CloseMedia()
      window.location.replace('/')
    }
  }
  function CloseMedia () {
    (userStream.current != null) && userStream.current.getTracks().forEach((track) => {
      track.stop()
    })
  }
  // Add the stream to peer
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
    try {
      // connect socket
      socketRef.current.connect()
      // get user media
      navigator.mediaDevices.getUserMedia(streamConstraints).then(stream => {
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
        // get meeting info
        socketRef.current.on('meeting-info', (payload) => {
          setMeetingInfo(payload)
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

        socketRef.current.on('meeting-not-found', payload => {
          (userStream.current != null) && userStream.current.getTracks().forEach((track) => {
            console.log(track)
            track.stop()
          })
          history.push('/')
        })
      })

      window.onbeforeunload = confirmExit
      window.onclose = () => LeaveMeeting(true)
      console.log(peers)
    } catch (e) {
      history.push('/')
    }
  }, [])

  useEffect(() => {
    const payload = {
      type : 'streamState',
      ...streamOptions
    }
    peers.forEach(({peer}) => { 
      if(!peer.destroyed)
        peer.send(JSON.stringify(payload))
    })
  }, [streamOptions])

  useEffect(()=> {
    peers.forEach(({peer}) => {
      peer.on('data', (data:any) => {
        // recived a chat. add it to the chat box
        const payload = JSON.parse(data)
        if(payload.type === 'chat')
          receiveChat(payload)
      })
    })
  }, [peers])

  // Functions to handle peer connections
  function sendOffer (to: any, from: any, stream: any) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: [
          {
            "urls": "stun:numb.viagenie.ca",
            "username": 'akshatarungarg78@gmail.com',
            "credential": 'Fiitjee!123'
          },
          {
            "urls": "turn:numb.viagenie.ca",
            "username": "akshatarungarg78@gmail.com",
            "credential": "Fiitjee!123"
          }
        ]
      }
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
      stream,
      iceTransportPolicy: 'relay',
      config: {
        iceServers: [
          {
            "urls": "stun:numb.viagenie.ca",
            "username": 'btech10251.19@bitmesra.ac.in',
            "credential": 'password'
          },
          {
            "urls": "turn:numb.viagenie.ca",
            "username": "btech10251.19@bitmesra.ac.in",
            "credential": "password"
          }
        ]
      }
    })
    // accept the incoming signal
    peer.signal(offer)
    // fires off after incoming signal
    peer.on('signal', signal => {
      socketRef.current.emit('user-answer', { signal, to: from, from: to })
    })
    return peer
  }
  
  // Function to send Invite
  function SendInvite () {
    // send some sort of link or btn to join
    if (userToInvite && validateEmail(userToInvite)) {
      const to = userToInvite
      const info = {
        type : 'meeting invite',
        meetingInfo:{
          title : meetingInfo?.title,
          _id : meetingId
        }, 
        message : 'Join the meeting : ' + meetingInfo?.title
      }
      socketRef.current.emit('send-notification', { to, info })
      addToast('Invitation sent!', {appearance:'info'})
    }
  }
  const copyMeetingLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    addToast('Meeting link copied!', {appearence : 'success'})
  }
  // Functions to handle Chat 
  const sendChat = (message:string) => {
    const payload = {
      type : 'chat',
      from : user.name,
      message 
    }
    peers.forEach(({peer}) => { 
      if(!peer.destroyed)
        peer.send(JSON.stringify(payload))
    })
    setChats((prev) => ([...prev, {from : 'me', message}]))
  }
  const receiveChat = (payload:any) => {
    const {from, message} = payload
    setChats((prev) => ([...prev, {from, message}]))
    if(!showChat){
      addToast('new chat received!', {appearance:'info'})
    }
  }
  const toggleChatBox = () => setShowChat((prev) => !prev)

  // Media Control Functions
  const stopAudio = () => {
    userStream.current?.getAudioTracks().forEach((track) => track.enabled = false)
    setStreamOptions((prev) => ({...prev, audio:false}))
  }
  const stopVideo = () => {
    userStream.current?.getVideoTracks().forEach((track) => track.enabled = false)
    setStreamOptions((prev) => ({...prev, video:false}))
  }
  const startVideo = async () => {
    userStream.current?.getVideoTracks().forEach((track) => track.enabled = true)
    setStreamOptions((prev) => ({...prev, video:true}))
  }
  const startAudio = async () => {
    userStream.current?.getAudioTracks().forEach((track) => track.enabled = true)
    setStreamOptions((prev) => ({...prev, audio:true}))
  }

  const height = peers.length <= 2 ? '95%' : '70%'
  return (
    <div className={classes.container}>
        {
          meetingInfo && 
          <Flex hAlign="center" vAlign="center" space="between" style={{height:'40px', width:'100%', background:'#323131', color:'white', padding:'10px'}} >
           <Text content={meetingInfo?.title.toUpperCase()} /> 
           <Button icon={<ClipboardCopiedToIcon />} content="Meeting Link" onClick={copyMeetingLinkToClipboard} />
          </Flex>
        }
      <Flex column={true} className={classes.meeting} gap="gap.smaller">
        <Flex hAlign='center' vAlign='center' gap="gap.small" className = {classes.topSection}>
          <Input placeholder='Invite User Email...' value={userToInvite} onChange={(e, data) => setUserToInvite(String(data?.value) || '')} />
          <Tooltip
            trigger={<Button icon={<BellIcon />} circular primary onClick={SendInvite} />}
            content="Send Invite"
          />
          <Tooltip
            trigger={<Button icon={<ChatIcon />} content="Chatbox" onClick={toggleChatBox} />}
            content="Open Chatbox"
          />
        </Flex>
        <Flex wrap className={classes.videoContainer}>
          <Video streamState={streamOptions} videoRef={userVideo} info={'Myself'} height={height} muted={true} />
          {
            peers.map((value: any, index: any) => <PeerVideo key={value.info} height={height} peer={value.peer} info={value.info} />)
          }
        </Flex>

        <Flex hAlign='center' vAlign="end" gap="gap.large" className={classes.control }>
            {
              streamOptions.video ? 
              <Button circular className={classes.whiteIcon} icon={<CallVideoIcon />} onClick={stopVideo} style={controlBtnStyles} />
              : <Button circular className={classes.redIcon} icon={<CallVideoOffIcon />} onClick={startVideo} style={controlBtnStyles} />
            }
              <Button circular className={classes.redIcon} icon={<CallEndIcon />} onClick={() => LeaveMeeting()} style={controlBtnStyles} />
            {
              streamOptions.audio ? 
              <Button circular className={classes.whiteIcon} icon={<MicIcon />} onClick={stopAudio} style={controlBtnStyles} />
              : <Button circular className={classes.redIcon} icon={<MicOffIcon />} onClick={startAudio} style={controlBtnStyles} />
            }
        </Flex>
      </Flex>

      {
       showChat && <MeetingChatBox toggleChatBox = {toggleChatBox} chats = {chats} sendChat = {sendChat} />
      }
    </div>

  )
}

export default Meeting
