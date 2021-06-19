import CreateTeamForm from "../components/CreateTeamForm"
import {Flex} from '@fluentui/react-northstar'
export interface CreateTeamPageProps {
    
}
 
const CreateTeamPage = ():JSX.Element => {
    return (
       <Flex style={{minHeight:'90vh'}} vAlign="center" hAlign="center">
           <CreateTeamForm />
       </Flex> 
    );
}
 
export default CreateTeamPage;