import { Form, FormInput, FormCheckbox, FormButton, Text } from '@fluentui/react-northstar';
import { useState } from 'react';
import useHttps from '../../../hooks/useHttp';

interface LoginFormData{
  email : string,
  password : string
}

const LoginForm = ():JSX.Element => {
  const [trigger, setTrigger] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email : '',
    password : ''
  })
  const {response,error,loading} = useHttps({
      path:'/login',
      method:'POST',
      body:formData,
      trigger, 
      setTrigger
  })
  const onChangeHandler = (e:any, data:any) => {
    const {name, value} = data
    setFormData((prev:LoginFormData) => ({...prev, [name]:value}))
  }
  const onSubmitHandler = (e:any) => {
    e.preventDefault()
    setTrigger(true)
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