import {useState, useRef, useEffect} from 'react'
// import {useReducer, useCallback} from 'react' 
// import {callAPI, CallAPIReducer} from '../../utils/http'
import SimplePeer from 'simple-peer'
import classes from './style.module.css'

interface PeerVideoProps{
    peer : SimplePeer.Instance,
    info : any
}
const PeerVideo = ({peer, info}:PeerVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [peerError,setPeerError] = useState(false)
    // const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
    //     response : null,
    //     loading : false,
    //     error: null
    // })
    // const {response} = httpState
    // const getUserDetails = useCallback(async () => {
    //     try{
    //         httpDispatch({type : 'LOADING'})
    //         const r = await callAPI({
    //             path : '/user/' + info.userId,
    //             method : 'GET',
    //         })
    //         console.log(r)
    //         httpDispatch({type : 'RESPONSE', payload : r.user.name})    
    //     }catch(e){
    //         console.error(e)
    //         httpDispatch({type : 'ERROR', payload : e.message})
    //     }
    // }, [info])

    useEffect(()=>{
        // getUserDetails()
        peer.on("stream", (stream:any) => {
            if(videoRef.current)
                videoRef.current.srcObject = stream
        })
        peer.on('error', (e:any) => {
            console.log(e)
            setPeerError(true)
        })
        peer.on('close', () => {
            setPeerError(true)
        })
        if(peer.destroyed) setPeerError(true)
    }, [peer])

    if(peerError) return null

    return (
        <div className={classes.peerVideoContainer}>
            <video className={classes.styledVideo} ref={videoRef} autoPlay />
            <div>{info}</div>
        </div>
    )

}

export default PeerVideo