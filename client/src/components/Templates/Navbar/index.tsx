import {Avatar, Flex, Text} from '@fluentui/react-northstar'
import { AcceptIcon } from '@fluentui/react-icons-northstar'
import classes from './style.module.css'

const Navbar = ():JSX.Element => {
    console.log(classes)
    return (
        <Flex space="between" style={{background:'#3a3942', color:'white'}}>
           <Text content="Microsoft engage" className={`${classes.center} ${classes.logo}`} /> 
           <Flex gap="gap.small">
                <h4>User Name</h4>
                <Avatar
                    className={classes.center}
                    name="User name"
                    status={{
                        color: 'green',
                        icon: <AcceptIcon />,
                        title: 'Available',
                    }}
                />
           </Flex> 
        </Flex>
    );
}
 
export default Navbar;