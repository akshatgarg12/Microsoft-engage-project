import {Button, Flex, TeamCreateIcon } from '@fluentui/react-northstar'
import TeamCard from '../components/TeamCard';
import useHttps from '../hooks/useHttp';
import LoadingScreen from './Loading';

export interface DashboardProps {
    
}
 
const Dashboard = (): JSX.Element => {
    const {response, error, loading} = useHttps({
        path : '/teams',
        method : 'GET'
    })
    if(loading){
        return <LoadingScreen />
    }
    if(error){
        // show error screen
    }
    return (
       <div style={{minHeight:'90vh'}}>
           <div style={{textAlign:'right', padding:'12px'}}>
                <Button icon={<TeamCreateIcon />} content="Create a new team" title="Create" />
           </div>
           <Flex wrap style={{width:'90%', maxWidth:'800px', margin:'auto'}}>
                {   
                    response && response.teams.map(((team:any,idx:number) => {
                        return <TeamCard key={idx} />
                    }))
                }
           </Flex>
       </div>
    );
}
 
export default Dashboard;