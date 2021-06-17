import {Button, Flex, Image} from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom';
import classes from './style.module.css'

export interface CreateMeetingProps {
    
}
 
const CreateMeeting = ():JSX.Element => {
    const history = useHistory()
    const createMeeting = () => history.push('/meeting') 
    return (
        <Flex column className={classes.container} hAlign="center" vAlign="center">
            <Image className={classes.image} src={window.location.origin + "/assets/image/group.png"} />
            <Button primary content = "Create a new meeting" onClick={createMeeting} />
        </Flex>
    );
}
 
export default CreateMeeting;