import {Button, Flex, Image} from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom';

export interface CreateMeetingProps {
    
}
 
const CreateMeeting = ():JSX.Element => {
    const history = useHistory()
    const createMeeting = () => history.push('/meeting') 
    return (
        <Flex column style={{height:'100%', width:'70%'}} hAlign="center" vAlign="center">
            <Image style={{maxHeight:'75%',height:'250px', width:'300px', maxWidth:'75%'}} src={window.location.origin + "/assets/image/meet.jpeg"} />
            <Button primary content = "Create a new meeting" onClick={createMeeting} />
        </Flex>
    );
}
 
export default CreateMeeting;