import { Form, FormInput, FormCheckbox, FormButton } from '@fluentui/react-northstar';

const RegisterForm = ():JSX.Element => (
  <Form
    style={{
        width:'90%',
        minWidth:'250px'
    }}
    onSubmit={() => {
      alert('Form submitted');
    }}
  >
        <FormInput fluid label="name" name="name" id="name" required showSuccessIndicator={false} />
        <FormInput fluid label="email" name="email" id="email" required showSuccessIndicator={false} />
        <FormInput fluid type="password" label="password" name="password" id="password" required showSuccessIndicator={false} />
        <FormCheckbox label="I agree to the Terms and Conditions" id="conditions" />
        <FormButton content="Submit" />
  </Form>
);

export default RegisterForm;