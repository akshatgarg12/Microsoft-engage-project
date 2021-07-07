import { useEffect } from 'react'
import socket from '../../config/socket'
import { useToasts } from 'react-toast-notifications'
import {Text, Button, Flex} from '@fluentui/react-northstar'
import useAuth from '../../hooks/useAuth'

export interface NotificationListenerProps {

}

const NotificationListener = ({ children }: any): JSX.Element => {
  const { addToast } = useToasts()
  const {user} = useAuth()
  const redirectToMeeting = (meetingId: string) => window.location.replace('/meeting/' + meetingId)
  const redirectToTeam = (teamId: string) => window.location.replace('/team/' + teamId)
  useEffect(() => {
    socket.on('notification', (info) => {
      console.log(info)
      const {type, message} = info
      if(type === 'meeting invite'){
        const content = (
          <Flex column={true} gap="gap.small">
            <Text content={message} weight="bold" />
            <Button content="Join" primary fluid onClick={() => redirectToMeeting(info.meetingInfo._id)}/>
          </Flex>
        )
        addToast(content, { apperance: 'success' })
      }
      if(type === 'new team chat'){
        // if i send it dont push notify
        const {from, message, teamId} = info.chatInfo
        if(from === user.email) return
        const content = (
          <Flex column={true} gap="gap.small">
            <Text content={info.message} weight="semibold" />
            <Button content="open team" fluid onClick={() => redirectToTeam(teamId)}/>
            <Text content={message.toString()} weight="semibold" />
          </Flex>
        )
        addToast(content, { apperance: 'info' })
      }
      console.log('Notification : ', info)
    })
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast])

  return (
    <>
      {children}
    </>
  )
}

export default NotificationListener
