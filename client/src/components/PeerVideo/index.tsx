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
  
  useEffect(() => {
    peer.on('stream', (stream: any) => {
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
    peer.on('data', (payload) => {
      console.log(payload)
    })
    if (peer.destroyed) setPeerError(true)
  }, [peer])

 
  if (peerError) return null

  return (
    <Video videoRef={videoRef} info={info} height={height} muted={false} />
  )
}

export default PeerVideo
