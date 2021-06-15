import {Button, Flex, TeamCreateIcon } from '@fluentui/react-northstar'
import TeamCard from '../components/TeamCard';

export interface DashboardProps {
    
}
 
const Dashboard = (): JSX.Element => {
    return (
       <div style={{minHeight:'90vh'}}>
           <div style={{textAlign:'right', padding:'12px'}}>
                <Button icon={<TeamCreateIcon />} content="Create a new team" title="Create" />
           </div>
           <Flex wrap style={{width:'90%', maxWidth:'800px', margin:'auto'}}>
                {   
                    [1,2,3,4].map((num) => {
                        return <TeamCard key={num} />
                    })
                }
           </Flex>
       </div>
    );
}
 
export default Dashboard;