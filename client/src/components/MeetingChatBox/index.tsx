import {Flex, Text, Input} from '@fluentui/react-northstar'
import {CloseIcon, SendIcon} from '@fluentui/react-icons-northstar'
import classes from './style.module.css'
import { useState } from 'react'



export interface MeetingChatBoxProps {
    toggleChatBox : () => void
    chats : Array<any>
    sendChat : (message : any) => void
}
 
const MeetingChatBox = ({toggleChatBox, chats, sendChat}:MeetingChatBoxProps):JSX.Element => {
    const [message, setMessage] = useState('')
    const sendChatUtil = () => {
        if(message){
            sendChat(message)
        }
        setMessage('')
    }
  
    return (
        <Flex column={true} className={classes.chatbox} >
              <Flex space="between" className={classes.topSection} vAlign="center">
                    <Text color="brand" content="Chat Box" size="large" weight="semibold" />
                    <CloseIcon style={{color : 'purple'}} onClick={toggleChatBox} size="medium" outline />
              </Flex>
              
              <Flex column={true} className={classes.middleSection}>
                    <div className={classes.middleSectionDiv}>
                    {
                        chats.map(({from, message}, index) => {
                            return(
                                <Flex style={{textAlign: from==='me' ? 'right' : 'left'}} key={index} column={true} className={classes.chat}>
                                    <Text className={classes.sentBy} content={from} color="green" /> 
                                    <Text style={from === 'me' ? {paddingRight:'15px'} : {paddingLeft:'15px'}} className={classes.message} content={message} color="grey" /> 
                                </Flex>
                            )
                        })
                    }
                    </div>
              </Flex>

              <Flex hAlign="center" vAlign="center" space="between" gap="gap.small" className={classes.bottomSection}>
                <Input placeholder="type something.." value={message} onChange={(e, data) => setMessage(data?.value || '')} fluid />
                <SendIcon style={{color:'#293241'}} size="larger" onClick={sendChatUtil} />
              </Flex>
        </Flex>
    );
}
 
export default MeetingChatBox;