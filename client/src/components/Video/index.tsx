import {Text} from '@fluentui/react-northstar'
import classes from './style.module.css'

export interface VideoProps {
    height : string,
    videoRef : React.RefObject<HTMLVideoElement>
    info : string
    muted : boolean
}
 
const Video = ({height, videoRef, info, muted=false, ...rest}:VideoProps):JSX.Element => {
    return (
        <div className={classes.peerVideoContainer} style={{height}}>
            <video className={classes.styledVideo} ref={videoRef} autoPlay muted={muted} />
            <div className={classes.overlay}><Text content={info} /></div>
        </div>
    );
}
 
export default Video;