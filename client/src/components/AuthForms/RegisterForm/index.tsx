import { Form, FormInput, FormCheckbox, FormButton, Text } from '@fluentui/react-northstar';
import { useReducer, useState } from 'react';
import { callAPI, CallAPIReducer } from '../../../utils/http';

interface RegisterFormData{ 
  name : string,
  email : string,
  password : string
}

const RegisterForm = ():JSX.Element => {
    const [formData, setFormData] = useState<RegisterFormData>({
      name : '',
      email : '',
      password : ''
    })
    const [httpState, httpDispatch] = useReducer(CallAPIReducer, {
      error:null,
      response:null,
      loading:false
    })
    const {error, response, loading} = httpState
   
    const onChangeHandler = (e:any, data:any) => {
      const {name , value} = data
      setFormData((prev:RegisterFormData) => ({...prev, [name]:value}))
    }
    const onSubmitHandler = async (e:any) => {
      e.preventDefault()
      httpDispatch({type:'LOADING'})
      try{
        const r = await callAPI({
          path: '/register',
          method : 'POST',
          body : formData
        })
        httpDispatch({type:'RESPONSE', payload: r})
      }catch(e){
        httpDispatch({type:'ERROR',payload: e.message})
      }
    }

    return (
      <Form
        style={{
            width:'90%',
            minWidth:'250px'
        }}
        onSubmit={onSubmitHandler}
      >
            <FormInput value={formData.name} onChange={onChangeHandler} fluid label="name" name="name" id="name" required showSuccessIndicator={false} />
            <FormInput value={formData.email} onChange={onChangeHandler} fluid label="email" name="email" id="email" required showSuccessIndicator={false} />
            <FormInput value={formData.password} onChange={onChangeHandler} fluid type="password" label="password" name="password" id="password" required showSuccessIndicator={false} />
            <FormCheckbox label="I agree to the Terms and Conditions" id="conditions" />
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

export default RegisterForm;