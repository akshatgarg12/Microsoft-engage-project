import { Form, FormInput, FormCheckbox, FormButton } from '@fluentui/react-northstar';

const LoginForm = ():JSX.Element => (
  <Form
    style={{
      width:'90%',
      minWidth:'250px'
    }}
    onSubmit={() => {
      alert('Form submitted');
    }}
  >
        <FormInput fluid label="email" name="email" id="email" required showSuccessIndicator={false} />
        <FormInput fluid type="password" label="password" name="password" id="password" required showSuccessIndicator={false} />
        <FormCheckbox label="keep me logged in" id="conditions" />
        <FormButton content="Submit" />
  </Form>
);

export default LoginForm;