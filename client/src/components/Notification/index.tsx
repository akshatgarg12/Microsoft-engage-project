import { useEffect } from 'react'
import socket from '../../config/socket'
import { useToasts } from 'react-toast-notifications'
import {Text, Button, Flex} from '@fluentui/react-northstar'

export interface NotificationListenerProps {

}

const NotificationListener = ({ children }: any): JSX.Element => {
  const { addToast } = useToasts()

  const redirectToMeeting = (meetingId: string) => window.location.replace('/meeting/' + meetingId)
  useEffect(() => {
    socket.on('notification', (info) => {
      const {type, message} = info
      console.log(info.meetingInfo._id)
      if(type === 'meeting invite'){
        const content = (
          <Flex column={true} gap="gap.small">
            <Text content={message} weight="bold" />
            <Button content="Join" primary fluid onClick={() => redirectToMeeting(info.meetingInfo._id)}/>
          </Flex>
        )
        addToast(content, { apperance: 'success' })
      }
      console.log('Notification : ', info)
    })
  }, [addToast])

  return (
    <>
      {children}
    </>
  )
}

export default NotificationListener
