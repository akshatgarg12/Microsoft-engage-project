import {Form , FormInput, FormButton, Text, Flex, Button, CloseIcon} from '@fluentui/react-northstar'
import { useReducer } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { callAPI, CallAPIReducer } from '../../utils/http';

export interface CreateTeamFormProps {
    
}
export interface CreateTeamFormData{
    name : string,
    members : Set<string>
}
const CreateTeamForm = ():JSX.Element => {
    const [formData, setFormData] = useState<CreateTeamFormData>({
        name : '',
        members : new Set()
    })
    const history = useHistory()
    const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
        response : null,
        loading : false,
        error: null
    })
    const {response, loading, error} = httpState
    const [member, setMember] = useState<string>('')
    const onChangeHandler = (e:any, data:any) => {
        const {name, value} = data
        setFormData(prev => ({...prev, [name]:value}))
    }
    const onMemberValueChange = (e:any, data:any) => {
        const {value} = data
        setMember(value)
    }   
    const onMemberAdd = () => {
        if(member !== '' && member){
            setFormData(prev => ({...prev, members : prev.members.add(member)}))
            setMember('')
        }
    }
    const onMemberRemove = (member:string) => {
        let newMemberSet = formData.members
        newMemberSet.delete(member)
        setFormData(prev => ({...prev, members : newMemberSet}))
    }
    const onSubmitHandler = async (e:any) => {
        e.preventDefault()
        // remove if any value is empty
        try{
            httpDispatch({type : 'LOADING'})
            const r = await callAPI({
                path : '/teams',
                method : 'POST',
                body : formData
            })
            httpDispatch({type : 'RESPONSE', payload : r.teamId})    
        }catch(e){
            console.error(e)
            httpDispatch({type : 'ERROR', payload : e.message})
        }
    }
    if(response){
        history.push('/team/' + response)
    }
    if(error){
        console.error(error)
    }
    return (
        <Form
            style={{
                width:'30%',
                minWidth:'250px'
            }}
        >
          <FormInput fluid value={formData.name} onChange={onChangeHandler} label="Name of Team" name="name" id="name" required showSuccessIndicator={false} />
          <FormInput fluid value={member} onChange={onMemberValueChange} label="Add Members" name="member" id="members" showSuccessIndicator={false} />
          <FormButton content="Add a member" onClick={onMemberAdd} />
          {
                Array.from(formData.members).map((member:string) => {
                    return (
                        <Flex vAlign="center" space="between">
                            <Text content = {member} />
                            <Button onClick={() => onMemberRemove(member)} icon={<CloseIcon />} text />
                        </Flex>
                    )
              })    
          }
          <FormButton loading={loading} content="Submit" onClick={onSubmitHandler} />
        </Form>
    );
}
 
export default CreateTeamForm;