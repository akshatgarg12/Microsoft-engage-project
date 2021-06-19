import {Button, Flex, TeamCreateIcon } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom';
import TeamCard from '../components/TeamCard';
import useHttps from '../hooks/useHttp';
import LoadingScreen from './Loading';

export interface DashboardProps {
    
}
 
const Dashboard = (): JSX.Element => {
    const history = useHistory()
    const redirectToCreateTeamPage = () => history.push('/team/create')
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
                <Button icon={<TeamCreateIcon />} content="Create a new team" title="Create" onClick={redirectToCreateTeamPage} />
           </div>
           <Flex wrap style={{width:'90%', maxWidth:'800px', margin:'auto'}}>
                {   
                    response && response.teams.map(((team:any,idx:number) => {
                        return (
                                <TeamCard 
                                    key={team._id} 
                                    teamId = {team._id}
                                    name = {team.name}
                                    creator = {team.creator}
                                />
                                )
                    }))
                }
           </Flex>
       </div>
    );
}
 
export default Dashboard;