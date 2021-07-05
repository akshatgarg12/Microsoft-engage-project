import { Flex, Text, Button } from "@fluentui/react-northstar";
import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { setTimeout } from "timers";
import { CallAPIReducer, callAPI } from "../../utils/http";
export interface DeleteTeamProps {
    teamId : string
}
 
const DeleteTeam = ({teamId} : DeleteTeamProps):JSX.Element => {
    const [httpState, httpDispatch] = useReducer(CallAPIReducer , {
        response : null,
        loading : false,
        error : null
    })  
    const {response, error, loading} = httpState
    const history = useHistory()
    const deleteHandler = async () => {
        const confirm = window.confirm('Are you sure you want to delete this Team ? ')
        if(!confirm) return
        try{
            httpDispatch({type:'LOADING'})
            const r = await callAPI({
                path : '/teams',
                method : 'DELETE',
                body : {teamId}
            })
            httpDispatch({type:'RESPONSE', payload : r})    
            // wait for 2 secs and redirect to dashboard
            setTimeout(() => {
                history.replace('/')
            },2000)
        }catch(e){
            httpDispatch({type:'ERROR', payload : e.message})
        }
    }
    if(error){
        console.error(error)
    }
    return (
        <Flex column = {true} hAlign="center" vAlign="center" style={{height:'100%', width:'90%', margin:'auto'}} gap="gap.medium">
            <Text align="center" error weight="bold" content="Deleting the team will delete all the data like Records/Meetings history and chats, This action cannot be reversed." />
            <Button loading={loading} onClick={deleteHandler} content="Delete Team"/>
            
            {
                error && 
                <Text error content={error} />
            }
            {
                response && 
                <Text success content={response.log} />
            }
        </Flex>
    );
}
 
export default DeleteTeam;