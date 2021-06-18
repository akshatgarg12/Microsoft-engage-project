import {Avatar, Flex, Text} from '@fluentui/react-northstar'
import { AcceptIcon } from '@fluentui/react-icons-northstar'
import classes from './style.module.css'
import { useHistory } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

const Navbar = ():JSX.Element => {
    const history = useHistory()
    const {user} = useAuth()
    const redirectToDashboard = () => history.push('/')
    return (
        <Flex space="between" style={{background:'#3a3942', color:'white', minHeight:'3rem'}}>
           <Text onClick = {redirectToDashboard} content="Microsoft engage" className={`${classes.center} ${classes.logo}`} /> 
           {
               user && 
               <Flex gap="gap.small">
                    <h4>{user.name.toUpperCase()}</h4>
                    <Avatar
                        className={classes.center}
                        name={user.name.toUpperCase()}
                        status={{
                            color: 'green',
                            icon: <AcceptIcon />,
                            title: 'Available',
                        }}
                    />
                </Flex> 
           }
        </Flex>
    );
}
 
export default Navbar;