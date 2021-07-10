import { Button, Flex, Text } from '@fluentui/react-northstar'
import { CallVideoIcon } from '@fluentui/react-icons-northstar'
import {Chat} from '../TeamChat'
import classes from './style.module.css'
import useAuth from '../../hooks/useAuth'
import useHttps from '../../hooks/useHttp'
import { useEffect, useState } from 'react'
export interface UserInfo{
  _id: string
  name: string
}
export interface RecordsProps {
  _id: string
  title: string
  creator: UserInfo
  attendedBy: UserInfo[]
  active: boolean
}
const Records = ({ _id, title, creator, attendedBy, active }: RecordsProps): JSX.Element => {
  const redirectToMeeting = (_id: string) => window.location.replace('/meeting/' + _id)
  const [chats, setChats] = useState<Array<any>>([])
  const [showChat, setShowChat] = useState(false)
  const {response} = useHttps({
    path : '/meeting/chat',
    method : 'POST',
    body  : {meetingId : _id}
  })
  useEffect(()=>{
    if(response){
      setChats(response.chats)
    }
  },[response])
  const {user} = useAuth()
  return (
    <Flex column={true} style={{width:'90%', margin:'auto', padding:'12px'}}>
      <div className={classes.record}>
        <Flex space='between'>
          <Text content={title} weight="bold" />
          <Text content={'Started by ' + creator.name} />
        </Flex>
        <br />
        <Flex gap='gap.medium' space='between' vAlign='center'>
          <div style={{ width: '50%' }}>
            <Button content={showChat ? 'hide chat' : 'show chat'} onClick={() => setShowChat(!showChat)}/>
          </div>
          {
            active
              ? <Button icon={<CallVideoIcon />} content='Join Meeting' onClick={() => redirectToMeeting(_id)} />
              : <Text content='meeting ended' />
          }
        </Flex>
      </div>
      {
        showChat && <Flex column = {true} className={classes.chatbox}>
          {
              response && chats.length ? chats.map((chat) => {
                  const {_id, from, message} = chat
                  return (
                      <Chat key={_id} _id = {_id} from={from === user.email ? 'me' : from} message={message} />
                  )
              }) : <Text content="No Chats Found for this meeting 👀" /> 
          }
          <hr className={classes.line}/>
          <Text content="Join the meet to send messages👋🏼" /> 
       </Flex>
      }
    </Flex>
  )
}

export interface TeamRecordsProps {
  meetings: RecordsProps[]
}
const TeamRecords = ({ meetings }: TeamRecordsProps): JSX.Element => {
  return (
    <Flex column gap='gap.small' className={classes.container}>
      {
        meetings.length ? 
        meetings.map((meeting) => {
          const { _id, title, creator, attendedBy, active } = meeting
          return (
            <Records key={_id} _id={_id} title={title} creator={creator} attendedBy={attendedBy} active={active} />
          )
        }) : (
            <Text align="center" weight="bold" size="large" content="No Records found! Start by creating a new meeting👨🏻‍💻!" />
        )
      }
    </Flex>
  )
}

export default TeamRecords
