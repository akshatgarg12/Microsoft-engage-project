import Meeting from "../components/Meeting";

export interface MeetingPageProps {
    
}
 
const MeetingPage = (props:any):JSX.Element => {
    const {id} = props.match.params
    return (
        <Meeting meetingId = {id} />
    );
}
 
export default MeetingPage;