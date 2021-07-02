import { Flex, Avatar, Text, Input, Button } from '@fluentui/react-northstar'
import { callAPI, CallAPIReducer } from '../../utils/http'
import {useState, useReducer} from 'react'
import { validateEmail } from '../../constants'
import classes from './style.module.css'
export interface MembersProps {
  members: any[],
  teamId : string
}

const Members = ({ members, teamId }: MembersProps): JSX.Element => {
  const [addUser, setAddUser] = useState('')
  const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
    loading: false, response: null, error: null
  })

  const {loading, response, error} = httpState
  
  const addMemberHandler = async () => {
    // check for valid email first
    try{
      if(!validateEmail(addUser)){
        httpDispatch({type : 'ERROR', payload : 'Enter a valid email'})
        return
      }
      httpDispatch({type : 'LOADING'})
      const r = await callAPI({
        path: '/team/addMember',
        body : {
            email : addUser,
            teamId
        },
        method : 'POST'
      })
      httpDispatch({type : 'RESPONSE', payload : r})
    }catch(e){
      httpDispatch({type : 'ERROR', payload : e.message})
    }finally{
      setAddUser('')
    }
  }
  return (
    <Flex wrap className={classes.container} hAlign='center'>
      {
        members.map((obj: any) => {
          return (
            <Flex key={obj._id} column vAlign='center' hAlign='center' className={classes.member} gap='gap.small'>
              <Avatar
                name={obj.name.toUpperCase()}
                size='largest'
              />
              <Text content={obj.name.toUpperCase()} />
            </Flex>
          )
        })
      }
      <Flex column={true} hAlign="center" vAlign="center" gap="gap.small">
        <Input type="email" placeholder="Add user by email.." value={addUser} onChange={(e, data) => setAddUser(data?.value || '')}/>
        <Button content="add" loading={loading} onClick={addMemberHandler} />
        {
          error && <Text error content={error} />
        }
        {
          response && <Text success content={response.log} />
        }
      </Flex>
    </Flex>
  )
}

export default Members
