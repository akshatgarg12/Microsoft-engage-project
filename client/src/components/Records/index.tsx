import { Button, Flex, Text } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'
import classes from './style.module.css'
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
  const history = useHistory()
  const redirectToMeeting = (_id: string) => history.push('/meeting/' + _id)
  return (
    <div className={classes.record}>
      <Flex space='between'>
        <Text content={title} />
        <Text content={creator.name} />
      </Flex>
      <br />
      <Flex gap='gap.medium' space='between' vAlign='center'>
        <div style={{ width: '50%' }}>
          {attendedBy.map((user: any) => <Text content={user.name + ' '} key={user._id} />)}
        </div>
        {
          active
            ? <Button content='Join Meeting' onClick={() => redirectToMeeting(_id)} />
            : <Text content='meeting ended' />
        }
      </Flex>
    </div>
  )
}

export interface TeamRecordsProps {
  meetings: RecordsProps[]
}
const TeamRecords = ({ meetings }: TeamRecordsProps): JSX.Element => {
  return (
    <Flex column gap='gap.small' className={classes.container}>
      {
        meetings.map((meeting) => {
          const { _id, title, creator, attendedBy, active } = meeting
          return (
            <Records key={_id} _id={_id} title={title} creator={creator} attendedBy={attendedBy} active={active} />
          )
        })
      }
    </Flex>
  )
}

export default TeamRecords
