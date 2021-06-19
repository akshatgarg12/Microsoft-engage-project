import {Menu, Flex} from '@fluentui/react-northstar'
import { useState } from 'react';
import CreateMeeting from '../components/CreateMeeting'
import Members from '../components/Members'
import useHttps from '../hooks/useHttp';
import LoadingScreen from './Loading';

export interface TeamPageProps {
    
}
 
const TeamPage = (props:any):JSX.Element => {
    const [index, setIndex] = useState<number>(0);
    const {id} = props.match.params
    const {response, loading, error} = useHttps({
        path : '/team/' + id,
        method : 'GET',
    })
    if(loading){
        return <LoadingScreen />
    }
    if(error){
        console.log(error)
        return (<></>)
    }
    // console.log(response)
    return (
        <Flex style={{height:'90vh'}}>
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
                index === 0 && <CreateMeeting />   
            }
            {
                 index === 2 && <Members members={response.team.members} />
            }
        </Flex>
    );
}
 
export default TeamPage;