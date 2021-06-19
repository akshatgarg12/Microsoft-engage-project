import { Flex, Avatar, Text } from "@fluentui/react-northstar";
import classes from './style.module.css'
export interface MembersProps {
    members : Array<any>
}
 
const Members = ({members}:MembersProps):JSX.Element => {
    return (
        <Flex wrap className={classes.container} hAlign="center">
            {
                members.map((obj:any) => {
                   return (
                       <Flex key={obj._id} column vAlign="center" hAlign="center" className={classes.member} gap="gap.small">
                            <Avatar
                                name = {obj.name.toUpperCase()}
                                size = "largest"
                            />
                            <Text content={obj.name.toUpperCase()} />
                        </Flex>
                    )
                })  
            }
        </Flex>
    );
}
 
export default Members;