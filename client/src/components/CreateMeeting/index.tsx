import {Button, Flex, Image, Input} from '@fluentui/react-northstar'
import { useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoadingScreen from '../../Pages/Loading';
import { callAPI, CallAPIReducer } from '../../utils/http';
import classes from './style.module.css'

export interface CreateMeetingProps {
    teamId : string
}
 
const CreateMeeting = ({teamId}:CreateMeetingProps):JSX.Element => {
    /* 
        1. create a new meeting object in database.
        2. set person me as creator
        3. return id of the meeting and push to /meeting/id.
    */
    const [title, setTitle] = useState('')
    const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
        response : null,
        error : null,
        loading : false
    })
    const {response, loading, error} = httpState

    const history = useHistory()
    const createMeeting = async () => {
        try{
            if(!title){
                setTitle('Random Name')
            }
            httpDispatch({type:'LOADING'})
            const res = await callAPI({
                path:'/meeting/create',
                method : 'POST',
                body : {teamId, title}
            })
            httpDispatch({type:'RESPONSE', payload:res})
        }catch(e){
            httpDispatch({type:'ERROR', payload:e.message})
        }
    }
    if(loading){
        return <LoadingScreen />
    }
    if(error){
        console.log(error)
    }
    if(response){
        history.push('/meeting/' + response.meetingId)
    }
    return (
        <Flex column className={classes.container} hAlign="center" vAlign="center" gap="gap.small">
            <Image className={classes.image} src={window.location.origin + "/assets/image/group.png"} />
            <Input placeholder="Title..." value={title} onChange={(_, data) => setTitle(data?.value || '')} />
            <Button primary content = "Create a new meeting" onClick={createMeeting} />
        </Flex>
    );
}
 
export default CreateMeeting;