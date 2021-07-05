import { Menu, Flex, Text } from '@fluentui/react-northstar'
import { useState } from 'react'
import CreateMeeting from '../components/CreateMeeting'
import Members from '../components/Members'
import TeamRecords from '../components/Records'
import TeamChat from '../components/TeamChat'
import DeleteTeam from '../components/DeleteTeam'
import useAuth from '../hooks/useAuth'
import useHttps from '../hooks/useHttp'
import ErrorPage from './Error'
import LoadingScreen from './Loading'
export interface TeamPageProps {

}

const TeamPage = (props: any): JSX.Element => {
  const [index, setIndex] = useState<number>(0)
  const { id } = props.match.params
  const {user} = useAuth()
  const { response, loading, error } = useHttps({
    path: '/team/' + id,
    method: 'GET'
  })
  if (loading) {
    return <LoadingScreen />
  }
  if (error) {
    return <ErrorPage statusCode = {404} error={error} />
  }
  const showOptionToDelete = user._id === response?.team.creator._id
  const menu = [
    'Meeting',
    'Records',
    'Members',
    'Chats'
  ]
  if(showOptionToDelete){
    menu.push('Settings')
  }
  return (
    <>
      <Flex>
        <Text content={response?.team.name.toUpperCase()} style={{width:'100%', background:'#323131', color:'white', padding:'10px'}} /> 
      </Flex>
      <Flex style={{ height: '90vh' }}>
        <Menu
          style={{
            height: '100%',
            width: '275px',
            maxWidth: '30%'
          }}
          items={menu}
          primary
          vertical
          defaultActiveIndex={index}
          onActiveIndexChange={(e, data) => setIndex(Number(data?.activeIndex) || 0)}
        />
        {
          index === 0 && <CreateMeeting teamId={id} />
        }
        {
          index === 1 && <TeamRecords meetings={response.meetings} />
        }
        {
          index === 2 && <Members teamId = {id} members={response.team.members} />
        }
        {
          index === 3 && <TeamChat teamId={id} />
        }
        {
          index === 4 && <DeleteTeam teamId={id} />
        }
      </Flex>
    </>
  )
}

export default TeamPage
