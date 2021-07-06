import {Text, Flex,} from '@fluentui/react-northstar'
import classes from './style.module.css'
import {MicIcon, MicOffIcon, CallVideoIcon, CallVideoOffIcon} from '@fluentui/react-icons-northstar'

export interface VideoProps {
    height : string,
    videoRef : React.RefObject<HTMLVideoElement>
    info : string
    muted : boolean
    streamState : {
        audio : boolean,
        video : boolean
    }
}
 
const Video = ({height, videoRef, info, streamState, muted=false}:VideoProps):JSX.Element => {
    return (
        <div className={classes.peerVideoContainer} style={{height}}>
            <video className={classes.styledVideo} ref={videoRef} autoPlay muted={muted} /> 
            <Flex style={{maxWidth:'90%'}} className={classes.overlay} gap="gap.small" vAlign="center" >
                {
                    streamState.audio ? <MicIcon /> : <MicOffIcon />
                }
                {
                    streamState.video ? <CallVideoIcon /> : <CallVideoOffIcon />
                }
                <Text content={info} />
            </Flex>
        </div>
    );
}
 
export default Video;