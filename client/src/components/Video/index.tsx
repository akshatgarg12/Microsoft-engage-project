import {Text} from '@fluentui/react-northstar'
import classes from './style.module.css'

export interface VideoProps {
    height : string,
    videoRef : React.RefObject<HTMLVideoElement>
    info : string
}
 
const Video = ({height, videoRef, info}:VideoProps):JSX.Element => {
    return (
        <div className={classes.peerVideoContainer} style={{height}}>
            <video className={classes.styledVideo} ref={videoRef} autoPlay />
            <div className={classes.overlay}><Text content={info} /></div>
        </div>
    );
}
 
export default Video;