import { useState, useRef, useEffect } from 'react'
import SimplePeer from 'simple-peer'
import classes from './style.module.css'

interface PeerVideoProps{
  peer: SimplePeer.Instance
  info: any
}
const PeerVideo = ({ peer, info}: PeerVideoProps) => {
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
      console.log(JSON.parse(payload))
    })
    if (peer.destroyed) setPeerError(true)
  }, [peer])

 
  if (peerError) return null

  return (
    <div className={classes.peerVideoContainer}>
      <video className={classes.styledVideo} ref={videoRef} autoPlay />
      <div>{info}</div>
    </div>
  )
}

export default PeerVideo
