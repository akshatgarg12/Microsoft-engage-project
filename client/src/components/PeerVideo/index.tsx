import { useState, useRef, useEffect } from 'react'
import SimplePeer from 'simple-peer'
import Video from '../Video'
interface PeerVideoProps{
  peer: SimplePeer.Instance
  info: any
  height : string
}
const PeerVideo = ({ peer, info, height}: PeerVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [peerError, setPeerError] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)
  const [streamState, setStreamState] = useState({
    audio : true,
    video : true
  })
  useEffect(() => {
    peer.on('stream', (stream: MediaStream) => {
      streamRef.current = stream
      if (videoRef.current != null) { videoRef.current.srcObject = streamRef.current }
    })
    peer.on('error', (e: any) => {
      console.log(e)
      setPeerError(true)
    })
    peer.on('close', () => {
      setPeerError(true)
    })
    peer.on('data', (data) => {
      // get the stream state, and update in UI
      const payload = JSON.parse(data)
      if(payload.type === 'streamState'){
        const {audio, video} = payload
        setStreamState({audio, video})
      }
    })
    if (peer.destroyed) setPeerError(true)
  }, [peer])

 
  if (peerError) return null

  return (
    <Video streamState={streamState} videoRef={videoRef} info={info} height={height} muted={false} />
  )
}

export default PeerVideo
