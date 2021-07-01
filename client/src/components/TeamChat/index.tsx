import { Flex, Text, Input, Button } from "@fluentui/react-northstar";
import classes from './style.module.css'

export interface TeamChatProps {
    
}
 
const Chat = ({from, message}:any) => {
    const hAlign = from === 'me' ? 'end' : 'start'
    const textAlign = from === 'me' ? 'right' :  'left'
    return (
        <Flex hAlign={hAlign}>
            <Flex column = {true} hAlign={hAlign} className={classes.chat} style={{textAlign}}>
                <Text className={classes.fromchat} content={from}/>
                <Text content={message} />
            </Flex>
        </Flex>
    )
}
const TeamChat = ():JSX.Element => {
    // fetch chats of this team
    // socket connect for new chats
    return (
        <Flex column = {true} style={{width:'100%'}}>
            <Flex column = {true} className={classes.chatbox}>
                <Chat from="me" message="message is this Some message is this Some message is this Some message is this Some message is this"/>
                <Chat from="akshat" message="Some message is this Some message is this Some message is thisSome message is this Some message is this Some message is this Some message is this Some message is this"/>
            </Flex>
            <Flex vAlign="end">
                <Input placeholder="Send a message..." fluid />
                <Button loading={true} content="send" />
            </Flex>
        </Flex>
    );
}
 
export default TeamChat;