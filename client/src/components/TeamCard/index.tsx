import { Flex, Image, Text, Avatar, Card } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'

export interface TeamCardProps{
  teamId: string
  name: string
  creator: any
}

const TeamCard = ({ teamId, name, creator }: TeamCardProps): JSX.Element => {
  const history = useHistory()
  const redirectToTeamPage = (id: any) => history.push('/team/' + teamId)
  return (
    <Card onClick={redirectToTeamPage} aria-roledescription='card with avatar, image and text' style={{ margin: '5px auto' }}>
      <Card.Header>
        <Flex gap='gap.small'>
          {/* Photo of person */}
          <Avatar
            name={creator.name.toUpperCase()}
            status={{
              color: 'green',
              title: 'Available'
            }}
          />
          <Flex column>
            <Text content={name.toUpperCase()} weight='bold' />
            <Text content={'Created by: ' + creator.name.toUpperCase()} size='small' />
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body>
        {/* A random image */}
        <Image src='https://picsum.photos/150?grayscale' fluid />
      </Card.Body>
    </Card>
  )
}

export default TeamCard
