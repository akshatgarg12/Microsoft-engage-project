import { Form, FormInput, FormCheckbox, FormButton, Text } from '@fluentui/react-northstar';
import { useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthReducerActionType } from '../../../context/Auth';
import useAuth from '../../../hooks/useAuth';
import { callAPI, CallAPIReducer } from '../../../utils/http';

interface LoginFormData{
  email : string,
  password : string
}

const LoginForm = ():JSX.Element | null => {
  const [formData, setFormData] = useState<LoginFormData>({
    email : '',
    password : ''
  })
  const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
    error:null,
    response:null,
    loading:false
  })
  const {error, response, loading} = httpState
  const {dispatch} = useAuth()
  const history = useHistory()
  const onChangeHandler = (e:any, data:any) => {
    const {name, value} = data
    setFormData((prev:LoginFormData) => ({...prev, [name]:value}))
  }
  const onSubmitHandler = async (e:any) => {
    e.preventDefault()
    httpDispatch({type:'LOADING'})
    try{
      const r = await callAPI({
        path: '/login',
        method : 'POST',
        body : formData
      })
      httpDispatch({type:'RESPONSE', payload: r})
      dispatch({type : AuthReducerActionType.LOGIN, payload : r.user})
      history.push('/')
      return null
    }catch(e){
      httpDispatch({type:'ERROR',payload: e.message})
    }
  }
 
  return(
    <Form
      style={{
        width:'90%',
        minWidth:'250px'
      }}
      onSubmit={onSubmitHandler}
    >
          <FormInput value={formData.email} onChange={onChangeHandler} fluid label="email" name="email" id="email" required showSuccessIndicator={false} />
          <FormInput value={formData.password} onChange={onChangeHandler} fluid type="password" label="password" name="password" id="password" required showSuccessIndicator={false} />
          <FormCheckbox label="keep me logged in" id="conditions" />
          <FormButton loading={loading} content="Submit" />
          {
            error &&  <Text error content={error} />
          }
          {
            response &&  <Text success content={response.log} />
          }
    </Form>
  );
}

export default LoginForm;