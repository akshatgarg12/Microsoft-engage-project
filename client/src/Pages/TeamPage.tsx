import {Menu, Flex} from '@fluentui/react-northstar'
import { useState } from 'react';
import CreateMeeting from '../components/CreateMeeting'

export interface TeamPageProps {
    
}
 
const TeamPage = ():JSX.Element => {
    const [index, setIndex] = useState<number>(0);
    return (
        <Flex wrap style={{height:'90vh'}}>
            <Menu
                style={{
                    height:"100%",
                    width:"275px",
                    maxWidth:"30%",
                }}
                items={[
                    'Meeting',
                    'Records',
                    'Members',
                    'Chats'
                ]}
                primary
                vertical
                defaultActiveIndex={index}
                onActiveIndexChange={(e, data) => setIndex(Number(data?.activeIndex) || 0)}
            />
            {
                index === 0 ? <CreateMeeting /> : null
            }
        </Flex>
    );
}
 
export default TeamPage;