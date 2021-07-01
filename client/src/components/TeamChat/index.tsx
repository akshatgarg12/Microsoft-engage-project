import { Flex, Text, Input, Button } from "@fluentui/react-northstar";
import classes from './style.module.css'
import socket from '../../config/socket'
import { useRef, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useHttps from "../../hooks/useHttp";
import LoadingScreen from "../../Pages/Loading";

export interface TeamChatProps {
    teamId : string   
}
export interface ChatProps{
    _id : string
    from : string
    message : string
}
const Chat = ({_id, from, message}:ChatProps) => {
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
const TeamChat = ({teamId} : TeamChatProps):JSX.Element => {
    const socketRef = useRef(socket)
    const [chats, setChats] = useState<Array<ChatProps>>([])
    const [message, setMessage] = useState('')
    const {user} = useAuth()
    const {response, loading, error} = useHttps({
        path: '/chat',
        method:'POST',
        body: {teamId}
    })
    useEffect(() => {
        socketRef.current.connect()
        socketRef.current.on('new-chat', (payload:any) => {
            receiveChat(payload)
        })
    }, [])
    useEffect(() => {
        if(response){
            setChats((prev) => [response.chats,...prev])
        }
    }, [response])
    
    const sendChat = () => {
        const payload = {message}
        socketRef.current.emit('send-chat' , payload)
    }
    const receiveChat = ({_id, from, message}:ChatProps) => {
        setChats((prev) => ([...prev, {_id, from, message}]))
    }

    if(loading) return <LoadingScreen />
    if(error) console.log(error)
    return (
        <Flex column = {true} style={{width:'100%'}}>
            <Flex column = {true} className={classes.chatbox}>
                {
                    chats.map((chat) => {
                        const {_id, from, message} = chat
                        return (
                            <Chat key={_id} _id = {_id} from={from === user.email ? 'me' : user.email} message={message} />
                        )
                    })
                }
            </Flex>
            <Flex vAlign="end">
                <Input placeholder="Send a message..." value={message} onChange={(e, data) => setMessage(data?.value || '')} fluid />
                <Button content="send" onClick={sendChat} />
            </Flex>
        </Flex>
    );
}
 
export default TeamChat;