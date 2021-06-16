import { Flex, Image, Text, Avatar, Card } from '@fluentui/react-northstar';
import { useHistory } from 'react-router-dom';
;
const TeamCard = ():JSX.Element => {
    const history = useHistory()
    const redirectToTeamPage = (id:any) => history.push(`/team/1`)

    return (
    <Card onClick={redirectToTeamPage} aria-roledescription="card with avatar, image and text" style={{margin:'5px auto'}}>
        <Card.Header>
            <Flex gap="gap.small">
                {/* Photo of person  */}
                <Avatar
                    name="Cecil Folk"
                    status={{
                        color: 'green',
                        title: 'Available',
                    }}
                />
            <Flex column>
                <Text content="Name of Team" weight="bold" />
                <Text content="Created By" size="small" />
            </Flex>
            </Flex>
        </Card.Header>
        <Card.Body>
            {/* A random image */}
            <Image src="https://fabricweb.azureedge.net/fabric-website/assets/images/wireframe/square-image.png" fluid />
        </Card.Body>
    </Card>
    )
  };

export default TeamCard;